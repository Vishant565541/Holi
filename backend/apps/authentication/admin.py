from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import OTPVerification

User = get_user_model()

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'role', 'created_at', 'is_staff', 'is_active')
    search_fields = ('email', 'name')
    list_filter = ('role', 'is_staff', 'is_active')


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ('email', 'created_at', 'expires_at', 'attempts', 'is_verified', 'last_sent_at')
    search_fields = ('email',)
    list_filter = ('is_verified',)
    readonly_fields = ('otp_hash', 'created_at', 'expires_at', 'last_sent_at')
    ordering = ('-created_at',)
