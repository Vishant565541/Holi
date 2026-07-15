from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, role='customer', **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, role=role, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, name, password, role='superadmin', **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('superadmin', 'Super Admin'),
        ('admin', 'Admin'),
        ('operator', 'Operator'),
        ('support', 'Support'),
        ('finance', 'Finance'),
        ('contentmanager', 'Content Manager'),
        ('customer', 'Customer'),
    )
    
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(max_length=100, unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    
    # New profile fields
    gender = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    city_of_residence = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    nationality = models.CharField(max_length=100, blank=True, null=True)
    marital_status = models.CharField(max_length=50, blank=True, null=True)
    anniversary = models.DateField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    
    class Meta:
        db_table = 'users'

    def __str__(self):
        return f"{self.name} ({self.email})"


class OTPVerification(models.Model):
    """
    Secure OTP model.
    - otp_hash: PBKDF2 hashed OTP (never stored in plaintext)
    - expires_at: OTP is invalid after 5 minutes
    - attempts: incremented on each wrong guess; locked after MAX_ATTEMPTS
    - is_verified: True once the correct OTP is submitted
    - last_sent_at: used to enforce 60-second resend rate-limit
    """
    MAX_ATTEMPTS = 5

    email = models.EmailField(db_index=True)
    otp_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    attempts = models.PositiveSmallIntegerField(default=0)
    is_verified = models.BooleanField(default=False)
    last_sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'otp_verifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} — expires {self.expires_at} | attempts {self.attempts}"

    def is_expired(self):
        from django.utils import timezone
        return timezone.now() >= self.expires_at

    def is_locked(self):
        return self.attempts >= self.MAX_ATTEMPTS
