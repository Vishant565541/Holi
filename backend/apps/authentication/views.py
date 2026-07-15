"""
Authentication Views — Secure Email OTP System
Provides:
  - send_otp     POST /api/auth/send-otp
  - verify_otp   POST /api/auth/verify-otp
  - resend_otp   POST /api/auth/resend-otp
  - register_user (legacy compat)
  - login_user   (legacy compat — delegates to send_otp)
  - update_profile
  - UserViewSet
"""

import random
import hashlib
import re
from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password, check_password
from django.core.mail import send_mail, EmailMultiAlternatives
from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import OTPVerification
from .serializers import UserSerializer, RegisterSerializer, ProfileSerializer

User = get_user_model()

# ─── Constants ────────────────────────────────────────────────────────────────
OTP_EXPIRY_MINUTES = 5
RESEND_COOLDOWN_SECONDS = 60
MAX_ATTEMPTS = 5
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$')


# ─── Helpers ──────────────────────────────────────────────────────────────────

def get_tokens_for_user(user):
    """Generate JWT access + refresh token pair with custom claims."""
    refresh = RefreshToken.for_user(user)
    refresh['name'] = user.name
    refresh['email'] = user.email
    refresh['role'] = user.role
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


def _generate_otp() -> str:
    """Return a cryptographically random 6-digit OTP string."""
    return f"{random.SystemRandom().randint(100000, 999999)}"


def _hash_otp(otp: str) -> str:
    """Hash the OTP using Django's PBKDF2 hasher (same as password hashing)."""
    return make_password(otp)


def _verify_otp_hash(otp: str, hashed: str) -> bool:
    """Verify a plaintext OTP against its stored hash."""
    return check_password(otp, hashed)


def _build_otp_email_html(otp: str, email: str) -> str:
    """Build a professional dark-mode HTML email with the OTP."""
    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Verification Code</title>
