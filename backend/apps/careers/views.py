from rest_framework import viewsets
from .models import CareerApplication
from .serializers import CareerApplicationSerializer

class CareerApplicationViewSet(viewsets.ModelViewSet):
    queryset = CareerApplication.objects.all().order_by('-created_at')
    serializer_class = CareerApplicationSerializer
