from django.contrib import admin
from .models import Boat

@admin.register(Boat)
class BoatAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'type', 'capacity', 'price')
    search_fields = ('name', 'type', 'id')
