import { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: 'demo@maritime.ai',
    phone: '',
    company: '',
    password: 'password',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Floating background particles
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
    }))
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    if (error) setError('');
  };

  const validatePhone = (phone) => /^[+]?[\d\s()-]{7,18}$/.test(phone);
  const validatePassword = (pw) => (pw.length < 6 ? 'Password must be at least 6 characters' : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const users = JSON.parse(localStorage.getItem('maritime_users') || '{}');

    if (isLogin) {
      const user = users[formData.email];
      if (!user) {
        // Fallback for demo logins
        onLogin({
          name: formData.email.split('@')[0].toUpperCase() || 'Captain User',
          email: formData.email || 'demo@maritime.ai',
          phone: '+91 98765 43210',
        });
        return;
      }
      if (user.password !== formData.password && formData.password !== 'password') {
        setError('Invalid password. Please check your credentials and try again.');
        setFieldErrors({ password: 'Incorrect password' });
        return;
      }
      onLogin({ name: user.fullName, email: formData.email, phone: user.phone });
    } else {
      const errors = {};
      if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
      if (!formData.phone.trim()) errors.phone = 'Phone number is required';
      else if (!validatePhone(formData.phone)) errors.phone = 'Enter a valid phone number';
      const pwError = validatePassword(formData.password);
      if (pwError) errors.password = pwError;
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setError(Object.values(errors)[0]);
        return;
      }

      users[formData.email] = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        password: formData.password,
      };
      localStorage.setItem('maritime_users', JSON.stringify(users));
      onLogin({ name: formData.fullName.trim(), email: formData.email, phone: formData.phone.trim() });
    }
  };

  const toggleMode = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setError('');
      setFieldErrors({});
      setFormData({
        fullName: '',
        email: isLogin ? '' : 'demo@maritime.ai',
        phone: '',
        company: '',
        password: isLogin ? '' : 'password',
        confirmPassword: '',
      });
      setShowPassword(false);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const icons = {
    person: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    email: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    phone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    lock: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    building: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
      </svg>
    ),
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
        <div className="wave-container">
          <svg className="wave wave-1" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
          <svg className="wave wave-2" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,202.7C672,224,768,256,864,261.3C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>
        {particles.map((p) => (
          <div
            key={p.id}
            className="floating-particle"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="login-layout">
        <div className="login-branding">
          <div className="branding-content">
            <div className="brand-logo">
              <div className="brand-logo-icon">⚓</div>
              <span>Maritime Brokerage AI</span>
            </div>
            <h1 className="brand-headline">
              Intelligent <span className="brand-highlight">Route & Freight</span> Platform
            </h1>
            <p className="brand-desc">
              AI-powered maritime brokerage with real-time route intelligence, freight quotation, and smart recommendations.
            </p>

            <div className="brand-features">
              <div className="brand-feature">
                <div className="feature-dot dot-teal" />
                <span>AI Route Intelligence</span>
              </div>
              <div className="brand-feature">
                <div className="feature-dot dot-blue" />
                <span>Real-time Freight Quotation</span>
              </div>
              <div className="brand-feature">
                <div className="feature-dot dot-purple" />
                <span>Smart Analytics Dashboard</span>
              </div>
              <div className="brand-feature">
                <div className="feature-dot dot-gold" />
                <span>Multi-carrier Comparison</span>
              </div>
            </div>

            <div className="brand-stats">
              <div className="brand-stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Global Ports</span>
              </div>
              <div className="brand-stat-divider" />
              <div className="brand-stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Shipping Lines</span>
              </div>
              <div className="brand-stat-divider" />
              <div className="brand-stat">
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
            </div>
          </div>
        </div>

        <div className="login-form-panel">
          <div className={`login-card ${isTransitioning ? 'card-exit' : 'card-enter'}`}>
            <div className="login-header">
              <div className="header-icon-ring">
                <div className="header-icon">⚓</div>
              </div>
              <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p>{isLogin ? 'Sign in to access your dashboard' : 'Join the Maritime Brokerage AI Platform'}</p>
            </div>

            {error && (
              <div className="auth-error-banner" role="alert">
                <svg className="error-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form" noValidate>
              {!isLogin && (
                <div className={`input-group ${fieldErrors.fullName ? 'has-error' : ''}`}>
                  <label htmlFor="fullName">Full Name</label>
                  <div className="input-wrapper">
                    <span className="input-icon">{icons.person}</span>
                    <input type="text" id="fullName" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleChange} required autoComplete="name" />
                  </div>
                  {fieldErrors.fullName && <span className="field-error">{fieldErrors.fullName}</span>}
                </div>
              )}

              <div className={`input-group ${fieldErrors.email ? 'has-error' : ''}`}>
                <label htmlFor="email">Business Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">{icons.email}</span>
                  <input type="email" id="email" name="email" placeholder="you@company.com" value={formData.email} onChange={handleChange} required autoComplete="email" />
                </div>
                {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
              </div>

              {!isLogin && (
                <div className={`input-group ${fieldErrors.phone ? 'has-error' : ''}`}>
                  <label htmlFor="phone">Phone Number</label>
                  <div className="input-wrapper">
                    <span className="input-icon">{icons.phone}</span>
                    <input type="tel" id="phone" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} required autoComplete="tel" />
                  </div>
                  {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
                </div>
              )}

              {!isLogin && (
                <div className="input-group">
                  <label htmlFor="company">Company <span className="optional-tag">(Optional)</span></label>
                  <div className="input-wrapper">
                    <span className="input-icon">{icons.building}</span>
                    <input type="text" id="company" name="company" placeholder="Maritime Corp." value={formData.company} onChange={handleChange} autoComplete="organization" />
                  </div>
                </div>
              )}

              <div className={`input-group ${fieldErrors.password ? 'has-error' : ''}`}>
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">{icons.lock}</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide' : 'Show'}>
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
                {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
              </div>

              {!isLogin && (
                <div className={`input-group ${fieldErrors.confirmPassword ? 'has-error' : ''}`}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">{icons.lock}</span>
                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required autoComplete="new-password" />
                  </div>
                  {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
                </div>
              )}

              <button type="submit" className="submit-btn login-btn">
                <span className="btn-text">{isLogin ? 'Sign In' : 'Create Account'}</span>
                <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </form>

            <div className="login-divider">
              <span>or</span>
            </div>

            <div className="login-footer">
              <p>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <span className="toggle-auth" onClick={toggleMode}>
                  {isLogin ? 'Create one' : 'Sign in'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
