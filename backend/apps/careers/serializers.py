from rest_framework import serializers
from .models import CareerApplication

class CareerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerApplication
        fields = '__all__'
