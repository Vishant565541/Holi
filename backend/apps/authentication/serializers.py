from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'name', 'last_name', 'email', 'phone', 'role', 
            'gender', 'date_of_birth', 'city_of_residence', 'state', 
            'nationality', 'marital_status', 'anniversary', 'created_at'
        )

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'name', 'last_name', 'email', 'phone', 
            'gender', 'date_of_birth', 'city_of_residence', 'state', 
            'nationality', 'marital_status', 'anniversary'
        )
        extra_kwargs = {
            'phone': {'required': False, 'allow_null': True, 'allow_blank': True},
            'last_name': {'required': False, 'allow_null': True, 'allow_blank': True},
            'gender': {'required': False, 'allow_null': True, 'allow_blank': True},
            'date_of_birth': {'required': False, 'allow_null': True},
            'city_of_residence': {'required': False, 'allow_null': True, 'allow_blank': True},
            'state': {'required': False, 'allow_null': True, 'allow_blank': True},
            'nationality': {'required': False, 'allow_null': True, 'allow_blank': True},
            'marital_status': {'required': False, 'allow_null': True, 'allow_blank': True},
            'anniversary': {'required': False, 'allow_null': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', None),
            role='customer',
            gender=validated_data.get('gender', None),
            date_of_birth=validated_data.get('date_of_birth', None),
            city_of_residence=validated_data.get('city_of_residence', None),
            state=validated_data.get('state', None),
            nationality=validated_data.get('nationality', None),
            marital_status=validated_data.get('marital_status', None),
            anniversary=validated_data.get('anniversary', None)
        )
        return user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'name', 'last_name', 'phone', 'gender', 'date_of_birth', 
            'city_of_residence', 'state', 'nationality', 'marital_status', 'anniversary'
        )
        extra_kwargs = {
            'name': {'required': True},
            'phone': {'required': False, 'allow_null': True, 'allow_blank': True},
            'last_name': {'required': False, 'allow_null': True, 'allow_blank': True},
            'gender': {'required': False, 'allow_null': True, 'allow_blank': True},
            'date_of_birth': {'required': False, 'allow_null': True},
            'city_of_residence': {'required': False, 'allow_null': True, 'allow_blank': True},
            'state': {'required': False, 'allow_null': True, 'allow_blank': True},
            'nationality': {'required': False, 'allow_null': True, 'allow_blank': True},
            'marital_status': {'required': False, 'allow_null': True, 'allow_blank': True},
            'anniversary': {'required': False, 'allow_null': True},
        }

