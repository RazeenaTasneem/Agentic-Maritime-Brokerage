import { useState } from 'react';
import './NewQuotation.css';
import { ports, cargoTypes } from '../data/ports';
import ChartCanvas from '../ChartCanvas';
import heroImg from '../assets/hero.png';
import MetricCards from './MetricCards';
import RouteIntelligence from './RouteIntelligence';
import FinancialBreakdown from './FinancialBreakdown';

function NewQuotation({
  user,
  formData,
  onFormChange,
  onSubmitAnalyze,
  onSubmitQuotation,
  loading,
  quoteLoading,
  routeResult,
  quotationResult,
  error,
}) {
  const [activeTab, setActiveTab] = useState('routes');

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setActiveTab('routes');
    onSubmitAnalyze(e);
  };

  const handleQuotationClick = (e) => {
    e.preventDefault();
    setActiveTab('quotation');
    onSubmitQuotation(e);
  };

  const bestRoute = routeResult?.best_route || (routeResult?.routes && routeResult.routes[0]);

  return (
    <div className="new-quotation-workspace">
      {/* Welcome Bar */}
      <section className="welcome-bar">
        <div className="welcome-text">
          <h2>
            {getGreeting()}, <span className="welcome-name">{user?.name?.split(' ')[0] || 'Captain'}</span> 👋
          </h2>
          <p>Explore optimized shipping routes powered by AI intelligence</p>
        </div>
        <div className="quick-stats">
          <div className="quick-stat">
            <div className="stat-icon stat-icon-teal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
            </div>
            <div>
              <span className="stat-val">500+</span>
              <span className="stat-lbl">Global Ports</span>
            </div>
          </div>
          <div className="quick-stat">
            <div className="stat-icon stat-icon-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" /></svg>
            </div>
            <div>
              <span className="stat-val">50+</span>
              <span className="stat-lbl">Shipping Lines</span>
            </div>
          </div>
          <div className="quick-stat">
            <div className="stat-icon stat-icon-purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
            </div>
            <div>
              <span className="stat-val">AI</span>
              <span className="stat-lbl">Route Scoring</span>
            </div>
          </div>
          <div className="quick-stat">
            <div className="stat-icon stat-icon-gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            </div>
            <div>
              <span className="stat-val">99.9%</span>
              <span className="stat-lbl">Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-image-container">
          <img src={heroImg} alt="Maritime shipping" className="hero-image" />
          <div className="hero-image-overlay">
            <div className="hero-overlay-content">
              <span className="hero-tag">🚢 AI-Powered Platform</span>
              <h2>
                Smart <span className="highlight">Route Intelligence</span>
              </h2>
              <p>
                Analyze shipping routes, compare transit times, and get intelligent
                recommendations for your maritime freight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shipment Request Form */}
      <section className="form-section">
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </span>
            Shipment Request
          </h3>
          <span className="section-badge">Configure your route analysis</span>
        </div>

        <form className="shipment-form" onSubmit={handleFormSubmit} id="shipment-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="origin">
                <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                Origin Port
              </label>
              <div className="select-wrapper">
                <select
                  id="origin"
                  name="origin"
                  value={formData.origin}
                  onChange={onFormChange}
                  required
                >
                  <option value="">Select origin port...</option>
                  {ports.map((port) => (
                    <option key={port.code} value={port.name}>
                      {port.name}, {port.country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="destination">
                <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                Destination Port
              </label>
              <div className="select-wrapper">
                <select
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={onFormChange}
                  required
                >
                  <option value="">Select destination port...</option>
                  {ports.map((port) => (
                    <option key={port.code} value={port.name}>
                      {port.name}, {port.country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cargo_type">
                <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2M6 21v-2M10 21v-2M16 16v5M8 16H4" /></svg>
                Cargo Type
              </label>
              <div className="select-wrapper">
                <select
                  id="cargo_type"
                  name="cargo_type"
                  value={formData.cargo_type}
                  onChange={onFormChange}
                  required
                >
                  <option value="">Select cargo type...</option>
                  {cargoTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="containers">
                <svg className="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                Number of Containers
              </label>
              <input
                id="containers"
                name="containers"
                type="number"
                min="1"
                max="1000"
                value={formData.containers}
                onChange={onFormChange}
                required
              />
            </div>
          </div>

          <div className="button-row">
            <button
              type="submit"
              className="submit-btn"
              id="analyze-btn"
              disabled={loading || quoteLoading || !formData.origin || !formData.destination || !formData.cargo_type}
            >
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  Analyzing Routes...
                </>
              ) : (
                <>
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  Analyze Routes
                  <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </>
              )}
            </button>

            <button
              type="button"
              className="submit-btn quotation-btn"
              id="quotation-btn"
              disabled={quoteLoading || loading || !formData.origin || !formData.destination || !formData.cargo_type}
              onClick={handleQuotationClick}
            >
              {quoteLoading ? (
                <>
                  <span className="btn-spinner" />
                  Generating Quotation...
                </>
              ) : (
                <>
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  Generate Quotation
                  <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Error Banner */}
      {error && (
        <div className="error-banner" id="error-banner">
          <svg className="error-banner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          {error}
        </div>
      )}

      {/* Loading Container */}
      {(loading || quoteLoading) && (
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>{quoteLoading ? 'Generating your freight quotation...' : 'Route Agent is analyzing your shipment...'}</p>
          <p className="loading-sub">Evaluating routes, scoring alternatives, selecting best option</p>
          <div className="loading-dots">
            <span /><span /><span />
          </div>
        </div>
      )}

      {/* Metric Header Cards when results exist */}
      {(routeResult || quotationResult) && !loading && !quoteLoading && (
        <MetricCards routeData={bestRoute} />
      )}

      {/* Tab Switcher */}
      {(routeResult || quotationResult) && !loading && !quoteLoading && (
        <div className="tab-switcher">
          <button
            className={`tab-btn ${activeTab === 'routes' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('routes')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
            Route Analysis
          </button>
          <button
            className={`tab-btn ${activeTab === 'quotation' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('quotation')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
            Freight Quotation
          </button>
        </div>
      )}

      {/* Route Analysis Results View */}
      {routeResult && !loading && activeTab === 'routes' && (
        <section className="results-section" id="results-section">
          <div className="results-header">
            <h3 className="section-title">
              <span className="section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
              </span>
              Route Analysis Results
            </h3>
            <span className="routes-count">
              {routeResult.routes_found} route{routeResult.routes_found !== 1 ? 's' : ''} found
            </span>
          </div>

          <div className="routes-grid">
            {routeResult.routes.map((route, index) => (
              <div
                key={route.route_id}
                className={`route-card ${route.is_best ? 'best-route' : ''}`}
                id={`route-${route.route_id}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {route.is_best && <div className="best-route-ribbon">⭐ Best Route</div>}
                <div className="route-card-header">
                  <div>
                    <span className="route-name">
                      {route.route_name}
                      <span className="route-id">{route.route_id}</span>
                    </span>
                  </div>
                  {route.is_best ? (
                    <span className="best-badge">⭐ Best Route</span>
                  ) : (
                    <span className="score-badge">Score: {route.score}</span>
                  )}
                </div>

                <div className="route-via">
                  <svg className="via-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" /></svg>
                  Via: {route.via}
                </div>

                <div className="route-metrics">
                  <div className="metric">
                    <div className="metric-value transit">{route.transit_days}</div>
                    <div className="metric-label">Transit Days</div>
                  </div>
                  <div className="metric">
                    <div className="metric-value distance">
                      {route.distance_nm?.toLocaleString()}
                    </div>
                    <div className="metric-label">Distance (NM)</div>
                  </div>
                  <div className="metric">
                    <div className="metric-value transshipments">
                      {route.transshipments}
                    </div>
                    <div className="metric-label">Transshipments</div>
                  </div>
                  <div className="metric">
                    <div className="metric-value cost">
                      ${route.total_cost?.toLocaleString()}
                    </div>
                    <div className="metric-label">Total Cost</div>
                  </div>
                </div>

                {route.score_breakdown && (
                  <div className="score-breakdown">
                    <div className="breakdown-title">Score Breakdown</div>
                    <div className="breakdown-bars">
                      <div className="breakdown-item">
                        <span className="breakdown-label">Transit</span>
                        <div className="breakdown-bar-track">
                          <div
                            className="breakdown-bar-fill breakdown-transit"
                            style={{ width: `${route.score_breakdown.transit_score}%` }}
                          />
                        </div>
                        <span className="breakdown-value">{route.score_breakdown.transit_score}</span>
                      </div>
                      <div className="breakdown-item">
                        <span className="breakdown-label">Cost</span>
                        <div className="breakdown-bar-track">
                          <div
                            className="breakdown-bar-fill breakdown-cost"
                            style={{ width: `${route.score_breakdown.cost_score}%` }}
                          />
                        </div>
                        <span className="breakdown-value">{route.score_breakdown.cost_score}</span>
                      </div>
                      <div className="breakdown-item">
                        <span className="breakdown-label">Transship</span>
                        <div className="breakdown-bar-track">
                          <div
                            className="breakdown-bar-fill breakdown-transship"
                            style={{ width: `${route.score_breakdown.transshipment_score}%` }}
                          />
                        </div>
                        <span className="breakdown-value">{route.score_breakdown.transshipment_score}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chart Canvas */}
          {routeResult.routes.length > 1 && (
            <div className="chart-section">
              <div className="chart-container">
                <h4 className="chart-title">
                  <svg className="chart-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
                  Route Comparison
                </h4>
                <ChartCanvas routes={routeResult.routes} />
              </div>
            </div>
          )}

          {/* Recommendation */}
          {routeResult.recommendation && (
            <div className="recommendation-card" id="recommendation">
              <div className="recommendation-glow" />
              <h4 className="recommendation-title">
                <svg className="rec-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.663 17h4.674M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 12 18.469c-.92 0-1.822.334-2.488.942l-.548-.548z" /></svg>
                Agent Recommendation
              </h4>
              <p className="recommendation-text">{routeResult.recommendation.reasoning}</p>
            </div>
          )}
        </section>
      )}

      {/* Freight Quotation Tab View */}
      {(quotationResult || (routeResult && activeTab === 'quotation')) && !quoteLoading && (
        <section className="two-column-quotation-section">
          <RouteIntelligence
            routeData={routeResult}
            origin={formData.origin || 'Shanghai Port'}
            destination={formData.destination || 'Rotterdam Port'}
          />
          <FinancialBreakdown
            quotationData={quotationResult}
            containers={formData.containers}
            cargoType={formData.cargo_type}
          />
        </section>
      )}
    </div>
  );
}

export default NewQuotation;
