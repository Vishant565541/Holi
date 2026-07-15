import csv
import base64
import os
import time
import mimetypes
from django.http import HttpResponse, Http404
from django.apps import apps
from django.utils.text import get_valid_filename
from django.conf import settings

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

# Whitelisted file extensions and MIME types for secure upload
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx'}
ALLOWED_MIME_TYPES = {
    'image/jpeg', 'image/png', 'application/pdf', 
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB maximum upload size

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_table_csv(request, table):
    """
    Export database table as CSV.
    - Requires authenticated admin or superadmin role.
    """
    user = request.user
    if user.role not in ['superadmin', 'admin']:
        return Response({"error": "Access Denied: Administrator role required."}, status=status.HTTP_403_FORBIDDEN)
        
    model_mapping = {
        'users': ('authentication', 'User'),
        'helicopters': ('helicopters', 'Helicopter'),
        'bookings': ('bookings', 'Booking'),
        'tours': ('packages', 'Tour'),
        'tickets': ('notifications', 'Ticket'),
        'career_applications': ('careers', 'CareerApplication')
    }
    
    if table not in model_mapping:
        raise Http404("Invalid table export target.")
        
    app_label, model_name = model_mapping[table]
    try:
        model = apps.get_model(app_label, model_name)
    except LookupError:
        raise Http404("Model not found.")
        
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="export-{table}.csv"'
    
    writer = csv.writer(response)
    fields = [field.name for field in model._meta.fields]
    writer.writerow(fields)
    
    queryset = model.objects.all().values_list(*fields)
    for row in queryset:
        cleaned_row = [str(val) if val is not None else '' for val in row]
        writer.writerow(cleaned_row)
        
    return response

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_file(request):
    """
    Upload a base64 encoded file securely.
    - Requires admin/superadmin credentials.
    - Validates file extensions, size limits, and sanitizes filenames.
    """
    user = request.user
    if user.role not in ['superadmin', 'admin']:
        return Response({"error": "Access Denied: Administrator role required."}, status=status.HTTP_403_FORBIDDEN)
        
    try:
        file_base64 = request.data.get('file')
        file_name = request.data.get('fileName')
        
        if not file_base64 or not file_name:
            return Response({"error": "File content and filename are required."}, status=status.HTTP_400_BAD_REQUEST)
            
        # Clean and validate file extension
        _, ext = os.path.splitext(file_name.lower())
        if ext not in ALLOWED_EXTENSIONS:
            return Response({"error": "Unsupported file extension."}, status=status.HTTP_400_BAD_REQUEST)
            
        # Strip off base64 prefix if present
        if ',' in file_base64:
            file_base64 = file_base64.split(',', 1)[1]
            
        try:
            file_data = base64.b64decode(file_base64, validate=True)
        except Exception:
            return Response({"error": "Invalid base64 payload."}, status=status.HTTP_400_BAD_REQUEST)
            
        # Validate size
        if len(file_data) > MAX_FILE_SIZE:
            return Response({"error": "File size exceeds the 5MB limit."}, status=status.HTTP_400_BAD_REQUEST)
            
        # Guess and validate MIME type
        mime_type, _ = mimetypes.guess_type(file_name)
        if not mime_type or mime_type not in ALLOWED_MIME_TYPES:
            return Response({"error": "Invalid file content type."}, status=status.HTTP_400_BAD_REQUEST)
            
        # Sanitize filename (prevents directory traversal or injection attacks)
        safe_name = get_valid_filename(file_name)
        unique_name = f"{int(time.time())}-{safe_name}"
        
        # Save to safe uploads location under frontend public dir
        public_dir = os.path.normpath(os.path.join(settings.BASE_DIR, '..', 'public', 'uploads'))
        os.makedirs(public_dir, exist_ok=True)
        
        file_path = os.path.join(public_dir, unique_name)
        
        # Double check path boundary to prevent path traversal
        if not file_path.startswith(public_dir):
            return Response({"error": "Invalid destination path."}, status=status.HTTP_400_BAD_REQUEST)
            
        with open(file_path, 'wb') as f:
            f.write(file_data)
            
        return Response({"url": f"/uploads/{unique_name}"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": "An internal error occurred during file upload."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
