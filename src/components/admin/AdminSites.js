import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { getSites, deleteSite } from './adminService';

export default function AdminSites() {
  const [sites, setSites] = useState([]);
  useEffect(() => { getSites().then(setSites); }, []);

  const refresh = () => getSites().then(setSites);

  const handleDelete = async (id) => {
    // use window.confirm but disable the eslint restricted-globals warning for this line
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Delete this site?')) return;
    try {
      await deleteSite(id);
      refresh();
    } catch (err) { alert('Delete failed: ' + err.message); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header"><h1>Sites</h1></header>
        <section className="panel">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <h3>Sites</h3>
          </div>
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Researcher</th><th>Approved</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {sites.map(s => (
                <tr key={s.site_id}>
                  <td>{s.site_id}</td>
                  <td>{s.site_name}</td>
                  <td>{s.researcher || 'N/A'}</td>
                  <td>{s.is_approved ? 'Yes' : 'No'}</td>
                  <td><button className="btn-sm">View</button> <button className="btn-sm btn-danger" onClick={() => handleDelete(s.site_id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
