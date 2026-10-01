/**
 * Utility to trigger PDF download for a quotation from backend or client fallback
 */
export async function downloadQuotationPDF(quoteData) {
  const quoteId = quoteData.id || quoteData.recommended_route || 'QT-2026-891';
  
  // Format payload for backend PDF generator
  const payload = {
    id: quoteId,
    origin: quoteData.origin || 'Shanghai Port, China',
    destination: quoteData.destination || quoteData.dest || 'Rotterdam Port, Netherlands',
    cargo_type: quoteData.cargo_type || quoteData.cargo || 'General Cargo',
    containers: quoteData.containers || quoteData.inputs?.containers || 10,
    date: quoteData.date || new Date().toISOString().split('T')[0],
    status: quoteData.status || 'Active',
    transit_days: quoteData.transit_days || quoteData.transitDays || quoteData.transit_time_days || 14,
    distance_nm: quoteData.distance_nm || quoteData.distance || 6450,
    route_type: quoteData.route_type || quoteData.routeType || 'Direct Express',
    total_usd: quoteData.total_usd || quoteData.totalUsd || quoteData.total_freight_usd || 20670,
    base_freight: quoteData.pricing_breakdown?.base_freight_usd || quoteData.cost_breakdown?.ocean_freight_per_container || 1850,
    baf: quoteData.pricing_breakdown?.fuel_surcharge_usd || quoteData.cost_breakdown?.baf_per_container || 120,
    origin_thc: quoteData.pricing_breakdown?.port_charge_usd || quoteData.cost_breakdown?.origin_thc_per_container || 45,
    dest_thc: quoteData.pricing_breakdown?.risk_surcharge_usd || quoteData.cost_breakdown?.dest_thc_per_container || 52
  };

  try {
    const response = await fetch('/api/quotations/download-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Freight_Quotation_${quoteId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.warn('Backend PDF endpoint error, using client printable view fallback:', error);
    triggerPrintFallback(payload);
    return false;
  }
}

function triggerPrintFallback(data) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const totalUsd = data.total_usd ? Number(data.total_usd).toLocaleString() : '20,670';
  const baseFreight = data.base_freight ? Number(data.base_freight).toLocaleString() : '1,850';
  const baf = data.baf ? Number(data.baf).toLocaleString() : '120';
  const originThc = data.origin_thc ? Number(data.origin_thc).toLocaleString() : '45';
  const destThc = data.dest_thc ? Number(data.dest_thc).toLocaleString() : '52';
  const containerCount = data.containers || 10;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Freight Quotation - ${data.id}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0d9488; padding-bottom: 20px; margin-bottom: 30px; }
        .brand { font-size: 24px; font-weight: bold; color: #0f172a; }
        .sub { font-size: 14px; color: #0d9488; font-weight: 600; text-transform: uppercase; }
        .meta { text-align: right; font-size: 13px; color: #475569; }
        .meta strong { color: #0f172a; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 30px; }
        .item { margin-bottom: 8px; font-size: 14px; }
        .item strong { color: #64748b; display: inline-block; width: 140px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #0f172a; color: white; text-align: left; padding: 12px; font-size: 13px; }
        td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
        tr.total-row { background: #f8fafc; font-weight: bold; font-size: 16px; border-top: 2px solid #0d9488; }
        tr.total-row td { color: #0d9488; }
        .footer { margin-top: 40px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">AGY MARITIME BROKERAGE</div>
          <div class="sub">Official Freight Quotation</div>
          <p style="font-size:12px; color:#64748b; margin:4px 0 0 0;">AI-Powered Maritime Route & Logistics Intelligence</p>
        </div>
        <div class="meta">
          <div><strong>QUOTATION NO:</strong> ${data.id}</div>
          <div><strong>DATE:</strong> ${data.date}</div>
          <div><strong>VALIDITY:</strong> 30 Days</div>
          <div><strong>STATUS:</strong> <span style="color:#0d9488; font-weight:bold;">${(data.status || 'Active').toUpperCase()}</span></div>
        </div>
      </div>

      <h3 style="color:#0f172a; margin-bottom:12px;">Shipment & Route Specifications</h3>
      <div class="grid">
        <div>
          <div class="item"><strong>Origin Port:</strong> ${data.origin}</div>
          <div class="item"><strong>Destination Port:</strong> ${data.destination}</div>
          <div class="item"><strong>Transit Time:</strong> ${data.transit_days} Days</div>
        </div>
        <div>
          <div class="item"><strong>Cargo Type:</strong> ${data.cargo_type}</div>
          <div class="item"><strong>Container Volume:</strong> ${containerCount} x 40ft High Cube</div>
          <div class="item"><strong>Route Service:</strong> ${data.route_type}</div>
        </div>
      </div>

      <h3 style="color:#0f172a; margin-bottom:12px;">Financial Breakdown</h3>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Rate / Container</th>
            <th>Containers</th>
            <th style="text-align:right;">Subtotal (USD)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ocean Freight Base Rate</td>
            <td>$${baseFreight}</td>
            <td>${containerCount}</td>
            <td style="text-align:right;">$${(data.base_freight * containerCount).toLocaleString()}</td>
          </tr>
          <tr>
            <td>Bunker Adjustment Factor (BAF)</td>
            <td>$${baf}</td>
            <td>${containerCount}</td>
            <td style="text-align:right;">$${(data.baf * containerCount).toLocaleString()}</td>
          </tr>
          <tr>
            <td>Origin Terminal Handling (THC)</td>
            <td>$${originThc}</td>
            <td>${containerCount}</td>
            <td style="text-align:right;">$${(data.origin_thc * containerCount).toLocaleString()}</td>
          </tr>
          <tr>
            <td>Destination Terminal Handling (THC)</td>
            <td>$${destThc}</td>
            <td>${containerCount}</td>
            <td style="text-align:right;">$${(data.dest_thc * containerCount).toLocaleString()}</td>
          </tr>
          <tr class="total-row">
            <td colspan="3">TOTAL FREIGHT QUOTE</td>
            <td style="text-align:right;">$${totalUsd}</td>
          </tr>
        </tbody>
      </table>

      <div class="footer">
        <p>1. Freight rates quoted are valid for 30 days from issuance date.<br/>
        2. Excludes destination customs duties, taxes, insurance, and inland transport.<br/>
        Generated by AGY Maritime Brokerage Platform • Electronically Verified Document</p>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
