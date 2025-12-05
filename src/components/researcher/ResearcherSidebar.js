import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './researcher.css';

export default function ResearcherSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('researcher_token');
    localStorage.removeItem('researcher_user');
    navigate('/login');
  };

  return (
    <aside className={`researcher-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="researcher-brand">
        <span>{collapsed ? 'R' : 'Researcher'}</span>
        <button className="collapse-toggle" onClick={() => setCollapsed(!collapsed)} title={collapsed ? "Expand" : "Collapse"}>
          {collapsed ? '»' : '«'}
        </button>
      </div>

      <nav>
        <div className="researcher-nav-links">
          <NavLink to="/researcher/dashboard" className={({ isActive }) => isActive ? 'active' : ''} title={collapsed ? "Dashboard" : ""}>
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </NavLink>
          <NavLink to="/researcher/sites" className={({ isActive }) => isActive ? 'active' : ''} title={collapsed ? "My Sites" : ""}>
            <span className="nav-icon">🏛️</span>
            <span className="nav-label">My Sites</span>
          </NavLink>
          <NavLink to="/researcher/profile" className={({ isActive }) => isActive ? 'active' : ''} title={collapsed ? "Profile" : ""}>
            <span className="nav-icon">👤</span>
            <span className="nav-label">Profile</span>
          </NavLink>
        </div>

        <div className="researcher-nav-bottom">
          <button className="nav-logout" onClick={handleLogout} title={collapsed ? "Logout" : ""}>
            {collapsed ? '🚪' : 'Logout'}
          </button>
        </div>
      </nav>
    </aside>
  );
}
