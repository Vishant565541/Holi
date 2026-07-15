import io
from django.http import HttpResponse, Http404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from bookings.models import Booking

# Reportlab imports
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

@api_view(['GET'])
@permission_classes([AllowAny])
def generate_invoice(request, id):
    try:
        booking = Booking.objects.get(id=id)
    except Booking.DoesNotExist:
        raise Http404("Booking record not found.")

    # Create PDF in-memory buffer
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, 
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )
    story = []
    styles = getSampleStyleSheet()

    # Premium custom styles
    title_style = ParagraphStyle(
        'InvoiceTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=15
    )
    subtitle_style = ParagraphStyle(
        'InvoiceSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#64748B')
    )
    cell_style = ParagraphStyle(
        'InvoiceCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155')
    )
    header_style = ParagraphStyle(
        'InvoiceHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.white
    )

    # Title & Metadata block
    story.append(Paragraph("ROMAN AVIATION & TOURISM", title_style))
    story.append(Paragraph("Elite Helicopter Charter & Luxury Travel Services", subtitle_style))
    story.append(Spacer(1, 20))

    # Invoice Details Grid
    details_data = [
        [
            Paragraph(f"<b>Invoice ID:</b> INV-{booking.id}", cell_style),
            Paragraph(f"<b>Booking Date:</b> {booking.date}", cell_style)
        ],
        [
            Paragraph(f"<b>Customer Email:</b> {booking.user_email}", cell_style),
            Paragraph(f"<b>Status:</b> {booking.status}", cell_style)
        ]
    ]
    details_table = Table(details_data, colWidths=[260, 260])
    details_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(details_table)
    story.append(Spacer(1, 25))

    # Itemized Table Header
    items_data = [
        [
            Paragraph("Description", header_style),
            Paragraph("Type", header_style),
            Paragraph("Passengers", header_style),
            Paragraph("Price (INR)", header_style)
        ]
    ]

    # Itemized Content Row
    items_data.append([
        Paragraph(f"<b>{booking.name}</b><br/>{booking.details or ''}", cell_style),
        Paragraph(booking.type.upper(), cell_style),
        Paragraph(str(booking.passengers), cell_style),
        Paragraph(f"{booking.price:,.2f}", cell_style)
    ])

    # Total Row
    items_data.append([
        Paragraph("", cell_style),
        Paragraph("", cell_style),
        Paragraph("<b>Total Amount:</b>", cell_style),
        Paragraph(f"<b>INR {booking.price:,.2f}</b>", cell_style)
    ])

    items_table = Table(items_data, colWidths=[260, 80, 80, 100])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0F172A')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('ALIGN', (3,0), (3,-1), 'RIGHT'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('GRID', (0,0), (-1,1), 0.5, colors.HexColor('#CBD5E1')),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor('#F8FAFC')),
        ('LINEABOVE', (2,-1), (3,-1), 1.5, colors.HexColor('#0F172A')),
    ]))
    story.append(items_table)
    story.append(Spacer(1, 40))

    # Signature ready lines
    story.append(Paragraph("<i>This is a computer generated document. No physical signature is required.</i>", subtitle_style))

    # Build PDF
    doc.build(story)
    
    # Get buffer value and construct response
    pdf_content = buffer.getvalue()
    buffer.close()

    response = HttpResponse(pdf_content, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="invoice-{booking.id}.pdf"'
    return response
