from django.contrib import admin
from .models import Helicopter

@admin.register(Helicopter)
class HelicopterAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'model', 'price', 'capacity', 'safety_rating')
    search_fields = ('name', 'model', 'id')
    list_filter = ('capacity', 'safety_rating')
