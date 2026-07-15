from django.contrib import admin
from .models import CareerApplication

@admin.register(CareerApplication)
class CareerApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'qualification', 'experience', 'status', 'created_at')
    search_fields = ('name', 'email')
    list_filter = ('status', 'qualification')
