import { dataService } from '../../services/dataService';

const DEFAULT_ADMIN_PASSWORD = 'admin123';
const admin = {
  username: 'admin',
  password: DEFAULT_ADMIN_PASSWORD,
};

export function authenticate(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === admin.username && password === admin.password) {
        resolve({ token: 'mock-admin-token', user: { username: 'admin', name: 'Administrator' } });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 400);
  });
}

export function signout() {
  return new Promise((res) => setTimeout(res, 200));
}

export function getSummary() {
  return Promise.resolve(dataService.getSummary());
}

export function getUsers() { return Promise.resolve(dataService.getUsers()); }
export function getSites() { return Promise.resolve(dataService.getSites()); }
export function getRequests() { return Promise.resolve(dataService.getRequests()); }
export function getPayments() { return Promise.resolve(dataService.getPayments()); }

export function createSite(site) {
  return Promise.resolve(dataService.addSite(site));
}

export function createUser(user) {
  return Promise.resolve(dataService.addUser(user));
}

export function deleteSite(siteId) {
  return Promise.resolve(dataService.deleteSite(siteId));
}

export function approveRequest(requestId) {
  return Promise.resolve(dataService.updateRequestStatus(requestId, 'approved'));
}

export function rejectRequest(requestId) {
  return Promise.resolve(dataService.updateRequestStatus(requestId, 'rejected'));
}

export function assignGuide(requestId, payload) {
  return Promise.resolve({ ok: true });
}

export function verifyPayment(paymentId) {
  return Promise.resolve(dataService.updatePaymentStatus(paymentId, 'confirmed'));
}

export function changePassword(username, oldPassword, newPassword) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username !== admin.username) return reject(new Error('User not found'));
      if (oldPassword !== admin.password) return reject(new Error('Old password incorrect'));
      admin.password = newPassword;
      resolve({ ok: true });
    }, 300);
  });
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
  deleteSite,
  approveRequest,
  rejectRequest,
  assignGuide,
  verifyPayment,
  changePassword,
};
