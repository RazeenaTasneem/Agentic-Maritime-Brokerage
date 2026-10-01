import { useState } from 'react';
import './FinancialBreakdown.css';
import { downloadQuotationPDF } from '../utils/pdfDownloader';

function FinancialBreakdown({ quotationData, containers = 10, cargoType = 'Electronics' }) {
  const [downloading, setDownloading] = useState(false);

  // If quotationData is present, use its breakdown; otherwise calculate realistic defaults matching reference
  const containerCount = quotationData?.inputs?.containers || quotationData?.containers || containers || 10;
  
  let baseFreight = 1850;
  let bafPerContainer = 120;
  let originHandlingPerContainer = 45;
  let destHandlingPerContainer = 52;

  if (quotationData?.cost_breakdown) {
    baseFreight = quotationData.cost_breakdown.ocean_freight_per_container || 1850;
    bafPerContainer = quotationData.cost_breakdown.baf_per_container || 120;
    originHandlingPerContainer = quotationData.cost_breakdown.origin_thc_per_container || 45;
    destHandlingPerContainer = quotationData.cost_breakdown.dest_thc_per_container || 52;
  } else if (quotationData?.pricing_breakdown) {
    baseFreight = quotationData.pricing_breakdown.base_freight_usd || 1850;
    bafPerContainer = quotationData.pricing_breakdown.fuel_surcharge_usd || 120;
    originHandlingPerContainer = quotationData.pricing_breakdown.port_charge_usd || 45;
    destHandlingPerContainer = quotationData.pricing_breakdown.risk_surcharge_usd || 52;
  }

  const oceanFreightTotal = quotationData?.cost_breakdown?.total_ocean_freight || (baseFreight * containerCount);
  const bafTotal = quotationData?.cost_breakdown?.total_baf || (bafPerContainer * containerCount);
  const originHandlingTotal = quotationData?.cost_breakdown?.total_origin_thc || (originHandlingPerContainer * containerCount);
  const destHandlingTotal = quotationData?.cost_breakdown?.total_dest_thc || (destHandlingPerContainer * containerCount);

  const grandTotal = quotationData?.total_usd || quotationData?.total_freight_usd || (oceanFreightTotal + bafTotal + originHandlingTotal + destHandlingTotal);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const exportPayload = {
        id: quotationData?.id || 'QT-2026-891',
        origin: quotationData?.origin || 'Shanghai Port, China',
        destination: quotationData?.destination || 'Rotterdam Port, Netherlands',
        cargo_type: quotationData?.cargo_type || cargoType,
        containers: containerCount,
        transit_days: quotationData?.transit_time_days || quotationData?.transit_days || 14,
        distance_nm: quotationData?.distance_nm || 6450,
        route_type: quotationData?.route_type || 'Direct Express',
        total_usd: grandTotal,
        base_freight: baseFreight,
        baf: bafPerContainer,
        origin_thc: originHandlingPerContainer,
        dest_thc: destHandlingPerContainer
      };
      await downloadQuotationPDF(exportPayload);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="financial-breakdown-card">
      <div className="financial-card-header">
        <div className="financial-title">
          <div className="financial-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h3>Financial Breakdown</h3>
        </div>
        <span className="container-badge">
          📦 {containerCount} x 40ft HC
        </span>
      </div>

      <div className="financial-card-body">
        <div className="line-items">
          <div className="line-item">
            <div className="line-item-left">
              <span className="line-item-title">Ocean Freight</span>
              <span className="line-item-sub">${baseFreight.toLocaleString()} / container</span>
            </div>
            <span className="line-item-amount">${oceanFreightTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          <div className="line-item">
            <div className="line-item-left">
              <span className="line-item-title">Bunker Adjustment Factor (BAF)</span>
              <span className="line-item-sub">Fuel surcharge calculation</span>
            </div>
            <span className="line-item-amount">${bafTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          <div className="line-item">
            <div className="line-item-left">
              <span className="line-item-title">Origin Terminal Handling (THC)</span>
              <span className="line-item-sub">Port origin operations</span>
            </div>
            <span className="line-item-amount">${originHandlingTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          <div className="line-item">
            <div className="line-item-left">
              <span className="line-item-title">Destination Terminal Handling (THC)</span>
              <span className="line-item-sub">Port discharge operations</span>
            </div>
            <span className="line-item-amount">${destHandlingTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Total Highlight Box */}
        <div className="total-highlight-box">
          <div className="total-label-group">
            <span className="total-title">TOTAL QUOTE</span>
            <span className="total-currency">USD Freight Charges</span>
          </div>
          <div className="total-amount-display">
            <span className="total-currency-symbol">$</span>
            <span className="total-number">{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Action Button Section */}
        <div className="financial-actions">
          <button
            className="download-pdf-btn"
            onClick={handleDownload}
            disabled={downloading}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {downloading ? 'Generating PDF...' : 'Download PDF Quotation'}
          </button>
        </div>

        <div className="financial-disclaimer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>Excludes local customs duties, cargo insurance, and inland drayage unless requested.</span>
        </div>
      </div>
    </div>
  );
}

export default FinancialBreakdown;
