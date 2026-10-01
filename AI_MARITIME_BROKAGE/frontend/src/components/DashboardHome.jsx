import { useState } from 'react';
import './DashboardHome.css';
import heroImg from '../assets/hero.png';
import MetricCards from './MetricCards';
import RouteIntelligence from './RouteIntelligence';
import FinancialBreakdown from './FinancialBreakdown';

function DashboardHome({ user, onNavigate, onStartNewQuote }) {
  const [selectedVessel, setSelectedVessel] = useState(null);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const marketTickers = [
    { label: 'SCFI Index', value: '2,240.50 pts', change: '+2.4%', isPositive: true },
    { label: 'VLSFO Fuel (Rotterdam)', value: '$585.00 / MT', change: '-1.2%', isPositive: false },
    { label: 'Suez Transit Dwell', value: '0.8 Days', change: 'Normal', isPositive: true },
    { label: 'Fleet Capacity Util.', value: '91.4%', change: '+1.8%', isPositive: true },
  ];

  const activeVessels = [
    {
      mmsi: 'IMO 9812401',
      name: 'MV Pacific Voyager',
      flag: '🇸🇬 Singapore',
      route: 'Shanghai → Rotterdam',
      speed: '19.4 knots',
      eta: '2026-09-22',
      status: 'On Schedule',
      latLng: '12°34\'N, 43°12\'E (Gulf of Aden)'
    },
    {
      mmsi: 'IMO 9745109',
      name: 'MV Atlantic Express',
      flag: '🇵🇦 Panama',
      route: 'Singapore → Hamburg',
      speed: '21.2 knots',
      eta: '2026-09-28',
      status: 'Ahead of Time',
      latLng: '05°18\'N, 80°12\'E (Indian Ocean)'
    },
    {
      mmsi: 'IMO 9632840',
      name: 'MV Ocean Titan',
      flag: '🇱🇷 Liberia',
      route: 'Ningbo → Los Angeles',
      speed: '18.1 knots',
      eta: '2026-09-20',
      status: 'On Schedule',
      latLng: '28°40\'N, 162°15\'W (Pacific Ocean)'
    },
    {
      mmsi: 'IMO 9901423',
      name: 'MV Nordic Pioneer',
      flag: '🇩🇰 Denmark',
      route: 'Busan → Antwerp',
      speed: '17.8 knots',
      eta: '2026-10-02',
      status: 'Weather Hold',
      latLng: '34°10\'N, 128°50\'E (East China Sea)'
    }
  ];

  const portCongestion = [
    { port: 'Shanghai Port (CN)', code: 'CNSHA', waitTime: '0.5 days', status: 'Optimal', level: 'low' },
    { port: 'Port of Singapore (SG)', code: 'SGSIN', waitTime: '0.3 days', status: 'Low Dwell', level: 'low' },
    { port: 'Rotterdam Port (NL)', code: 'NLRTM', waitTime: '1.2 days', status: 'Moderate', level: 'med' },
    { port: 'Los Angeles Port (US)', code: 'USLAX', waitTime: '2.1 days', status: 'Elevated', level: 'high' },
    { port: 'Hamburg Port (DE)', code: 'DEHAM', waitTime: '0.4 days', status: 'Optimal', level: 'low' }
  ];

  const sampleRecentQuotes = [
    { id: 'QT-2026-891', origin: 'Shanghai Port', dest: 'Rotterdam Port', containers: 10, total: 20670, date: '2026-09-15', status: 'Active' },
    { id: 'QT-2026-885', origin: 'Singapore Port', dest: 'Hamburg Port', containers: 25, total: 48900, date: '2026-09-14', status: 'Booked' },
    { id: 'QT-2026-879', origin: 'Ningbo-Zhoushan', dest: 'Los Angeles Port', containers: 5, total: 12450, date: '2026-09-12', status: 'Completed' },
  ];

  return (
    <div className="dashboard-home">
      {/* Welcome Banner */}
      <div className="dash-welcome-hero">
        <div className="dash-hero-content">
          <div className="dash-hero-tag">
            <span className="live-dot" /> Maritime Intelligence Operating System
          </div>
          <h1 className="dash-hero-title">
            {getGreeting()}, <span className="highlight">{user?.name?.split(' ')[0] || 'Captain'}</span> 👋
          </h1>
          <p className="dash-hero-sub">
            Real-time vessel tracking, port congestion analytics, and AI freight route scoring.
          </p>
          <div className="dash-hero-actions">
            <button className="dash-primary-btn" onClick={() => onNavigate('new-quotation')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Create New Quotation
            </button>
            <button className="dash-secondary-btn" onClick={() => onNavigate('route-intelligence')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              Route Intelligence Engine
            </button>
          </div>
        </div>

        <div className="dash-hero-img-wrapper">
          <img src={heroImg} alt="Maritime vessel" className="dash-hero-img" />
          <div className="dash-hero-overlay" />
        </div>
      </div>

      {/* Market Rate Ticker Bar */}
      <div className="market-ticker-bar">
        {marketTickers.map((t, i) => (
          <div key={i} className="ticker-item">
            <span className="ticker-label">{t.label}</span>
            <div className="ticker-val-group">
              <span className="ticker-val">{t.value}</span>
              <span className={`ticker-badge ${t.isPositive ? 'badge-up' : 'badge-down'}`}>
                {t.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Metric Cards Banner */}
      <MetricCards />

      {/* Active Fleet Tracker & Port Congestion Monitor */}
      <div className="dash-two-col-grid">
        {/* Live Vessels Tracker */}
        <div className="dash-widget-card">
          <div className="widget-card-header">
            <div className="widget-title">
              <div className="widget-icon icon-teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 20h20" />
                  <path d="M4 14l2-6h12l2 6" />
                  <line x1="12" y1="8" x2="12" y2="2" />
                </svg>
              </div>
              <div>
                <h3>Active Fleet Telemetry</h3>
                <p className="widget-sub">Live AIS satellite vessel positioning</p>
              </div>
            </div>
            <span className="live-status-pill">📡 AIS Live</span>
          </div>

          <div className="vessel-list">
            {activeVessels.map((v) => (
              <div
                key={v.mmsi}
                className={`vessel-item-card ${selectedVessel === v.mmsi ? 'vessel-selected' : ''}`}
                onClick={() => setSelectedVessel(selectedVessel === v.mmsi ? null : v.mmsi)}
              >
                <div className="vessel-main-info">
                  <div className="vessel-name-row">
                    <span className="vessel-name">⚓ {v.name}</span>
                    <span className="vessel-flag">{v.flag}</span>
                  </div>
                  <span className="vessel-route">{v.route}</span>
                </div>

                <div className="vessel-meta-grid">
                  <div>
                    <span className="v-lbl">SPEED</span>
                    <span className="v-val">{v.speed}</span>
                  </div>
                  <div>
                    <span className="v-lbl">EST. ETA</span>
                    <span className="v-val">{v.eta}</span>
                  </div>
                  <div className="text-right">
                    <span className={`v-status-badge status-${v.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {v.status}
                    </span>
                  </div>
                </div>

                {selectedVessel === v.mmsi && (
                  <div className="vessel-coordinates">
                    <span><strong>Coordinates:</strong> {v.latLng}</span>
                    <span><strong>MMSI:</strong> {v.mmsi}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Global Port Congestion */}
        <div className="dash-widget-card">
          <div className="widget-card-header">
            <div className="widget-title">
              <div className="widget-icon icon-blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M2 12h20" />
                  <circle cx="12" cy="12" r="8" />
                </svg>
              </div>
              <div>
                <h3>Global Port Congestion Index</h3>
                <p className="widget-sub">Terminal dwell times & vessel queue status</p>
              </div>
            </div>
            <span className="widget-badge">Updated 10m ago</span>
          </div>

          <div className="port-congestion-list">
            {portCongestion.map((p) => (
              <div key={p.code} className="port-congestion-row">
                <div className="port-info">
                  <span className="port-name">{p.port}</span>
                  <span className="port-code">{p.code}</span>
                </div>

                <div className="port-dwell-info">
                  <span className="dwell-time">{p.waitTime} avg wait</span>
                  <span className={`congestion-pill level-${p.level}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Intelligence + Financial */}
      <div className="dash-two-col-grid">
        <RouteIntelligence />
        <FinancialBreakdown />
      </div>

      {/* Recent Activity Table */}
      <div className="dash-recent-section">
        <div className="dash-recent-header">
          <div>
            <h3>Recent Freight Quotations</h3>
            <p className="recent-sub">Latest AI-evaluated rates and shipment bookings</p>
          </div>
          <button className="view-all-btn" onClick={() => onNavigate('quotations')}>
            View All Quotations →
          </button>
        </div>

        <div className="recent-table-container">
          <table className="recent-table">
            <thead>
              <tr>
                <th>Quote ID</th>
                <th>Route (Origin → Dest)</th>
                <th>Cargo Volume</th>
                <th>Total Freight (USD)</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sampleRecentQuotes.map((q) => (
                <tr key={q.id}>
                  <td className="quote-id-cell">{q.id}</td>
                  <td>
                    <div className="route-cell">
                      <span>{q.origin}</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                      <span>{q.dest}</span>
                    </div>
                  </td>
                  <td>{q.containers} x 40ft HC</td>
                  <td className="quote-total-cell">${q.total.toLocaleString()}</td>
                  <td className="quote-date-cell">{q.date}</td>
                  <td>
                    <span className={`status-pill status-${q.status.toLowerCase()}`}>
                      {q.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
