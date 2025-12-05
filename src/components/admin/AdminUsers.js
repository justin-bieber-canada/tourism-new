import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { getUsers, toggleUserStatus, deleteUser } from './adminService';
import AddUserModal from './AddUserModal';
import AdminModal from './AdminModal';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  useEffect(() => { getUsers().then(setUsers); }, []);

  const refresh = () => getUsers().then(setUsers);
  const onUserCreated = () => { refresh(); };

  const handleToggleStatus = async (user) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Are you sure you want to ${user.is_active ? 'deactivate' : 'activate'} this user?`)) return;
    try {
      await toggleUserStatus(user.user_id, !user.is_active);
      refresh();
    } catch (err) {
      alert('Action failed: ' + err.message);
    }
  };

  const handleDelete = async (user) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Are you sure you want to delete user ${user.first_name} ${user.last_name}? This action cannot be undone.`)) return;
    try {
      await deleteUser(user.user_id);
      refresh();
    } catch (err) {
      alert('Failed to delete user: ' + err.message);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header"><h1>Users</h1></header>
        <section className="panel">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <h3>Users</h3>
            <div>
              <button className="btn-primary" onClick={() => setShowAddUser(true)}>Add User</button>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr><th>ID</th><th>Name</th><th>Email</th><th>Type</th><th>Active</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.user_id}>
                    <td>{u.user_id}</td>
                    <td>{u.first_name} {u.last_name}</td>
                    <td>{u.email}</td>
                    <td>{(u.user_type === 'guide' || u.user_type === 'site_agent') ? 'Site Agent' : u.user_type}</td>
                    <td>{u.is_active ? 'Yes' : 'No'}</td>
                    <td>
                      <div style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
                        <button className="btn-sm" onClick={() => setViewUser(u)}>View</button> 
                        <button 
                          className={`btn-sm ${u.is_active ? 'btn-danger' : 'btn-primary'}`} 
                          onClick={() => handleToggleStatus(u)}
                        >
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          className="btn-sm btn-danger" 
                          onClick={() => handleDelete(u)}
                          style={{backgroundColor: '#ff4d4f', borderColor: '#ff4d4f'}}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      {showAddUser && <AddUserModal onClose={() => setShowAddUser(false)} onCreated={onUserCreated} />}
      {viewUser && (
        <AdminModal title="User Details" onClose={() => setViewUser(null)}>
          <div className="user-details">
            <p><strong>ID:</strong> {viewUser.user_id}</p>
            <p><strong>Name:</strong> {viewUser.first_name} {viewUser.last_name}</p>
            <p><strong>Email:</strong> {viewUser.email}</p>
            <p><strong>Username:</strong> {viewUser.username}</p>
            <p><strong>Type:</strong> {(viewUser.user_type === 'guide' || viewUser.user_type === 'site_agent') ? 'Site Agent' : viewUser.user_type}</p>
            <p><strong>Status:</strong> {viewUser.is_active ? 'Active' : 'Inactive'}</p>
            <div style={{marginTop: 20, textAlign: 'right'}}>
              <button 
                className="btn-danger" 
                onClick={() => {
                  if (window.confirm('Delete this user?')) {
                    deleteUser(viewUser.user_id).then(() => {
                      setViewUser(null);
                      refresh();
                    });
                  }
                }}
                style={{marginRight: '10px'}}
              >
                Delete User
              </button>
              <button className="btn-primary" onClick={() => setViewUser(null)}>Close</button>
            </div>
          </div>
        </AdminModal>
      )}
      </main>
    </div>
  );
}
