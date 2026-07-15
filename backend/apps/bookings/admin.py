from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_email', 'type', 'name', 'date', 'passengers', 'price', 'status', 'created_at')
    search_fields = ('id', 'user_email', 'name')
    list_filter = ('type', 'status', 'date')
