from django.contrib import admin
from .models import Ticket

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_email', 'subject', 'category', 'status', 'date')
    search_fields = ('id', 'user_email', 'subject')
    list_filter = ('category', 'status', 'date')
