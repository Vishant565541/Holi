from django.middleware.csrf import CsrfViewMiddleware

class DisableCSRFForAPIMiddleware(CsrfViewMiddleware):
    """
    Custom CSRF middleware that bypasses CSRF protection for API routes (/api/*)
    but retains full CSRF protection for the Django Admin portal (/django/*).
    """
    def process_view(self, request, callback, callback_args, callback_kwargs):
        if request.path.startswith('/api/'):
            return None
        return super().process_view(request, callback, callback_args, callback_kwargs)
