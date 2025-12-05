import React, { useState, useEffect } from 'react';
import VisitorSidebar from './VisitorSidebar';
import './visitor.css';
import { visitorService } from '../../services/visitorService';

export default function VisitorPayments() {
  const [activeTab, setActiveTab] = useState('pending'); // pending, history
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('telebirr');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  
  const [pendingRequests, setPendingRequests] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const user = JSON.parse(localStorage.getItem('visitor_user'));
    if (!user) return;

    visitorService.getMyRequests(user.user_id).then(requests => {
        // Filter requests that are pending payment (or just created and not paid)
        // For simplicity, let's say all requests need payment unless they have a confirmed payment
        visitorService.getMyPayments(user.user_id).then(payments => {
            const paidRequestIds = payments.map(p => p.request_id);
            
            const pending = requests.filter(r => !paidRequestIds.includes(r.request_id));
            setPendingRequests(pending);

            setPaymentHistory(payments);
        });
    });
  };

  const handlePayClick = (request) => {
    setSelectedRequest(request);
    setSelectedPaymentMethod('telebirr'); // Default
    setPaymentProofFile(null);
    setShowUploadModal(true);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    
    let proofUrl = 'https://via.placeholder.com/150';
    if (paymentProofFile) {
      proofUrl = URL.createObjectURL(paymentProofFile);
    }

    const paymentData = {
        request_id: selectedRequest.request_id,
        site: selectedRequest.site_name,
        amount: selectedRequest.amount || 500, // Fallback
        method: selectedPaymentMethod,
        date: new Date().toISOString().split('T')[0],
        proof_url: proofUrl
    };

    visitorService.submitPayment(paymentData).then(() => {
        alert('Payment proof uploaded successfully! Admin will verify.');
        setShowUploadModal(false);
        loadData(); // Refresh lists
    });
  };

  return (
    <div className="visitor-layout">
      <VisitorSidebar />
      <main className="visitor-main">
        <header className="visitor-main-header">
          <h1>Payments</h1>
        </header>

        <div className="card p-3">
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Pending Payments</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Payment History</button>
                </li>
            </ul>

            {activeTab === 'pending' && (
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Request ID</th>
                                <th>Site</th>
                                <th>Amount (ETB)</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingRequests.map(p => (
                                <tr key={p.request_id}>
                                    <td>#{p.request_id}</td>
                                    <td>{p.site_name}</td>
                                    <td>{p.amount || 'N/A'}</td>
                                    <td>{p.preferred_date}</td>
                                    <td><span className="badge bg-warning text-dark">{p.request_status}</span></td>
                                    <td>
                                        <button className="btn btn-sm btn-success" onClick={() => handlePayClick(p)}>Pay Now</button>
                                    </td>
                                </tr>
                            ))}
                            {pendingRequests.length === 0 && <tr><td colSpan="6" className="text-center">No pending payments.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Site</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Method</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentHistory.map(p => (
                                <tr key={p.payment_id}>
                                    <td>#{p.payment_id}</td>
                                    <td>{p.site}</td>
                                    <td>{p.amount}</td>
                                    <td>{p.date}</td>
                                    <td>{p.method}</td>
                                    <td><span className={`badge ${p.payment_status === 'confirmed' ? 'bg-success' : 'bg-secondary'}`}>{p.payment_status}</span></td>
                                </tr>
                            ))}
                            {paymentHistory.length === 0 && <tr><td colSpan="6" className="text-center">No payment history.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* Payment Modal */}
        {showUploadModal && (
            <div className="admin-modal-backdrop">
                <div className="admin-modal" style={{maxWidth: '600px'}}>
                    <div className="admin-modal-header">
                        <h3>Make Payment for Request #{selectedRequest?.id}</h3>
                        <button className="btn-ghost text-dark" onClick={() => setShowUploadModal(false)}>✕</button>
                    </div>
                    <div className="admin-modal-body">
                        <div className="mb-3">
                            <label className="form-label">Select Payment Method</label>
                            <select className="form-select" value={selectedPaymentMethod} onChange={(e) => setSelectedPaymentMethod(e.target.value)}>
                                <option value="telebirr">Telebirr</option>
                                <option value="bank">Bank Transfer</option>
                                <option value="chapa">Chapa (Online)</option>
                            </select>
                        </div>

                        {selectedPaymentMethod === 'telebirr' && (
                            <div className="alert alert-info">
                                <strong>Telebirr Payment:</strong><br/>
                                1. Dial *127#<br/>
                                2. Pay to Merchant: <strong>123456</strong><br/>
                                3. Amount: <strong>{selectedRequest?.amount} ETB</strong><br/>
                                4. Upload screenshot below.
                            </div>
                        )}

                        {selectedPaymentMethod === 'bank' && (
                            <div className="alert alert-info">
                                <strong>Bank Transfer:</strong><br/>
                                CBE Account: <strong>1000123456789</strong><br/>
                                Name: Tourism Agency<br/>
                                Amount: <strong>{selectedRequest?.amount} ETB</strong><br/>
                                Upload receipt below.
                            </div>
                        )}

                        {selectedPaymentMethod === 'chapa' ? (
                            <div className="text-center my-4">
                                <button className="btn btn-lg btn-primary">Proceed to Chapa Secure Payment</button>
                            </div>
                        ) : (
                            <form onSubmit={handleUploadSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Upload Proof (Screenshot/Receipt)</label>
                                    <input 
                                      type="file" 
                                      className="form-control" 
                                      required 
                                      accept="image/*,.pdf"
                                      onChange={(e) => setPaymentProofFile(e.target.files[0])} 
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Submit Payment Proof</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
