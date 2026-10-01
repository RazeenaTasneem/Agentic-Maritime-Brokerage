import { useState } from 'react';
import './App.css';
import Login from './Login';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardHome from './components/DashboardHome';
import NewQuotation from './components/NewQuotation';
import QuotationsPage from './components/QuotationsPage';
import MaritimePathways from './components/MaritimePathways';
import FinancialBreakdown from './components/FinancialBreakdown';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Layout navigation state
  const [activePage, setActivePage] = useState('new-quotation'); // default to new quotation to show reference UI
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Quotation form state
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    cargo_type: '',
    containers: 10,
  });

  const [routeResult, setRouteResult] = useState(null);
  const [quotationResult, setQuotationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'containers' ? parseInt(value) || 0 : value,
    }));
  };

  const handleAnalyzeRoutes = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/routes/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setRouteResult(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze routes. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuotation = async () => {
    setQuoteLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/quotations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setQuotationResult(data);
    } catch (err) {
      setError(err.message || 'Failed to generate quotation. Is the backend running?');
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="app-auth-wrapper">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className={`dashboard-app-layout ${sidebarCollapsed ? 'layout-sidebar-collapsed' : ''}`}>
      {/* Ambient background glow */}
      <div className="ambient-bg">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
      </div>

      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="dashboard-main-container">
        {/* Top Header */}
        <TopBar
          activePage={activePage}
          user={user}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* View Router */}
        <main className="dashboard-page-content">
          {activePage === 'dashboard' && (
            <DashboardHome
              user={user}
              onNavigate={(p) => setActivePage(p)}
              onStartNewQuote={() => setActivePage('new-quotation')}
            />
          )}

          {activePage === 'new-quotation' && (
            <NewQuotation
              user={user}
              formData={formData}
              onFormChange={handleFormChange}
              onSubmitAnalyze={handleAnalyzeRoutes}
              onSubmitQuotation={handleGenerateQuotation}
              loading={loading}
              quoteLoading={quoteLoading}
              routeResult={routeResult}
              quotationResult={quotationResult}
              error={error}
            />
          )}

          {activePage === 'route-intelligence' && (
            <div className="route-intel-page-wrapper">
              <div className="page-section-header">
                <h2>Route Intelligence Engine</h2>
                <p className="section-sub">Comprehensive multi-objective route analytics and GIS pathway graph</p>
              </div>
              <MaritimePathways
                routes={routeResult?.routes || [
                  {
                    route_id: 'R01',
                    route_name: 'Direct Ocean Express',
                    via: 'Direct Passage (Suez Canal)',
                    transit_days: 14,
                    distance_nm: 6450,
                    transshipments: 0,
                    total_cost: 20670,
                    score: 9.4,
                    is_best: true,
                    score_breakdown: { transit_score: 95, cost_score: 90, transshipment_score: 98 }
                  },
                  {
                    route_id: 'R02',
                    route_name: 'Transshipment Hub Alpha',
                    via: 'Port Klang Hub',
                    transit_days: 18,
                    distance_nm: 6820,
                    transshipments: 1,
                    total_cost: 18200,
                    score: 8.6,
                    is_best: false,
                    score_breakdown: { transit_score: 80, cost_score: 96, transshipment_score: 82 }
                  }
                ]}
                recommendation={routeResult?.recommendation}
              />
            </div>
          )}

          {activePage === 'quotations' && (
            <QuotationsPage
              searchQuery={searchQuery}
              onStartNewQuote={() => setActivePage('new-quotation')}
            />
          )}

          {activePage === 'pricing-analysis' && (
            <div className="pricing-analysis-page">
              <div className="page-section-header" style={{ marginBottom: '24px' }}>
                <h2>Pricing Intelligence & Cost Breakdown</h2>
                <p className="section-sub">Dynamic AI pricing models, operating cost structures & demand factor analysis</p>
              </div>
              <FinancialBreakdown
                quotationData={quotationResult}
                containers={formData.containers}
                cargoType={formData.cargo_type}
              />
            </div>
          )}

          {activePage === 'feedback' && (
            <div className="feedback-page-wrapper" style={{ maxWidth: '600px', margin: '40px auto', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>User Feedback</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Help us improve the AI Maritime Freight Brokerage Platform with your insights.</p>
              
              <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for your feedback! Your insights help optimize our AI routing engine.'); }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Rate your experience</label>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '1.5rem', cursor: 'pointer' }}>
                    {'⭐'.repeat(5)}
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label htmlFor="feedback-text" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Your Comments</label>
                  <textarea
                    id="feedback-text"
                    rows="4"
                    placeholder="Share feedback on route suggestions, pricing accuracy, or user interface..."
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.5)', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #06b6d4, #0284c7)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(6, 182, 212, 0.3)' }}
                >
                  Submit Feedback
                </button>
              </form>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}

export default App;
