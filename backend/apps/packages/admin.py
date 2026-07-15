from django.contrib import admin
from .models import Tour

@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'duration', 'rating')
    search_fields = ('name', 'id')
    list_filter = ('duration', 'rating')
