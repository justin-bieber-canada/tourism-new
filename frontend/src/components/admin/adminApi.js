// adminApi.js — thin wrapper around backend /api endpoints (no mocks)
import { api } from '../../services/api';

// Simple helpers that delegate to the shared api client. Token is read from localStorage.

export const authenticate = async (email, password) => {
  // Reuse the regular auth endpoint; admin user_type is validated server-side
  return await api.post('/auth/login', { email, password });
};

export const signout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getSummary = async () => {
  // No summary endpoint exists; derive a lightweight summary from key lists
  const [users, sites, requests, payments] = await Promise.all([
    getUsers(),
    getSites(),
    getRequests(),
    getPayments(),
  ]);
  return {
    users: users?.length ?? 0,
    sites: sites?.length ?? 0,
    requests: requests?.length ?? 0,
    payments: payments?.length ?? 0,
  };
};

export const getUsers = async () => {
  const res = await api.get('/admin/users');
  return res.data || res;
};

export const getSites = async () => {
  const res = await api.get('/sites');
  return res.data || res;
};

export const getRequests = async () => {
  const res = await api.get('/requests');
  // backend returns {requests: [...]}
  if (Array.isArray(res)) return res;
  return res.requests || res.data || [];
};

export const getPayments = async () => {
  const res = await api.get('/payments');
  return res.data || res;
};

export const createSite = async (site) => {
  return await api.post('/sites', site);
};

export const createUser = async (user) => {
  return await api.post('/admin/users', user);
};

export const toggleUserStatus = async (userId, isActive) => {
  return await api.put(`/admin/users/${userId}/status`, { is_active: isActive });
};

export const deleteUser = async (userId) => {
  return await api.delete(`/admin/users/${userId}`);
};

export const deleteSite = async (siteId) => {
  return await api.delete(`/sites/${siteId}`);
};

export const updateSite = async (site) => {
  return await api.patch(`/sites/${site.site_id}`, site);
};

export const updateSiteStatus = async (siteId, isApproved) => {
  // backend only supports approve route; treat isApproved true => approve, false => reject
  if (isApproved) {
    return await api.patch(`/sites/${siteId}/approve`, {});
  }
  return await api.patch(`/sites/${siteId}/approve`, { is_approved: false });
};

export const approveRequest = async (requestId) => {
  return await api.patch(`/requests/${requestId}/approve`, {});
};

export const rejectRequest = async (requestId) => {
  return await api.patch(`/requests/${requestId}/reject`, {});
};

export const assignGuide = async (requestId, payload = {}) => {
  return await api.patch(`/requests/${requestId}/assign-guide`, payload);
};

export const verifyPayment = async (paymentId) => {
  return await api.patch(`/payments/${paymentId}/verify`, {});
};

export const changePassword = async (_username, newPassword) => {
  // There is no dedicated admin change password endpoint; reuse profile update
  return await api.patch('/users/me', { password: newPassword });
};

export const updateProfile = async (_username, data) => {
  return await api.patch('/users/me', data);
};

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
