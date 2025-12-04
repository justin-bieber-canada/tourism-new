import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { getSummary, getRequests, getPayments, createSite, createUser } from './adminService';
import AddSiteModal from './AddSiteModal';
import AddUserModal from './AddUserModal';

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [requests, setRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showAddSite, setShowAddSite] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserType, setAddUserType] = useState('guide');

  useEffect(() => {
    getSummary().then(setSummary);
    getRequests().then(setRequests);
    getPayments().then(setPayments);
  }, []);

  const refresh = () => {
    getSummary().then(setSummary);
    getRequests().then(setRequests);
    getPayments().then(setPayments);
  };

  const onSiteCreated = (site) => { refresh(); };
  const onUserCreated = (user) => { refresh(); };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header">
          <h1>Dashboard</h1>
          <div className="admin-actions">
            <button className="btn-primary" onClick={() => setShowAddSite(true)}>Add Site</button>
            <button className="btn-outline" onClick={() => { setAddUserType('guide'); setShowAddUser(true); }}>Add Guide</button>
            <button className="btn-outline" onClick={() => { setAddUserType('researcher'); setShowAddUser(true); }}>Add Researcher</button>
          </div>
        </header>

        <section className="admin-cards">
          {summary ? (
            <>
              <div className="card">
                <h3>Total Users</h3>
                <div className="card-value">{summary.totalUsers}</div>
              </div>
              <div className="card">
                <h3>Total Sites</h3>
                <div className="card-value">{summary.totalSites}</div>
              </div>
              <div className="card">
                <h3>Total Visits</h3>
                <div className="card-value">{summary.totalVisits}</div>
              </div>
              <div className="card">
                <h3>Payments</h3>
                <div className="card-value">{summary.totalPayments}</div>
              </div>
            </>
          ) : (
            <div>Loading summary…</div>
          )}
        </section>

        <section className="admin-columns">
          <div className="panel">
            <h4>Pending Visitor Requests</h4>
            <ul className="list">
              {requests.length === 0 && <li>No requests</li>}
              {requests.slice(0,5).map(r => (
                <li key={r.request_id}>{r.visitor_name} — {r.site_name} — {r.request_status}</li>
              ))}
            </ul>
          </div>

          <div className="panel">
            <h4>Pending Payments</h4>
            <ul className="list">
              {payments.filter(p => p.payment_status === 'pending').slice(0,5).map(p => (
                <li key={p.payment_id}>#{p.payment_id} — ${p.total_amount} — {p.payment_status}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Add-buttons moved to header; removed duplicate controls here */}

        <section className="admin-logs">
          <h4>Recent System Activity</h4>
          <div className="log">User User12 updated profile</div>
          <div className="log">Payment #23 confirmed</div>
          <div className="log">Site 'Historical Site 3' approved</div>
        </section>
      </main>
      {showAddSite && <AddSiteModal onClose={() => setShowAddSite(false)} onCreated={onSiteCreated} />}
      {showAddUser && <AddUserModal defaultType={addUserType} onClose={() => setShowAddUser(false)} onCreated={onUserCreated} />}
    </div>
  );
}
