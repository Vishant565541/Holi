from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Booking
from .serializers import BookingSerializer

class BookingViewSet(viewsets.ModelViewSet):
    """
    Booking ViewSet.
    - Requires JWT Authentication.
    - Scopes queryset to the logged-in user unless the user is an admin/superadmin.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = BookingSerializer

    def get_queryset(self):
        user = self.request.user
        # Admins and superadmins can view all bookings
        if user.role in ['superadmin', 'admin']:
            queryset = Booking.objects.all().order_by('-created_at')
            email = self.request.query_params.get('email', None)
            if email:
                queryset = queryset.filter(user_email=email)
            return queryset
        
        # Regular users are strictly limited to their own bookings
        return Booking.objects.filter(user_email=user.email).order_by('-created_at')

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel(self, request, pk=None):
        try:
            booking = self.get_object()
            
            # Additional authorization check
            if request.user.role not in ['superadmin', 'admin'] and booking.user_email != request.user.email:
                return Response({"error": "Unauthorized access to this booking resource."}, status=status.HTTP_403_FORBIDDEN)
                
            booking.status = 'Cancelled'
            booking.save()
            return Response(BookingSerializer(booking).data, status=status.HTTP_200_OK)
        except Booking.DoesNotExist:
            return Response({"error": "Booking record not found."}, status=status.HTTP_404_NOT_FOUND)
