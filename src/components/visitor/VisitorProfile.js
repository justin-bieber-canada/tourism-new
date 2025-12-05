import React, { useState } from 'react';
import VisitorSidebar from './VisitorSidebar';
import './visitor.css';

export default function VisitorProfile() {
  const [profile, setProfile] = useState({
    firstName: 'Visitor',
    lastName: 'User',
    email: 'visitor@example.com',
    phone: '0911223344'
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
        alert('Passwords do not match!');
        return;
    }
    alert('Password changed successfully!');
    setPassword({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="visitor-layout">
      <VisitorSidebar />
      <main className="visitor-main">
        <header className="visitor-main-header">
          <h1>Account Settings</h1>
        </header>

        <div className="row">
            <div className="col-md-6">
                <div className="card p-4 mb-4">
                    <h3>Edit Profile</h3>
                    <form onSubmit={handleProfileUpdate}>
                        <div className="mb-3">
                            <label className="form-label">First Name</label>
                            <input type="text" className="form-control" value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Last Name</label>
                            <input type="text" className="form-control" value={profile.lastName} onChange={e => setProfile({...profile, lastName: e.target.value})} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" value={profile.email} disabled />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Phone Number</label>
                            <input type="text" className="form-control" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
                        </div>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </form>
                </div>
            </div>

            <div className="col-md-6">
                <div className="card p-4">
                    <h3>Change Password</h3>
                    <form onSubmit={handlePasswordChange}>
                        <div className="mb-3">
                            <label className="form-label">Current Password</label>
                            <input type="password" className="form-control" value={password.current} onChange={e => setPassword({...password, current: e.target.value})} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <input type="password" className="form-control" value={password.new} onChange={e => setPassword({...password, new: e.target.value})} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirm New Password</label>
                            <input type="password" className="form-control" value={password.confirm} onChange={e => setPassword({...password, confirm: e.target.value})} required />
                        </div>
                        <button type="submit" className="btn btn-warning text-dark">Update Password</button>
                    </form>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
