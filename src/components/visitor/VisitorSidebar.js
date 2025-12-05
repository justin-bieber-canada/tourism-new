import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './visitor.css';

export default function VisitorSidebar() {
  const navigate = useNavigate();
  const signout = () => {
    localStorage.removeItem('visitor_token');
    localStorage.removeItem('visitor_user');
    navigate('/login');
  };
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => setCollapsed(v => !v);
  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('visitor-mobile-open');
    } else {
      document.body.classList.remove('visitor-mobile-open');
    }
    return () => document.body.classList.remove('visitor-mobile-open');
  }, [mobileOpen]);

  return (
    <>
      <button className="mobile-menu-button" onClick={openMobile} aria-label="Open menu">☰</button>
      {mobileOpen && <div className="visitor-mobile-backdrop" onClick={closeMobile} />}
      <aside className={`visitor-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="visitor-brand">
          <span>Visitor Panel</span>
          <button className="collapse-toggle" onClick={toggleCollapsed} aria-label="Toggle sidebar">{collapsed ? '»' : '«'}</button>
          <button className="mobile-close" onClick={closeMobile} aria-label="Close menu">✕</button>
        </div>
        <nav>
          <div className="visitor-nav-links">
            <NavLink to="/visitor/dashboard" onClick={closeMobile}>
              <span className="nav-icon">🏠</span>
              <span className="nav-label">Dashboard</span>
            </NavLink>
            <NavLink to="/visitor/sites" onClick={closeMobile}>
              <span className="nav-icon">🌍</span>
              <span className="nav-label">Explore Sites</span>
            </NavLink>
            <NavLink to="/visitor/history" onClick={closeMobile}>
              <span className="nav-icon">📅</span>
              <span className="nav-label">My Visits</span>
            </NavLink>
            <NavLink to="/visitor/payments" onClick={closeMobile}>
              <span className="nav-icon">💳</span>
              <span className="nav-label">Payments</span>
            </NavLink>
            <NavLink to="/visitor/profile" onClick={closeMobile}>
              <span className="nav-icon">👤</span>
              <span className="nav-label">Profile</span>
            </NavLink>
          </div>
          <div className="visitor-nav-bottom">
            <button className="nav-logout" onClick={signout}>
              <span className="nav-icon">🚪</span>
              <span className="nav-label">Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
