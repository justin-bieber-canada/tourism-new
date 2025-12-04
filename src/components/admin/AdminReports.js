import React from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';

export default function AdminReports() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header"><h1>Reports & Analytics</h1></header>
        <section className="panel">
          <div className="report-grid">
            <div className="report-card"><h4>Visits Report</h4><p>Number of visits per period, top sites.</p></div>
            <div className="report-card"><h4>Payments Report</h4><p>Revenue, pending payments.</p></div>
            <div className="report-card"><h4>User Activity</h4><p>Registrations, active users.</p></div>
          </div>
          <div style={{marginTop:16}}>
            <button className="btn-primary">Export CSV</button>
            <button className="btn-outline">Export PDF</button>
          </div>
        </section>
      </main>
    </div>
  );
}
