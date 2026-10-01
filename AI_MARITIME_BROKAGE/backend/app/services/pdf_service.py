import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch


class PDFService:
    """
    Generates professional PDF documents for Maritime Freight Quotations.
    """

    def generate_quotation_pdf(self, quote_data: dict) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            leftMargin=36,
            rightMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()

        # Custom styles with dark maritime color palette (#0f172a, #0d9488, #1e293b)
        primary_color = colors.HexColor("#0f172a")
        accent_color = colors.HexColor("#0d9488")
        text_dark = colors.HexColor("#1e293b")
        text_muted = colors.HexColor("#64748b")
        bg_light = colors.HexColor("#f8fafc")
        border_color = colors.HexColor("#e2e8f0")

        title_style = ParagraphStyle(
            'DocTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=20,
            leading=24,
            textColor=primary_color
        )

        subtitle_style = ParagraphStyle(
            'DocSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=11,
            leading=14,
            textColor=accent_color
        )

        meta_label_style = ParagraphStyle(
            'MetaLabel',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=9,
            leading=11,
            textColor=text_muted
        )

        meta_value_style = ParagraphStyle(
            'MetaValue',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=10,
            leading=12,
            textColor=primary_color
        )

        section_heading = ParagraphStyle(
            'SectionHeading',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=13,
            leading=16,
            textColor=primary_color,
            spaceAfter=6
        )

        body_style = ParagraphStyle(
            'BodyTextCustom',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=13,
            textColor=text_dark
        )

        bold_body_style = ParagraphStyle(
            'BoldBodyTextCustom',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=9.5,
            leading=13,
            textColor=text_dark
        )

        disclaimer_style = ParagraphStyle(
            'Disclaimer',
            parent=styles['Normal'],
            fontName='Helvetica-Oblique',
            fontSize=8,
            leading=11,
            textColor=text_muted
        )

        story = []

        # Extract values
        quote_id = quote_data.get('id') or 'QT-2026-891'
        date_str = quote_data.get('date') or datetime.now().strftime('%Y-%m-%d')
        status = quote_data.get('status') or 'Active'
        origin = quote_data.get('origin', 'N/A')
        dest = quote_data.get('destination', 'N/A')
        cargo = quote_data.get('cargo_type') or quote_data.get('cargo') or 'General Cargo'
        containers = quote_data.get('containers', 1)
        transit = quote_data.get('transit_days') or quote_data.get('transitDays') or 14
        distance = quote_data.get('distance_nm') or quote_data.get('distance') or 6450
        route_type = quote_data.get('route_type') or quote_data.get('routeType') or 'Direct Express'

        # Financial values
        base_freight = quote_data.get('base_freight') or 1850.0
        baf = quote_data.get('baf') or 120.0
        origin_thc = quote_data.get('origin_thc') or 45.0
        dest_thc = quote_data.get('dest_thc') or 52.0

        if quote_data.get('total_usd'):
            total_usd = float(quote_data['total_usd'])
        elif quote_data.get('totalUsd'):
            total_usd = float(quote_data['totalUsd'])
        else:
            total_usd = (base_freight + baf + origin_thc + dest_thc) * containers

        # HEADER BLOCK
        header_left = [
            Paragraph("AGY MARITIME BROKERAGE", title_style),
            Paragraph("OFFICIAL FREIGHT QUOTATION", subtitle_style),
            Paragraph("AI-Powered Global Route & Freight Intelligence", body_style)
        ]

        header_right = [
            Paragraph(f"<b>QUOTATION NO:</b> {quote_id}", meta_value_style),
            Paragraph(f"<b>DATE ISSUED:</b> {date_str}", meta_value_style),
            Paragraph(f"<b>VALIDITY:</b> 30 Days", meta_value_style),
            Paragraph(f"<b>STATUS:</b> {status.upper()}", meta_value_style),
        ]

        header_table = Table(
            [[header_left, header_right]],
            colWidths=[4.2 * inch, 3.2 * inch]
        )
        header_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ]))

        story.append(header_table)
        story.append(Spacer(1, 12))
        story.append(HRFlowable(width="100%", thickness=1.5, color=accent_color, spaceBefore=4, spaceAfter=12))

        # ROUTE & SHIPMENT SUMMARY SECTION
        story.append(Paragraph("Shipment & Route Specifications", section_heading))

        route_info_data = [
            [
                Paragraph("<b>Origin Port:</b>", meta_label_style),
                Paragraph(origin, body_style),
                Paragraph("<b>Destination Port:</b>", meta_label_style),
                Paragraph(dest, body_style)
            ],
            [
                Paragraph("<b>Transit Time:</b>", meta_label_style),
                Paragraph(f"{transit} Days", body_style),
                Paragraph("<b>Distance:</b>", meta_label_style),
                Paragraph(f"{distance:,} NM", body_style)
            ],
            [
                Paragraph("<b>Route Service:</b>", meta_label_style),
                Paragraph(route_type, body_style),
                Paragraph("<b>Cargo Type:</b>", meta_label_style),
                Paragraph(cargo, body_style)
            ],
            [
                Paragraph("<b>Volume / Equipment:</b>", meta_label_style),
                Paragraph(f"{containers} x 40ft High Cube Container(s)", bold_body_style),
                Paragraph("<b>Carrier Class:</b>", meta_label_style),
                Paragraph("Direct Express Liner", body_style)
            ]
        ]

        route_table = Table(route_info_data, colWidths=[1.5 * inch, 2.2 * inch, 1.5 * inch, 2.2 * inch])
        route_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), bg_light),
            ('BOX', (0, 0), (-1, -1), 1, border_color),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, border_color),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))

        story.append(route_table)
        story.append(Spacer(1, 16))

        # FINANCIAL BREAKDOWN SECTION
        story.append(Paragraph("Itemized Financial Breakdown", section_heading))

        table_header_style = ParagraphStyle(
            'TableHeader',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=9.5,
            leading=12,
            textColor=colors.white
        )

        table_data = [
            [
                Paragraph("Description", table_header_style),
                Paragraph("Rate / Container", table_header_style),
                Paragraph("Containers", table_header_style),
                Paragraph("Subtotal (USD)", table_header_style)
            ],
            [
                Paragraph("Ocean Freight Base Rate", body_style),
                Paragraph(f"${base_freight:,.2f}", body_style),
                Paragraph(str(containers), body_style),
                Paragraph(f"${(base_freight * containers):,.2f}", bold_body_style)
            ],
            [
                Paragraph("Bunker Adjustment Factor (BAF)", body_style),
                Paragraph(f"${baf:,.2f}", body_style),
                Paragraph(str(containers), body_style),
                Paragraph(f"${(baf * containers):,.2f}", body_style)
            ],
            [
                Paragraph("Origin Terminal Handling Charge (THC)", body_style),
                Paragraph(f"${origin_thc:,.2f}", body_style),
                Paragraph(str(containers), body_style),
                Paragraph(f"${(origin_thc * containers):,.2f}", body_style)
            ],
            [
                Paragraph("Destination Terminal Handling Charge (THC)", body_style),
                Paragraph(f"${dest_thc:,.2f}", body_style),
                Paragraph(str(containers), body_style),
                Paragraph(f"${(dest_thc * containers):,.2f}", body_style)
            ]
        ]

        total_row_style = ParagraphStyle(
            'TotalRow',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=11,
            leading=14,
            textColor=primary_color
        )

        total_amount_style = ParagraphStyle(
            'TotalAmount',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=12,
            leading=15,
            textColor=accent_color,
            alignment=2
        )

        table_data.append([
            Paragraph("TOTAL FREIGHT QUOTE", total_row_style),
            Paragraph("", body_style),
            Paragraph("", body_style),
            Paragraph(f"${total_usd:,.2f}", total_amount_style)
        ])

        financial_table = Table(table_data, colWidths=[3.2 * inch, 1.5 * inch, 1.1 * inch, 1.6 * inch])
        financial_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), primary_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -2), 0.5, border_color),
            ('BACKGROUND', (0, -1), (-1, -1), bg_light),
            ('LINEABOVE', (0, -1), (-1, -1), 1.5, accent_color),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('SPAN', (0, -1), (2, -1)),
        ]))

        story.append(financial_table)
        story.append(Spacer(1, 20))

        # TERMS & REMARKS
        story.append(Paragraph("Terms, Conditions & Remarks", section_heading))

        terms_text = (
            "1. Freight rates quoted are valid for 30 calendar days from the date of issue.<br/>"
            "2. Quoted rates exclude destination customs duties, import taxes, cargo insurance, and inland drayage unless explicitly stated.<br/>"
            "3. Subject to vessel space and container equipment availability at origin port.<br/>"
            "4. Transit times are estimated based on optimal routing and subject to weather and port congestion factors."
        )

        story.append(Paragraph(terms_text, disclaimer_style))
        story.append(Spacer(1, 16))

        # SIGNATURE & STAMP BOX
        sig_data = [
            [
                Paragraph("<b>Prepared By:</b> AI Route & Pricing Intelligence Agent", body_style),
                Paragraph("<b>Authorized Broker Signature:</b>", body_style)
            ],
            [
                Paragraph("AGY Maritime Brokerage Platform", body_style),
                Paragraph("<i>[ electronically verified ]</i>", disclaimer_style)
            ]
        ]
        sig_table = Table(sig_data, colWidths=[4.0 * inch, 3.4 * inch])
        sig_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LINEABOVE', (1, 1), (1, 1), 0.5, text_muted),
        ]))
        story.append(sig_table)

        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()

        return pdf_bytes
