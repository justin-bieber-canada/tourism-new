import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { getRequests, approveRequest, rejectRequest, assignGuide } from './adminService';


export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  useEffect(() => { getRequests().then(setRequests); }, []);

  const refresh = () => getRequests().then(setRequests);

  const handleApprove = async (id) => {
    try { await approveRequest(id); refresh(); } catch (err) { alert('Approve failed: ' + err.message); }
  };

  const handleReject = async (id) => {
    try { await rejectRequest(id); refresh(); } catch (err) { alert('Reject failed: ' + err.message); }
  };

  const handleAssign = async (id) => {
    const guideId = parseInt(prompt('Enter guide user_id to assign'));
    if (!guideId) return;
    try { await assignGuide(id, { guide_id: guideId }); refresh(); } catch (err) { alert('Assign failed: ' + err.message); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header"><h1>Visitor Requests</h1></header>
        <section className="panel">
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Visitor</th><th>Site</th><th>Date</th><th>People</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.request_id}>
                  <td>{r.request_id}</td>
                  <td>{r.visitor_name}</td>
                  <td>{r.site_name}</td>
                  <td>{r.preferred_date}</td>
                  <td>{r.number_of_visitors}</td>
                      <td>{r.request_status}</td>
                      <td>
                        <button className="btn-sm" onClick={() => handleApprove(r.request_id)}>Approve</button>
                        <button className="btn-sm btn-danger" onClick={() => handleReject(r.request_id)}>Reject</button>
                        <button className="btn-sm" onClick={() => handleAssign(r.request_id)}>Assign Guide</button>
                      </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
