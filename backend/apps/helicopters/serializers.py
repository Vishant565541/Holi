from rest_framework import serializers
from .models import Helicopter

class HelicopterSerializer(serializers.ModelSerializer):
    safetyRating = serializers.SerializerMethodField()

    class Meta:
        model = Helicopter
        fields = (
            'id', 'name', 'model', 'tagline', 'price', 'capacity', 
            'speed', 'range', 'safety_rating', 'safetyRating', 
            'description', 'image', 'features', 'specs', 'schedules'
        )

    def get_safetyRating(self, obj):
        return obj.safety_rating or "5.0/5.0"
