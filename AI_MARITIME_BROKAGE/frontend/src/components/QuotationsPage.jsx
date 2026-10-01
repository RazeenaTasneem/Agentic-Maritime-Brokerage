import { useState } from 'react';
import './QuotationsPage.css';
import { downloadQuotationPDF } from '../utils/pdfDownloader';

function QuotationsPage({ searchQuery = '', onStartNewQuote }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownloadPDF = async (quote) => {
    setDownloadingId(quote.id);
    try {
      await downloadQuotationPDF(quote);
    } finally {
      setDownloadingId(null);
    }
  };

  const allQuotations = [
    {
      id: 'QT-2026-891',
      origin: 'Shanghai Port, China',
      dest: 'Rotterdam Port, Netherlands',
      cargo: 'Electronics',
      containers: 10,
      transitDays: 14,
      distance: 6450,
      totalUsd: 20670,
      date: '2026-09-15',
      status: 'Active',
      routeType: 'Direct Express'
    },
    {
      id: 'QT-2026-885',
      origin: 'Singapore Port, Singapore',
      dest: 'Hamburg Port, Germany',
      cargo: 'Machinery',
      containers: 25,
      transitDays: 18,
      distance: 8200,
      totalUsd: 48900,
      date: '2026-09-14',
      status: 'Booked',
      routeType: 'Transshipment Hub'
    },
    {
      id: 'QT-2026-879',
      origin: 'Ningbo-Zhoushan, China',
      dest: 'Los Angeles Port, USA',
      cargo: 'Textiles',
      containers: 5,
      transitDays: 12,
      distance: 5700,
      totalUsd: 12450,
      date: '2026-09-12',
      status: 'Completed',
      routeType: 'Direct Express'
    },
    {
      id: 'QT-2026-864',
      origin: 'Busan Port, South Korea',
      dest: 'Antwerp Port, Belgium',
      cargo: 'Automotive Parts',
      containers: 15,
      transitDays: 16,
      distance: 7100,
      totalUsd: 31200,
      date: '2026-09-08',
      status: 'Active',
      routeType: 'Direct Express'
    },
    {
      id: 'QT-2026-850',
      origin: 'Yokohama Port, Japan',
      dest: 'Felixstowe, United Kingdom',
      cargo: 'Chemicals (Hazardous)',
      containers: 8,
      transitDays: 22,
      distance: 9100,
      totalUsd: 24800,
      date: '2026-09-03',
      status: 'Expired',
      routeType: 'Multi-leg Transit'
    }
  ];

  const filtered = allQuotations.filter((q) => {
    const matchesSearch =
      q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.dest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.cargo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || q.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="quotations-page">
      <div className="quotations-header">
        <div>
          <h2>Saved Freight Quotations</h2>
          <p className="quotations-sub">Manage, export, and track active rate quotes</p>
        </div>

        <button className="new-quote-action-btn" onClick={onStartNewQuote}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          New Quotation
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-bar">
        <div className="filter-tabs">
          {['all', 'active', 'booked', 'completed', 'expired'].map((status) => (
            <button
              key={status}
              className={`filter-tab ${filterStatus === status ? 'tab-active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <span className="results-count-text">
          Showing {filtered.length} of {allQuotations.length} quotes
        </span>
      </div>

      {/* Quotations List */}
      <div className="quotations-cards-grid">
        {filtered.map((q) => (
          <div key={q.id} className="quote-item-card">
            <div className="quote-item-header">
              <div className="quote-id-group">
                <span className="quote-id-title">{q.id}</span>
                <span className="quote-date-tag">{q.date}</span>
              </div>
              <span className={`status-badge status-${q.status.toLowerCase()}`}>
                {q.status}
              </span>
            </div>

            <div className="quote-route-banner">
              <div className="route-node">
                <span className="node-lbl">ORIGIN</span>
                <span className="node-name">{q.origin}</span>
              </div>
              <div className="route-line-icon">
                <span>{q.transitDays}d</span>
                <div className="line-bar" />
                <span>{q.routeType}</span>
              </div>
              <div className="route-node text-right">
                <span className="node-lbl">DESTINATION</span>
                <span className="node-name">{q.dest}</span>
              </div>
            </div>

            <div className="quote-details-row">
              <div className="detail-box">
                <span className="d-label">COMMODITY</span>
                <span className="d-val">{q.cargo}</span>
              </div>
              <div className="detail-box">
                <span className="d-label">VOLUME</span>
                <span className="d-val">{q.containers} x 40ft HC</span>
              </div>
              <div className="detail-box">
                <span className="d-label">DISTANCE</span>
                <span className="d-val">{q.distance.toLocaleString()} NM</span>
              </div>
              <div className="detail-box total-box">
                <span className="d-label">TOTAL QUOTE</span>
                <span className="d-val grand-price">${q.totalUsd.toLocaleString()}</span>
              </div>
            </div>

            <div className="quote-card-footer">
              <button
                className="btn-secondary-sm"
                onClick={() => handleDownloadPDF(q)}
                disabled={downloadingId === q.id}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14, marginRight: 6 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {downloadingId === q.id ? 'Generating...' : 'Download PDF'}
              </button>
              <button className="btn-primary-sm">Book Shipment →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default QuotationsPage;
