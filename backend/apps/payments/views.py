import logging
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from bookings.models import Booking

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_payment(request):
    try:
        provider = request.data.get('provider')
        amount = request.data.get('amount')
        booking_id = request.data.get('bookingId')
        user_email = request.data.get('userEmail', 'customer@example.com')
        
        if not provider or not amount or not booking_id:
            return Response({"error": "Missing checkout parameters."}, status=status.HTTP_400_BAD_REQUEST)
            
        if provider == "stripe":
            # Stripe mock intent creation
            result = {
                "clientSecret": f"pi_mock_secret_{booking_id}",
                "amount": amount,
                "currency": "inr",
                "bookingId": booking_id,
                "userEmail": user_email
            }
            return Response(result, status=status.HTTP_200_OK)
        else:
            # Razorpay / Cashfree / PhonePe mock order creation
            result = {
                "id": f"order_mock_{booking_id}",
                "amount": amount,
                "currency": "INR",
                "bookingId": booking_id,
                "userEmail": user_email
            }
            return Response(result, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_payment(request):
    try:
        provider = request.data.get('provider')
        payment_id = request.data.get('paymentId')
        signature = request.data.get('signature')
        booking_id = request.data.get('bookingId')
        
        # Payment verification simulation: always verify successfully for demo
        is_verified = True
        
        if is_verified and booking_id:
            try:
                booking = Booking.objects.get(id=booking_id)
                booking.status = 'Confirmed'
                booking.save()
                
                # Asynchronous notification logs (Simulating SMTP/Twilio logs)
                logger.info(f"Notification Sent to {booking.user_email}: Booking {booking.id} confirmed.")
                logger.info(f"SMS/WhatsApp Sent to +91 99999 99999 for booking {booking.id} confirmation.")
                
            except Booking.DoesNotExist:
                pass
                
        return Response({"verified": is_verified}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
