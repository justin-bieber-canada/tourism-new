import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import ThemeToggle from '../common/ThemeToggle';
import './admin.css';
import { getSummary, getRequests, getPayments, createSite, createUser } from './adminService';
import AddSiteModal from './AddSiteModal';
import AddUserModal from './AddUserModal';

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [requests, setRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserType, setAddUserType] = useState('site_agent');
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getSummary().then(setSummary);
    getRequests().then(data => {
      setRequests(data);
      setUnreadCount(data.length);
    });
    getPayments().then(setPayments);
  }, []);

  const refresh = () => {
    getSummary().then(setSummary);
    getRequests().then(data => {
      setRequests(data);
      setUnreadCount(data.length);
    });
    getPayments().then(setPayments);
  };

  const onUserCreated = (user) => { refresh(); };

  const formatStatus = (status) => {
    if (status === 'accepted_by_guide') return 'Accepted';
    return status;
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header">
          <div className="admin-actions">
            <button className="btn-outline" onClick={() => { setAddUserType('site_agent'); setShowAddUser(true); }}>Add Site Agent</button>
            <button className="btn-outline" onClick={() => { setAddUserType('researcher'); setShowAddUser(true); }}>Add Researcher</button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ThemeToggle />
            <div style={{position: 'relative'}}>
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) setUnreadCount(0);
              }}
              style={{
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                fontSize: '1.2rem',
                position: 'relative'
              }}
            >
              🔔
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: '#ff4d4f',
                  color: 'white',
                  fontSize: '0.7rem',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '350px',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                zIndex: 1000,
                border: '1px solid #eee',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <div style={{padding: '15px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: '#333'}}>
                  Notifications
                </div>
                {requests.length === 0 ? (
                  <div style={{padding: '20px', textAlign: 'center', color: '#999'}}>No new requests</div>
                ) : (
                  <ul style={{listStyle: 'none', margin: 0, padding: 0}}>
                    <li style={{padding: '12px 15px', borderBottom: '1px solid #f5f5f5', display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: '#f0f9ff'}}>
                       <div style={{fontWeight: '500', color: '#333'}}>System Notification</div>
                       <div style={{fontSize: '0.9rem', color: '#666'}}>Site 'Historical Site 3' approved</div>
                    </li>
                    <li style={{padding: '12px 15px', borderBottom: '1px solid #f5f5f5', display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: '#f0f9ff'}}>
                       <div style={{fontWeight: '500', color: '#333'}}>System Notification</div>
                       <div style={{fontSize: '0.9rem', color: '#666'}}>Payment #23 confirmed</div>
                    </li>
                    <li style={{padding: '12px 15px', borderBottom: '1px solid #f5f5f5', display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: '#f0f9ff'}}>
                       <div style={{fontWeight: '500', color: '#333'}}>System Notification</div>
                       <div style={{fontSize: '0.9rem', color: '#666'}}>User User12 updated profile</div>
                    </li>
                    {requests.map(r => (
                      <li key={r.request_id} style={{padding: '12px 15px', borderBottom: '1px solid #f5f5f5', display: 'flex', flexDirection: 'column', gap: '4px'}}>
                        <div style={{fontWeight: '500', color: '#333'}}>{r.visitor_name}</div>
                        <div style={{fontSize: '0.9rem', color: '#666'}}>{r.site_name}</div>
                        <div style={{fontSize: '0.85rem', color: r.request_status === 'accepted_by_guide' ? '#52c41a' : '#fa8c16'}}>
                          Status: {formatStatus(r.request_status)}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          </div>
        </header>

        {summary ? (
          <section className="admin-cards">
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
          </section>
        ) : (
          <LoadingSpinner />
        )}
      </main>
      {showAddUser && <AddUserModal defaultType={addUserType} onClose={() => setShowAddUser(false)} onCreated={onUserCreated} />}
    </div>
  );
}
