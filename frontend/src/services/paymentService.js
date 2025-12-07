// Client-side helper to initiate Chapa payments via your backend.
// IMPORTANT: Do NOT call Chapa with the secret key from the frontend. Your backend must proxy/initialize.

<<<<<<< HEAD:frontend/src/services/paymentService.js
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const paymentService = {
  async createChapaPayment(payload) {
    const res = await fetch(`${API_BASE}/api/payments/chapa/create`, {
=======
export const paymentService = {
  async createChapaPayment(payload) {
    // Expect your backend route to call Chapa's /transaction/initialize with secret key
    const res = await fetch('/api/payments/chapa/create', {
>>>>>>> 41b9e00640910ef9d739651c8d68b14547016eba:src/services/paymentService.js
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Unable to start Chapa payment');
    }

<<<<<<< HEAD:frontend/src/services/paymentService.js
    return res.json();
=======
    return res.json(); // should contain { checkout_url, tx_ref, ... }
>>>>>>> 41b9e00640910ef9d739651c8d68b14547016eba:src/services/paymentService.js
  }
};
