import React, { useState, useEffect } from 'react';
import GuideSidebar from './GuideSidebar';
import './guide.css';
import { guideService } from '../../services/guideService';

export default function GuideRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const user = JSON.parse(localStorage.getItem('guide_user'));
    if (user) {
      guideService.getAssignedRequests(user.user_id).then(data => {
        // Filter for requests that are assigned but not yet completed/cancelled
        // Or specifically ones waiting for guide acceptance if that's the flow
        // For now, show all active ones
        setRequests(data);
        setLoading(false);
      });
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    if (window.confirm(`Are you sure you want to ${newStatus === 'accepted_by_guide' ? 'accept' : 'reject'} this request?`)) {
      const success = await guideService.updateRequestStatus(requestId, newStatus);
      if (success) {
        loadRequests();
      } else {
        alert('Failed to update status');
      }
    }
  };

  return (
    <div className="guide-layout">
      <GuideSidebar />
      <main className="guide-main">
        <header className="guide-header">
          <h1>Assigned Requests</h1>
        </header>

        <div className="guide-card">
          {loading ? (
            <p>Loading requests...</p>
          ) : requests.length === 0 ? (
            <p>No requests assigned to you at the moment.</p>
          ) : (
            <table className="guide-table">
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Site</th>
                  <th>Date</th>
                  <th>Group Size</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.request_id}>
                    <td>{req.visitor_name}</td>
                    <td>{req.site_name}</td>
                    <td>{req.preferred_date}</td>
                    <td>{req.group_size}</td>
                    <td>
                      <span className={`status-badge status-${req.request_status}`}>
                        {req.request_status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      {/* Logic: If status is 'assigned' (by admin), guide can Accept or Reject */}
                      {(req.request_status === 'assigned' || req.request_status === 'approved') && (
                        <div style={{display: 'flex', gap: '10px'}}>
                          <button 
                            className="guide-btn btn-primary"
                            onClick={() => handleStatusChange(req.request_id, 'accepted_by_guide')}
                          >
                            Accept
                          </button>
                          <button 
                            className="guide-btn btn-danger"
                            onClick={() => handleStatusChange(req.request_id, 'rejected_by_guide')}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      
                      {/* If accepted, maybe mark as completed later? handled in schedule/reports usually */}
                      {req.request_status === 'accepted_by_guide' && (
                        <span style={{color: '#52c41a', fontWeight: 'bold'}}>Accepted</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
