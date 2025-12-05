import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './guide.css';

export default function GuideSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('guide_user');
    navigate('/login');
  };

  return (
    <aside className={`guide-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="guide-brand">
        <span>Site Agent Panel</span>
        <button className="collapse-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '»' : '«'}
        </button>
      </div>

      <nav>
        <div className="guide-nav-links">
          <NavLink to="/guide/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </NavLink>
          <NavLink to="/guide/requests" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon">📋</span>
            <span className="nav-label">Requests</span>
          </NavLink>
          <NavLink to="/guide/schedule" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon">📅</span>
            <span className="nav-label">Schedule</span>
          </NavLink>
          <NavLink to="/guide/reports" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon">📢</span>
            <span className="nav-label">Reports</span>
          </NavLink>
          <NavLink to="/guide/profile" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon">👤</span>
            <span className="nav-label">Profile</span>
          </NavLink>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button className="nav-logout" onClick={handleLogout} style={{
            width: '100%', padding: '12px', border: 'none', background: '#fff1f0', 
            color: '#ff4d4f', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start'
          }}>
            <span className="nav-icon">🚪</span>
            {!collapsed && <span className="nav-label" style={{marginLeft: '10px'}}>Logout</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
}
