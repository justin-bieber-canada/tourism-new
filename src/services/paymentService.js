// Client-side helper to initiate Chapa payments via your backend.
// IMPORTANT: Do NOT call Chapa with the secret key from the frontend. Your backend must proxy/initialize.

export const paymentService = {
  async createChapaPayment(payload) {
    // Expect your backend route to call Chapa's /transaction/initialize with secret key
    const res = await fetch('/api/payments/chapa/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Unable to start Chapa payment');
    }

    return res.json(); // should contain { checkout_url, tx_ref, ... }
  }
};
