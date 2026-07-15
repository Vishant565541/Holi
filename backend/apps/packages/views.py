from rest_framework import viewsets
from .models import Tour
from .serializers import TourSerializer

class TourViewSet(viewsets.ModelViewSet):
    queryset = Tour.objects.all()
    serializer_class = TourSerializer
