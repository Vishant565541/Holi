from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from rest_framework.routers import DefaultRouter

from helicopters.views import HelicopterViewSet
from packages.views import TourViewSet
from bookings.views import BookingViewSet
from hotels.views import HotelViewSet
from boats.views import BoatViewSet
from notifications.views import TicketViewSet
from careers.views import CareerApplicationViewSet
from authentication.views import UserViewSet, register_user, login_user, verify_otp, update_profile, send_otp, resend_otp, direct_login, password_login, password_register, send_register_otp, direct_register, verify_signup_otp, send_reset_otp, reset_password_with_otp
from payments.views import create_payment, verify_payment
from invoices.views import generate_invoice
from reports.views import export_table_csv, upload_file
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# Router for versioned v1 APIs
router_v1 = DefaultRouter(trailing_slash=False)
router_v1.register('helicopters', HelicopterViewSet, basename='v1-helicopter')
router_v1.register('packages', TourViewSet, basename='v1-tour')
router_v1.register('bookings', BookingViewSet, basename='v1-booking')
router_v1.register('hotels', HotelViewSet, basename='v1-hotel')
router_v1.register('boats', BoatViewSet, basename='v1-boat')
router_v1.register('notifications/tickets', TicketViewSet, basename='v1-ticket')
router_v1.register('careers', CareerApplicationViewSet, basename='v1-career')
router_v1.register('users', UserViewSet, basename='v1-user')

# Router for compatibility APIs (directly mapping to /api/...)
router_compat = DefaultRouter(trailing_slash=False)
router_compat.register('fleet', HelicopterViewSet, basename='compat-fleet')
router_compat.register('tours', TourViewSet, basename='compat-tours')
router_compat.register('bookings', BookingViewSet, basename='compat-bookings')
router_compat.register('hotels', HotelViewSet, basename='compat-hotels')
router_compat.register('boats', BoatViewSet, basename='compat-boats')
router_compat.register('tickets', TicketViewSet, basename='compat-tickets')
router_compat.register('careers', CareerApplicationViewSet, basename='compat-careers')
router_compat.register('users', UserViewSet, basename='compat-users')

urlpatterns = [
    path('', lambda request: redirect('api/docs', permanent=False)),
    path('django/', admin.site.urls),
    
    # 1. Versioned REST API Endpoints (/api/v1/)
    path('api/v1/auth/register', register_user),
    path('api/v1/auth/login', login_user),
    path('api/v1/auth/send-otp', send_otp),
    path('api/v1/auth/verify-otp', verify_otp),
    path('api/v1/auth/resend-otp', resend_otp),
    path('api/v1/auth/direct-login', direct_login),
    path('api/v1/auth/password-login', password_login),
    path('api/v1/auth/send-register-otp', send_register_otp),
    path('api/v1/auth/password-register', password_register),
    path('api/v1/auth/direct-register', direct_register),
    path('api/v1/auth/verify-signup-otp', verify_signup_otp),
    path('api/v1/auth/send-reset-otp', send_reset_otp),
    path('api/v1/auth/reset-password', reset_password_with_otp),
    path('api/v1/auth/profile', update_profile),
    path('api/v1/payments/create', create_payment),
    path('api/v1/payments/verify', verify_payment),
    path('api/v1/invoices/<str:id>', generate_invoice),
    path('api/v1/reports/export/<str:table>', export_table_csv),
    path('api/v1/settings/upload', upload_file),
    path('api/v1/', include(router_v1.urls)),
    
    # 2. Backward Compatibility Endpoints for Direct Frontend Access (/api/...)
    path('api/auth/register', register_user),
    path('api/auth/login', login_user),
    path('api/auth/send-otp', send_otp),
    path('api/auth/verify-otp', verify_otp),
    path('api/auth/resend-otp', resend_otp),
    path('api/auth/direct-login', direct_login),
    path('api/auth/password-login', password_login),
    path('api/auth/send-register-otp', send_register_otp),
    path('api/auth/password-register', password_register),
    path('api/auth/direct-register', direct_register),
    path('api/auth/verify-signup-otp', verify_signup_otp),
    path('api/auth/send-reset-otp', send_reset_otp),
    path('api/auth/reset-password', reset_password_with_otp),
    path('api/auth/profile', update_profile),
    path('api/payments/create', create_payment),
    path('api/payments/verify', verify_payment),
    path('api/bookings/invoice/<str:id>', generate_invoice),
    path('api/bookings/cancel/<str:pk>', BookingViewSet.as_view({'post': 'cancel'})),
    path('api/tickets/reply/<str:pk>', TicketViewSet.as_view({'post': 'reply'})),
    path('api/admin/export/<str:table>', export_table_csv),
    path('api/storage/upload', upload_file),
    path('api/', include(router_compat.urls)),
    
    # 3. Schema & API Documentation
    path('api/schema', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
