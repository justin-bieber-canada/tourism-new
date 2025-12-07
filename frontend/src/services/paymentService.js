// Client-side helper to initiate Chapa payments via your backend.
// IMPORTANT: Do NOT call Chapa with the secret key from the frontend. Your backend must proxy/initialize.

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const paymentService = {
  async createChapaPayment(payload) {
    const res = await fetch(`${API_BASE}/api/payments/chapa/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Unable to start Chapa payment');
    }

    return res.json();
  }
};
