// adminApi.js — thin wrapper around fetch to call backend admin endpoints
const BASE = process.env.REACT_APP_ADMIN_API_URL || '/api';

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API error ${res.status}`);
  }
  // If no content
  if (res.status === 204) return null;
  return res.json();
}

export function authenticate(username, password) {
  return request('/admin/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
}

export function signout() {
  return request('/admin/auth/logout', { method: 'POST' });
}

export function getSummary() {
  return request('/admin/summary');
}

export function getUsers() {
  return request('/admin/users');
}

export function getSites() {
  return request('/admin/sites');
}

export function getRequests() {
  return request('/admin/requests');
}

export function getPayments() {
  return request('/admin/payments');
}

export function createSite(site) {
  return request('/admin/sites', { method: 'POST', body: JSON.stringify(site) });
}

export function createUser(user) {
  return request('/admin/users', { method: 'POST', body: JSON.stringify(user) });
}

export function toggleUserStatus(userId, isActive) {
  return request(`/admin/users/${userId}/status`, { method: 'PUT', body: JSON.stringify({ is_active: isActive }) });
}

export function deleteUser(userId) {
  return request(`/admin/users/${userId}`, { method: 'DELETE' });
}

export function deleteSite(siteId) {
  return request(`/admin/sites/${siteId}`, { method: 'DELETE' });
}

export function updateSite(site) {
  return request(`/admin/sites/${site.site_id}`, { method: 'PUT', body: JSON.stringify(site) });
}

export function updateSiteStatus(siteId, isApproved) {
  return request(`/admin/sites/${siteId}/status`, { method: 'PUT', body: JSON.stringify({ is_approved: isApproved }) });
}

export function approveRequest(requestId, payload = {}) {
  return request(`/admin/requests/${requestId}/approve`, { method: 'POST', body: JSON.stringify(payload) });
}

export function rejectRequest(requestId, payload = {}) {
  return request(`/admin/requests/${requestId}/reject`, { method: 'POST', body: JSON.stringify(payload) });
}

export function assignGuide(requestId, payload = {}) {
  return request(`/admin/requests/${requestId}/assign`, { method: 'POST', body: JSON.stringify(payload) });
}

export function verifyPayment(paymentId, payload = {}) {
  return request(`/admin/payments/${paymentId}/verify`, { method: 'POST', body: JSON.stringify(payload) });
}

export function changePassword(username, oldPassword, newPassword) {
  return request('/admin/auth/change-password', { method: 'POST', body: JSON.stringify({ username, oldPassword, newPassword }) });
}

export function updateProfile(username, data) {
  return request('/admin/auth/profile', { method: 'PUT', body: JSON.stringify({ username, ...data }) });
}

export default {
  authenticate,
  signout,
  getSummary,
  getUsers,
  getSites,
  getRequests,
  getPayments,
  createSite,
  createUser,
  toggleUserStatus,
  deleteUser,
  deleteSite,
  updateSite,
  updateSiteStatus,
  approveRequest,
  rejectRequest,
  assignGuide,
  verifyPayment,
  changePassword,
  updateProfile,
};
