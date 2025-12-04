import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './admin.css';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const signout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => setCollapsed(v => !v);
  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    // prevent body scroll when mobile sidebar is open
    if (mobileOpen) {
      document.body.classList.add('admin-mobile-open');
    } else {
      document.body.classList.remove('admin-mobile-open');
    }
    return () => document.body.classList.remove('admin-mobile-open');
  }, [mobileOpen]);

  return (
    <>
      <button className="mobile-menu-button" onClick={openMobile} aria-label="Open menu">☰</button>
      {mobileOpen && <div className="admin-mobile-backdrop" onClick={closeMobile} />}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="admin-brand">
          <span>Tourism Admin</span>
          <button className="collapse-toggle" onClick={toggleCollapsed} aria-label="Toggle sidebar">{collapsed ? '»' : '«'}</button>
          <button className="mobile-close" onClick={closeMobile} aria-label="Close menu">✕</button>
        </div>
        <nav>
          <div className="admin-nav-links">
            <NavLink to="/admin/dashboard" onClick={closeMobile}>Dashboard</NavLink>
            <NavLink to="/admin/users" onClick={closeMobile}>Users</NavLink>
            <NavLink to="/admin/sites" onClick={closeMobile}>Sites</NavLink>
            <NavLink to="/admin/requests" onClick={closeMobile}>Requests</NavLink>
            <NavLink to="/admin/payments" onClick={closeMobile}>Payments</NavLink>
            <NavLink to="/admin/reports" onClick={closeMobile}>Reports</NavLink>
            <NavLink to="/admin/change-password" onClick={closeMobile}>Change Password</NavLink>
          </div>
          <div className="admin-nav-bottom">
            <button className="nav-logout" onClick={signout}>Logout</button>
          </div>
        </nav>
      </aside>
    </>
  );
}
