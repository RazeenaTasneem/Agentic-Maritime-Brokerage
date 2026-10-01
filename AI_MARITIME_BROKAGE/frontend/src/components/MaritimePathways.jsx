import { useState } from 'react';
import ChartCanvas from '../ChartCanvas';
import './MaritimePathways.css';

function MaritimePathways({ routes, recommendation, onSelectRoute }) {
  const [selectedRouteId, setSelectedRouteId] = useState(routes && routes[0] ? routes[0].route_id : null);

  if (!routes || routes.length === 0) {
    return null;
  }

  return (
    <div className="pathways-section">
      <div className="pathways-header">
        <div className="pathways-title">
          <div className="pathways-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div>
            <h3>Available Maritime Pathways</h3>
            <p className="pathways-sub">AI-evaluated routing options ranked by efficiency</p>
          </div>
        </div>

        <span className="pathways-count-badge">
          {routes.length} Route{routes.length > 1 ? 's' : ''} Analyzed
        </span>
      </div>

      {/* Route Cards */}
      <div className="pathways-grid">
        {routes.map((route, idx) => {
          const isSelected = selectedRouteId === route.route_id;
          return (
            <div
              key={route.route_id}
              className={`pathway-card ${route.is_best ? 'pathway-best' : ''} ${isSelected ? 'pathway-selected' : ''}`}
              onClick={() => {
                setSelectedRouteId(route.route_id);
                if (onSelectRoute) onSelectRoute(route);
              }}
            >
              {route.is_best && (
                <div className="pathway-best-ribbon">⭐ Recommended</div>
              )}

              <div className="pathway-card-top">
                <div className="pathway-name-group">
                  <h4 className="pathway-name">{route.route_name}</h4>
                  <span className="pathway-id">{route.route_id}</span>
                </div>
                <div className="pathway-score">
                  <span className="score-label">Score</span>
                  <span className={`score-num ${route.is_best ? 'score-best' : ''}`}>{route.score}</span>
                </div>
              </div>

              <div className="pathway-via-tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>Via: {route.via}</span>
              </div>

              <div className="pathway-metrics-row">
                <div className="p-metric">
                  <span className="p-val">{route.transit_days}d</span>
                  <span className="p-lbl">Transit</span>
                </div>
                <div className="p-metric">
                  <span className="p-val">{route.distance_nm?.toLocaleString()}</span>
                  <span className="p-lbl">Distance</span>
                </div>
                <div className="p-metric">
                  <span className="p-val">{route.transshipments}</span>
                  <span className="p-lbl">Stops</span>
                </div>
                <div className="p-metric">
                  <span className="p-val">${route.total_cost?.toLocaleString()}</span>
                  <span className="p-lbl">Est. Cost</span>
                </div>
              </div>

              {route.score_breakdown && (
                <div className="pathway-mini-bars">
                  <div className="mini-bar">
                    <span className="mini-bar-lbl">Transit</span>
                    <div className="mini-track">
                      <div className="mini-fill fill-teal" style={{ width: `${route.score_breakdown.transit_score}%` }} />
                    </div>
                  </div>
                  <div className="mini-bar">
                    <span className="mini-bar-lbl">Cost</span>
                    <div className="mini-track">
                      <div className="mini-fill fill-blue" style={{ width: `${route.score_breakdown.cost_score}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Chart Comparison */}
      {routes.length > 1 && (
        <div className="pathways-chart-card">
          <h4 className="chart-heading">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20V10M18 20V4M6 20v-4" />
            </svg>
            Comparative Performance Canvas
          </h4>
          <ChartCanvas routes={routes} />
        </div>
      )}

      {/* Recommendation Banner */}
      {recommendation && (
        <div className="pathways-recommendation">
          <div className="rec-badge-icon">💡</div>
          <div className="rec-content">
            <h4>Agent Recommendation Summary</h4>
            <p>{recommendation.reasoning || recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MaritimePathways;
