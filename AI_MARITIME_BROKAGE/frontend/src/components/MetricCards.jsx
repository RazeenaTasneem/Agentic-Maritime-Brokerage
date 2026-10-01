import './MetricCards.css';

function MetricCards({ routeData }) {
  // Fallback defaults matching reference design or using passed route data
  const transitDays = routeData?.transit_days ?? 14;
  const distance = routeData?.distance_nm ? routeData.distance_nm.toLocaleString() : '6,450';
  const transshipments = routeData?.transshipments ?? 0;
  const score = routeData?.score ?? 9.4;

  const cards = [
    {
      id: 'transit',
      label: 'TRANSIT TIME',
      value: `${transitDays} Days`,
      subtext: 'Direct ocean voyage',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      badge: 'Est.',
      type: 'blue'
    },
    {
      id: 'distance',
      label: 'DISTANCE',
      value: `${distance} NM`,
      subtext: 'Nautical miles calculated',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      ),
      badge: 'GIS',
      type: 'teal'
    },
    {
      id: 'stops',
      label: 'STOPS',
      value: transshipments === 0 ? '0 (Direct)' : `${transshipments} Transshipment${transshipments > 1 ? 's' : ''}`,
      subtext: transshipments === 0 ? 'No transshipment ports' : 'Includes port transfer',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="3" />
          <line x1="12" y1="22" x2="12" y2="8" />
          <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
        </svg>
      ),
      badge: transshipments === 0 ? 'Direct' : 'Multi-leg',
      type: 'purple'
    },
    {
      id: 'score',
      label: 'ROUTE SCORE',
      value: `${typeof score === 'number' ? score.toFixed(1) : score} / 10`,
      subtext: 'AI Multi-objective rating',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      badge: 'Top Tier',
      type: 'green'
    }
  ];

  return (
    <div className="metric-cards-grid">
      {cards.map((card) => (
        <div key={card.id} className={`metric-card metric-card-${card.type}`}>
          <div className="metric-card-header">
            <span className="metric-card-label">{card.label}</span>
            <span className={`metric-card-badge badge-${card.type}`}>{card.badge}</span>
          </div>
          <div className="metric-card-body">
            <div className="metric-card-icon">{card.icon}</div>
            <div className="metric-card-value">{card.value}</div>
          </div>
          <div className="metric-card-footer">{card.subtext}</div>
        </div>
      ))}
    </div>
  );
}

export default MetricCards;
