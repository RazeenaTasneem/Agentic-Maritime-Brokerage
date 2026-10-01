import './TopBar.css';

function TopBar({ activePage, user, onLogout, searchQuery, setSearchQuery }) {
  const getBreadcrumbs = () => {
    switch (activePage) {
      case 'dashboard':
        return 'MARITIME BROKERAGE AI / DASHBOARD';
      case 'new-quotation':
        return 'MARITIME BROKERAGE AI / NEW QUOTATION';
      case 'route-intelligence':
        return 'MARITIME BROKERAGE AI / ROUTE INTELLIGENCE';
      case 'quotations':
        return 'MARITIME BROKERAGE AI / SAVED QUOTATIONS';
      default:
        return 'MARITIME BROKERAGE AI';
    }
  };

  const getInitials = () => {
    if (!user || !user.name) return 'MB';
    const parts = user.name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-breadcrumb">{getBreadcrumbs()}</div>
      </div>

      <div className="topbar-right">
        {/* Search */}
        <div className="topbar-search">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search quotations, routes, ports..."
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          />
        </div>

        {/* User Profile */}
        <div className="topbar-user">
          <div className="user-avatar-badge" title={user?.email || 'User'}>
            {getInitials()}
          </div>
          <div className="user-details">
            <span className="user-display-name">{user?.name || 'Maritime User'}</span>
            <span className="user-display-role">Brokerage Agent</span>
          </div>
          <button className="topbar-logout-btn" onClick={onLogout} title="Sign Out">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
