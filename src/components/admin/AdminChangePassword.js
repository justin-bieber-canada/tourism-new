import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { changePassword } from './adminService';
import { useNavigate } from 'react-router-dom';

export default function AdminChangePassword() {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) { alert('Passwords do not match'); return; }
    setLoading(true);
    try {
      const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
      await changePassword(adminUser.username || 'admin', oldPass, newPass);
      // clear must-change flag and proceed to dashboard
      localStorage.removeItem('must_change_password');
      alert('Password changed successfully');
      navigate('/admin/dashboard');
    } catch (err) {
      alert('Change failed: ' + err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header"><h1>Change Password</h1></header>
        <section className="panel" style={{maxWidth:520}}>
          <form onSubmit={handleSubmit}>
            <label>Old Password</label>
            <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} required />
            <label style={{marginTop:8}}>New Password</label>
            <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} required />
            <label style={{marginTop:8}}>Confirm New Password</label>
            <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required />
            <div style={{marginTop:12}}>
              <button className="btn-primary" disabled={loading}>{loading ? 'Saving…' : 'Change Password'}</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