</head>
<body style="margin:0;padding:0;background-color:#040814;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#040814;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0"
               style="background:linear-gradient(135deg,#091225 0%,#0d1a35 100%);
                      border-radius:16px;overflow:hidden;
                      border:1px solid rgba(191,148,72,0.2);
                      box-shadow:0 20px 60px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(90deg,#BF9448,#D4AF37);
                       padding:28px 40px;text-align:center;">
              <h1 style="margin:0;color:#040814;font-size:22px;font-weight:800;
                          letter-spacing:3px;text-transform:uppercase;">
                AURA TRAVELS
              </h1>
              <p style="margin:4px 0 0;color:rgba(4,8,20,0.7);font-size:12px;
                         letter-spacing:2px;text-transform:uppercase;">
                Premium Aviation & Luxury Travel
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:48px 40px 40px;">
              <h2 style="margin:0 0 8px;color:#F5F7FA;font-size:26px;font-weight:700;">
                Your Verification Code
              </h2>
              <p style="margin:0 0 32px;color:#9FB3C8;font-size:15px;line-height:1.6;">
                Hello! We received a sign-in request for&nbsp;
                <strong style="color:#D4AF37;">{email}</strong>.
                Use the code below to complete your verification.
              </p>
              <!-- OTP Box -->
              <div style="background:rgba(191,148,72,0.08);border:2px solid rgba(191,148,72,0.3);
                           border-radius:12px;padding:28px;text-align:center;margin-bottom:32px;">
                <p style="margin:0 0 8px;color:#9FB3C8;font-size:12px;
                            letter-spacing:3px;text-transform:uppercase;">
                  One-Time Passcode
                </p>
                <p style="margin:0;color:#D4AF37;font-size:48px;font-weight:800;
                            letter-spacing:16px;font-family:monospace;">
                  {otp}
                </p>
                <p style="margin:12px 0 0;color:#9FB3C8;font-size:13px;">
                  Valid for <strong style="color:#F5F7FA;">{OTP_EXPIRY_MINUTES} minutes</strong>
                </p>
              </div>
              <p style="margin:0 0 16px;color:#9FB3C8;font-size:14px;line-height:1.6;">
                For your security, never share this code with anyone — including
                AURA Travels staff. If you did not request this code, please
                ignore this email. Your account remains secure.
              </p>
              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:28px 0;"/>
              <p style="margin:0;color:#9FB3C8;font-size:13px;line-height:1.6;">
                Need help?&nbsp;
                <a href="mailto:support@auratravels.com"
                   style="color:#D4AF37;text-decoration:none;">support@auratravels.com</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:rgba(0,0,0,0.3);padding:20px 40px;text-align:center;">
              <p style="margin:0;color:rgba(159,179,200,0.5);font-size:12px;">
                © 2026 AURA Travels. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
""".strip()


def _send_otp_email(email: str, otp: str) -> None:
    """Send the OTP via email (HTML + plain text fallback).
    
    In development (console email backend), the OTP is also printed
    prominently to the terminal so it can be used for testing.
    """
    subject = "Your Verification Code — AURA Travels"
    plain_text = (
        f"Hello,\n\nYour AURA Travels verification code is: {otp}\n\n"
        f"It is valid for {OTP_EXPIRY_MINUTES} minutes.\n\n"
        "If you did not request this, please ignore this email.\n\n"
        "Best regards,\nAURA Travels Team\nsupport@auratravels.com"
    )
    html_content = _build_otp_email_html(otp, email)

    # ── Always print OTP to console in development ──────────────────────────
    # NOTE: No emojis here — Windows terminal uses cp1252 which can't handle them.
    try:
        print("\n" + "=" * 60, flush=True)
        print(f"  [OTP] EMAIL : {email}", flush=True)
        print(f"  [OTP] CODE  : {otp}", flush=True)
        print(f"  [OTP] VALID : {OTP_EXPIRY_MINUTES} minutes", flush=True)
        print("=" * 60 + "\n", flush=True)
    except Exception:
        pass  # Never crash the request just because of a print
    # ────────────────────────────────────────────────────────────────────────

    # ── Check for Resend API Key ─────────────────────────────────────────────
    # If RESEND_API_KEY is defined in environment, send via Resend REST API.
    # Otherwise, fallback to Django's configured email backend (SMTP/Console).
    import os
    import requests
    resend_api_key = os.getenv('RESEND_API_KEY')
    
    if resend_api_key:
        try:
            from_email = os.getenv('DEFAULT_FROM_EMAIL', 'AURA Travels <onboarding@resend.dev>')
            # If using Resend's free tier domain, from must be onboarding@resend.dev
            if "onboarding@resend.dev" in from_email or not from_email:
                from_email = "onboarding@resend.dev"
                
            res = requests.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {resend_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": from_email,
                    "to": [email],
                    "subject": subject,
                    "html": html_content,
                    "text": plain_text,
                },
                timeout=10
            )
            if res.status_code in [200, 201]:
                print(f"[RESEND EMAIL SUCCESS] Successfully sent OTP to {email}", flush=True)
                return
            else:
                print(f"[RESEND EMAIL ERROR] Failed to send: {res.status_code} - {res.text}", flush=True)
        except Exception as exc:
            print(f"[RESEND EMAIL EXCEPTION] Failed to send OTP to {email}: {exc}", flush=True)

    # Fallback to standard Django Email Backend (SMTP or Console)
    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=plain_text,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)
    except Exception as exc:
        # Log the error but do not expose it to the client
        print(f"[OTP EMAIL ERROR] Failed to send OTP to {email}: {exc}", flush=True)


def _create_or_replace_otp(email: str) -> str:
    """
    Generate a new OTP, hash it, and upsert the OTPVerification record.
    Deletes all previous records for this email first (invalidates old OTPs).
    Returns the plaintext OTP so it can be emailed.
    """
    otp = _generate_otp()
    now = timezone.now()

    # Delete old records to invalidate previous OTPs
    OTPVerification.objects.filter(email=email).delete()

    OTPVerification.objects.create(
        email=email,
        otp_hash=_hash_otp(otp),
        expires_at=now + timedelta(minutes=OTP_EXPIRY_MINUTES),
        last_sent_at=now,
        attempts=0,
        is_verified=False,
    )
    return otp


# ─── New Secure API Endpoints ─────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    """
    POST /api/auth/send-otp
    Body: { "email": "user@example.com" }
    Validates email, enforces 60s rate-limit, generates+hashes OTP, emails it.
    """
    email = request.data.get('email', '').strip().lower()

    # Input validation
    if not email:
        return Response({"error": "Email address is required."}, status=status.HTTP_400_BAD_REQUEST)
    if not EMAIL_REGEX.match(email):
        return Response({"error": "Please enter a valid email address."}, status=status.HTTP_400_BAD_REQUEST)

    # Rate-limit: check if a code was sent in the last 60 seconds
    existing = OTPVerification.objects.filter(email=email).order_by('-last_sent_at').first()
    if existing:
        seconds_since_last = (timezone.now() - existing.last_sent_at).total_seconds()
        if seconds_since_last < RESEND_COOLDOWN_SECONDS:
            wait = int(RESEND_COOLDOWN_SECONDS - seconds_since_last)
            return Response(
                {"error": f"Too many requests. Please wait {wait} seconds before requesting a new code."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

    # Get or create user account
    try:
        user = User.objects.get(email=email)
        is_new = False
    except User.DoesNotExist:
        user = User.objects.create_user(email=email, name='', role='customer')
        user.is_active = False
        user.save()
        is_new = True

    # Generate OTP, store securely, send email
    otp = _create_or_replace_otp(email)
    _send_otp_email(email, otp)

    return Response({
        "message": "Verification code sent to your email.",
        "email": email,
        "isNew": is_new,
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """
    POST /api/auth/verify-otp
    Body: { "email": "user@example.com", "code": "123456" }
    Verifies OTP (with expiry + attempt limit), returns JWT tokens.
    """
    email = request.data.get('email', '').strip().lower()
    code = str(request.data.get('code', '')).strip()

    if not email or not code:
        return Response(
            {"error": "Email and verification code are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Sanitize: code must be exactly 6 digits
    if not re.fullmatch(r'\d{6}', code):
        return Response(
            {"error": "Verification code must be exactly 6 digits."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Fetch the latest OTP record
    otp_record = OTPVerification.objects.filter(email=email).order_by('-created_at').first()
    if not otp_record:
        return Response(
            {"error": "No verification code found. Please request a new one."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Check if already verified (prevent replay)
    if otp_record.is_verified:
        return Response(
            {"error": "This code has already been used. Please request a new one."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Check attempt limit (brute-force protection)
    if otp_record.is_locked():
        return Response(
            {"error": "Too many incorrect attempts. Please request a new verification code."},
            status=status.HTTP_429_TOO_MANY_REQUESTS,
        )

    # Check expiry
    if otp_record.is_expired():
        return Response(
            {"error": "OTP Expired. Please request a new verification code."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Verify hash
    if not _verify_otp_hash(code, otp_record.otp_hash):
        # Increment attempt counter
        otp_record.attempts += 1
        otp_record.save(update_fields=['attempts'])
        remaining = MAX_ATTEMPTS - otp_record.attempts
        if remaining <= 0:
            return Response(
                {"error": "Too many incorrect attempts. Please request a new verification code."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )
        return Response(
            {"error": f"Invalid OTP. {remaining} attempt(s) remaining."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # ✅ OTP is correct — mark verified
    otp_record.is_verified = True
    otp_record.save(update_fields=['is_verified'])

    # Activate user
    try:
        user = User.objects.get(email=email)
        if not user.is_active:
            user.is_active = True
            user.save(update_fields=['is_active'])
    except User.DoesNotExist:
        return Response({"error": "User account not found."}, status=status.HTTP_404_NOT_FOUND)

    tokens = get_tokens_for_user(user)
    return Response({
        "message": "Verification successful.",
        "user": UserSerializer(user).data,
        "token": tokens['access'],
        "refresh": tokens['refresh'],
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def resend_otp(request):
    """
    POST /api/auth/resend-otp
    Body: { "email": "user@example.com" }
    Enforces 60s cooldown, invalidates old OTP, sends a fresh one.
    """
    email = request.data.get('email', '').strip().lower()

    if not email:
        return Response({"error": "Email address is required."}, status=status.HTTP_400_BAD_REQUEST)
    if not EMAIL_REGEX.match(email):
        return Response({"error": "Please enter a valid email address."}, status=status.HTTP_400_BAD_REQUEST)

    # Rate-limit check
    existing = OTPVerification.objects.filter(email=email).order_by('-last_sent_at').first()
    if existing:
        seconds_since_last = (timezone.now() - existing.last_sent_at).total_seconds()
        if seconds_since_last < RESEND_COOLDOWN_SECONDS:
            wait = int(RESEND_COOLDOWN_SECONDS - seconds_since_last)
            return Response(
                {"error": f"Please wait {wait} more seconds before requesting a new code."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

    # Ensure the user actually exists
    if not User.objects.filter(email=email).exists():
        return Response(
            {"error": "No account associated with this email."},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Generate new OTP (invalidates old one)
    otp = _create_or_replace_otp(email)
    _send_otp_email(email, otp)

    return Response({
        "message": "A new verification code has been sent to your email.",
        "email": email,
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def direct_login(request):
    """
    POST /api/auth/direct-login
    Body: { "email": "user@example.com" }

    For existing (registered) users only. Issues a JWT immediately without
    requiring OTP verification. The frontend should only call this endpoint
    after confirming via send-otp that isNew=false (user already exists).
    """
    email = request.data.get('email', '').strip().lower()

    if not email:
        return Response({"error": "Email address is required."}, status=status.HTTP_400_BAD_REQUEST)
    if not EMAIL_REGEX.match(email):
        return Response({"error": "Please enter a valid email address."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Do not reveal whether account exists — redirect to signup flow
        return Response(
            {"error": "No account found with this email. Please sign up first."},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Ensure account is active
    if not user.is_active:
        # Activate them silently (they had a prior incomplete registration)
        user.is_active = True
        user.save(update_fields=['is_active'])

    tokens = get_tokens_for_user(user)
    return Response({
        "message": "Login successful.",
        "user": UserSerializer(user).data,
        "token": tokens['access'],
        "refresh": tokens['refresh'],
    }, status=status.HTTP_200_OK)


# ─── Legacy / Compatibility Endpoints ─────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    POST /api/auth/register (legacy compat)
    Creates user profile then sends OTP, same as send_otp.
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email is already registered."}, status=status.HTTP_400_BAD_REQUEST)

        # Create inactive user with profile data
        user = serializer.save()
        user.is_active = False
        user.save()

        # Rate-limit check before sending OTP
        existing = OTPVerification.objects.filter(email=email).order_by('-last_sent_at').first()
        if existing:
            seconds_since_last = (timezone.now() - existing.last_sent_at).total_seconds()
            if seconds_since_last < RESEND_COOLDOWN_SECONDS:
                return Response({
                    "message": "Registration initiated. OTP already sent.",
                    "email": email,
                }, status=status.HTTP_201_CREATED)

        otp = _create_or_replace_otp(email)
        _send_otp_email(email, otp)

        return Response({
            "message": "Registration initiated. OTP sent to email.",
            "email": email,
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    POST /api/auth/login (legacy compat)
    Delegates to send_otp flow.
    """
    email = request.data.get('email', '').strip().lower()
    if not email:
        return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

    # Rate-limit check
    existing = OTPVerification.objects.filter(email=email).order_by('-last_sent_at').first()
    if existing:
        seconds_since_last = (timezone.now() - existing.last_sent_at).total_seconds()
        if seconds_since_last < RESEND_COOLDOWN_SECONDS:
            wait = int(RESEND_COOLDOWN_SECONDS - seconds_since_last)
            return Response(
                {"error": f"Too many requests. Please wait {wait} seconds."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

    try:
        user = User.objects.get(email=email)
        is_new = False
    except User.DoesNotExist:
        user = User.objects.create_user(email=email, name='', role='customer')
        user.is_active = False
        user.save()
        is_new = True

    otp = _create_or_replace_otp(email)
    _send_otp_email(email, otp)

    return Response({
        "message": "OTP sent.",
        "email": email,
        "isNew": is_new,
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def update_profile(request):
    """POST /api/auth/profile — Update user profile fields."""
    email = request.data.get('email')
    if not email:
        return Response({"error": "Email is required to verify identity."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User profile not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProfileSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only viewset for listing/retrieving users (admin use)."""
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserSerializer


# --- Password-based Authentication ---

@api_view(['POST'])
@permission_classes([AllowAny])
def password_login(request):
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password', '')
    if not email or not password:
        return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not EMAIL_REGEX.match(email):
        return Response({'error': 'Please enter a valid email address.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.check_password(password):
        return Response({'error': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.is_active:
        user.is_active = True
        user.save(update_fields=['is_active'])

    tokens = get_tokens_for_user(user)
    return Response({
        'message': 'Login successful.',
        'user': UserSerializer(user).data,
        'token': tokens['access'],
        'refresh': tokens['refresh']
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def send_register_otp(request):
    email = request.data.get('email', '').strip().lower()
    if not email:
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not EMAIL_REGEX.match(email):
        return Response({'error': 'Please enter a valid email address.'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Account already exists. Please log in.'}, status=status.HTTP_409_CONFLICT)
    existing = OTPVerification.objects.filter(email=email).order_by('-last_sent_at').first()
    if existing:
        seconds_since_last = (timezone.now() - existing.last_sent_at).total_seconds()
        if seconds_since_last < RESEND_COOLDOWN_SECONDS:
            wait = int(RESEND_COOLDOWN_SECONDS - seconds_since_last)
            return Response(
                {"error": f"Please wait {wait} seconds before requesting a new code."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )
    otp = _create_or_replace_otp(email)
    _send_otp_email(email, otp)
    return Response({'message': 'OTP sent.'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_register(request):
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password', '')
    name = request.data.get('name', '').strip()
    otp = request.data.get('otp', '').strip()

    if not email or not password or not name or not otp:
        return Response({'error': 'Email, password, name and OTP are required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not EMAIL_REGEX.match(email):
        return Response({'error': 'Please enter a valid email address.'}, status=status.HTTP_400_BAD_REQUEST)
    if len(password) < 8:
        return Response({'error': 'Password must be at least 8 characters.'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Account already exists. Please log in.'}, status=status.HTTP_409_CONFLICT)

    # Verify OTP
    try:
        otp_record = OTPVerification.objects.get(email=email)
    except OTPVerification.DoesNotExist:
        return Response({"error": "No OTP requested for this email. Please resend."}, status=status.HTTP_400_BAD_REQUEST)
    
    if otp_record.is_verified:
        return Response({"error": "OTP already verified."}, status=status.HTTP_400_BAD_REQUEST)
    if timezone.now() > otp_record.expires_at:
        return Response({"error": "OTP has expired. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)
    if otp_record.attempts >= MAX_ATTEMPTS:
        return Response({"error": "Too many failed attempts. Please request a new OTP."}, status=status.HTTP_429_TOO_MANY_REQUESTS)
    if not _verify_otp_hash(otp, otp_record.otp_hash):
        otp_record.attempts += 1
        otp_record.save(update_fields=['attempts'])
        return Response({"error": "Invalid verification code."}, status=status.HTTP_400_BAD_REQUEST)

    otp_record.is_verified = True
    otp_record.save(update_fields=['is_verified'])

    user = User.objects.create_user(email=email, name=name, password=password, role='customer')
    user.last_name = request.data.get('last_name', '')
    user.phone = request.data.get('phone', '')
    user.gender = request.data.get('gender', '')
    user.city_of_residence = request.data.get('city_of_residence', '')
    user.state = request.data.get('state', '')
    user.nationality = request.data.get('nationality', 'Indian')
    dob = request.data.get('date_of_birth', '')
    if dob:
        try:
            from datetime import date as _date
            user.date_of_birth = _date.fromisoformat(dob)
        except ValueError:
            pass
    user.is_active = True
    tokens = get_tokens_for_user(user)
    return Response({
        'message': 'Account created.',
        'user': UserSerializer(user).data,
        'token': tokens['access'],
        'refresh': tokens['refresh'],
        'isNew': True
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def direct_register(request):
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password', '')
    name = request.data.get('name', '').strip()

    if not email or not password or not name:
        return Response({'error': 'Email, password and name are required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not EMAIL_REGEX.match(email):
        return Response({'error': 'Please enter a valid email address.'}, status=status.HTTP_400_BAD_REQUEST)
    if len(password) < 8:
        return Response({'error': 'Password must be at least 8 characters.'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Account already exists. Please log in.'}, status=status.HTTP_409_CONFLICT)

    user = User.objects.create_user(email=email, name=name, password=password, role='customer')
    user.last_name = request.data.get('last_name', '')
    user.phone = request.data.get('phone', '')
    user.gender = request.data.get('gender', '')
    user.city_of_residence = request.data.get('city_of_residence', '')
    user.state = request.data.get('state', '')
    user.nationality = request.data.get('nationality', 'Indian')
    dob = request.data.get('date_of_birth', '')
    if dob:
        try:
            from datetime import date as _date
            user.date_of_birth = _date.fromisoformat(dob)
        except ValueError:
            pass
    user.is_active = True
    user.save()
    
    tokens = get_tokens_for_user(user)
    return Response({
        'message': 'Account created directly.',
        'user': UserSerializer(user).data,
        'token': tokens['access'],
        'refresh': tokens['refresh'],
        'isNew': True
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_signup_otp(request):
    email = request.data.get('email', '').strip().lower()
    otp = request.data.get('otp', '').strip()
    
    if not email or not otp:
        return Response({'error': 'Email and verification code are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        otp_record = OTPVerification.objects.get(email=email)
    except OTPVerification.DoesNotExist:
        return Response({"error": "No verification code requested for this email. Please resend."}, status=status.HTTP_400_BAD_REQUEST)
        
    if otp_record.is_verified:
        return Response({"error": "Verification code already verified."}, status=status.HTTP_400_BAD_REQUEST)
    if timezone.now() > otp_record.expires_at:
        return Response({"error": "Verification code has expired. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)
    if otp_record.attempts >= MAX_ATTEMPTS:
        return Response({"error": "Too many failed attempts. Please request a new code."}, status=status.HTTP_429_TOO_MANY_REQUESTS)
    if not _verify_otp_hash(otp, otp_record.otp_hash):
        otp_record.attempts += 1
        otp_record.save(update_fields=['attempts'])
        remaining = MAX_ATTEMPTS - otp_record.attempts
        return Response({"error": f"Invalid verification code. {remaining} attempt(s) remaining."}, status=status.HTTP_400_BAD_REQUEST)
        
    return Response({'message': 'Code verified successfully.'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def send_reset_otp(request):
    email = request.data.get('email', '').strip().lower()
    if not email:
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not EMAIL_REGEX.match(email):
        return Response({'error': 'Please enter a valid email address.'}, status=status.HTTP_400_BAD_REQUEST)
    if not User.objects.filter(email=email).exists():
        return Response({'error': 'No account found with this email address.'}, status=status.HTTP_404_NOT_FOUND)
        
    existing = OTPVerification.objects.filter(email=email).order_by('-last_sent_at').first()
    if existing:
        seconds_since_last = (timezone.now() - existing.last_sent_at).total_seconds()
        if seconds_since_last < RESEND_COOLDOWN_SECONDS:
            wait = int(RESEND_COOLDOWN_SECONDS - seconds_since_last)
            return Response(
                {"error": f"Please wait {wait} seconds before requesting a new code."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )
            
    otp = _create_or_replace_otp(email)
    _send_otp_email(email, otp)
    return Response({'message': 'Reset code sent to email.'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_with_otp(request):
    email = request.data.get('email', '').strip().lower()
    otp = request.data.get('otp', '').strip()
    password = request.data.get('password', '')
    
    if not email or not otp or not password:
        return Response({'error': 'Email, OTP, and new password are required.'}, status=status.HTTP_400_BAD_REQUEST)
    if len(password) < 8:
        return Response({'error': 'Password must be at least 8 characters.'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        otp_record = OTPVerification.objects.get(email=email)
    except OTPVerification.DoesNotExist:
        return Response({"error": "No reset request found for this email. Please resend."}, status=status.HTTP_400_BAD_REQUEST)
        
    if otp_record.is_verified:
        return Response({"error": "Reset code already verified/used."}, status=status.HTTP_400_BAD_REQUEST)
    if timezone.now() > otp_record.expires_at:
        return Response({"error": "Reset code has expired. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)
    if otp_record.attempts >= MAX_ATTEMPTS:
        return Response({"error": "Too many failed attempts. Please request a new reset code."}, status=status.HTTP_429_TOO_MANY_REQUESTS)
    if not _verify_otp_hash(otp, otp_record.otp_hash):
        otp_record.attempts += 1
        otp_record.save(update_fields=['attempts'])
        remaining = MAX_ATTEMPTS - otp_record.attempts
        return Response({"error": f"Invalid reset code. {remaining} attempt(s) remaining."}, status=status.HTTP_400_BAD_REQUEST)
        
    otp_record.is_verified = True
    otp_record.save(update_fields=['is_verified'])
    
    try:
        user = User.objects.get(email=email)
        user.set_password(password)
        user.save()
        return Response({'message': 'Password updated successfully. Please log in.'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User account not found."}, status=status.HTTP_404_NOT_FOUND)

