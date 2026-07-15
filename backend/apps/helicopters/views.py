from rest_framework import viewsets
from .models import Helicopter
from .serializers import HelicopterSerializer

class HelicopterViewSet(viewsets.ModelViewSet):
    queryset = Helicopter.objects.all()
    serializer_class = HelicopterSerializer
