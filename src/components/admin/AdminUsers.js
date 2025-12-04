import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { getUsers } from './adminService';
import AddUserModal from './AddUserModal';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  useEffect(() => { getUsers().then(setUsers); }, []);

  const refresh = () => getUsers().then(setUsers);
  const onUserCreated = () => { refresh(); };

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
                    <td>{u.user_type}</td>
                    <td>{u.is_active ? 'Yes' : 'No'}</td>
                    <td><button className="btn-sm">View</button> <button className="btn-sm btn-danger">Deactivate</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      {showAddUser && <AddUserModal onClose={() => setShowAddUser(false)} onCreated={onUserCreated} />}
      </main>
    </div>
  );
}
