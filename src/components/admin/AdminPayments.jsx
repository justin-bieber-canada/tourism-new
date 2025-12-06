import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { getPayments, verifyPayment } from './adminService';
import ThemeToggle from '../common/ThemeToggle';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  useEffect(() => { getPayments().then(setPayments); }, []);

  const refresh = () => getPayments().then(setPayments);

  const handleVerify = async (id) => {
    try { await verifyPayment(id); refresh(); } catch (err) { alert('Verify failed: ' + err.message); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>Payments</h1>
          <ThemeToggle />
        </header>
        <section className="panel">
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.payment_id}>
                  <td>{p.payment_id}</td>
                  <td>${p.total_amount}</td>
                      <td>{p.payment_status}</td>
                      <td><button className="btn-sm">View</button> <button className="btn-sm" onClick={() => handleVerify(p.payment_id)}>Verify</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
