import datetime
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Ticket
from .serializers import TicketSerializer

class TicketViewSet(viewsets.ModelViewSet):
    """
    Support Ticket ViewSet.
    - Requires JWT Authentication.
    - Restricts user access to their own tickets only.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = TicketSerializer

    def get_queryset(self):
        user = self.request.user
        # Admins and superadmins can view all support tickets
        if user.role in ['superadmin', 'admin']:
            queryset = Ticket.objects.all().order_by('-date')
            email = self.request.query_params.get('email', None)
            if email:
                queryset = queryset.filter(user_email=email)
            return queryset
            
        # Regular users are strictly limited to their own tickets
        return Ticket.objects.filter(user_email=user.email).order_by('-date')

    @action(detail=True, methods=['post'], url_path='reply')
    def reply(self, request, pk=None):
        try:
            ticket = self.get_object()
            
            # Enforce ownership check
            if request.user.role not in ['superadmin', 'admin'] and ticket.user_email != request.user.email:
                return Response({"error": "Unauthorized access to this ticket resource."}, status=status.HTTP_403_FORBIDDEN)
                
            text = request.data.get('text', '').strip()
            sender = request.data.get('sender', 'user')
            
            if not text:
                return Response({"error": "Response text cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)
                
            messages = ticket.messages or []
            now = datetime.datetime.now()
            formatted_date = now.strftime("%d/%m/%Y %H:%M")
            
            messages.append({
                "sender": sender,
                "text": text,
                "date": formatted_date
            })
            
            ticket.messages = messages
            ticket.save()
            
            return Response(TicketSerializer(ticket).data, status=status.HTTP_200_OK)
        except Ticket.DoesNotExist:
            return Response({"error": "Ticket not found."}, status=status.HTTP_404_NOT_FOUND)
