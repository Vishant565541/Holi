from django.contrib import admin
from .models import Hotel

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'location', 'price', 'rating')
    search_fields = ('name', 'location', 'id')
    list_filter = ('rating',)
