// Mock implementation kept separate so adminService can toggle between mock and real API
const DEFAULT_ADMIN_PASSWORD = 'admin123';
const admin = {
  username: 'admin',
  password: DEFAULT_ADMIN_PASSWORD,
};

const mockData = {
  users: new Array(42).fill(0).map((_, i) => ({
    user_id: i + 1,
    first_name: `User${i + 1}`,
    last_name: 'Test',
    email: `user${i + 1}@example.com`,
    user_type: i % 5 === 0 ? 'guide' : 'visitor',
    is_active: true,
  })),
  sites: new Array(12).fill(0).map((_, i) => ({
    site_id: i + 1,
    site_name: `Historical Site ${i + 1}`,
    is_approved: i % 3 === 0,
  })),
  visits: new Array(128).fill(0).map((_, i) => ({ visit_id: i + 1 })),
  payments: new Array(37).fill(0).map((_, i) => ({
    payment_id: i + 1,
    total_amount: (Math.random() * 200).toFixed(2),
    payment_status: i % 4 === 0 ? 'pending' : 'confirmed',
  })),
  requests: new Array(8).fill(0).map((_, i) => ({
    request_id: i + 1,
    visitor_name: `Visitor ${i + 1}`,
    site_name: `Historical Site ${i % 5 + 1}`,
    preferred_date: '2025-12-12',
    number_of_visitors: (i % 5) + 1,
    request_status: i % 3 === 0 ? 'pending' : 'approved',
  })),
};

export function authenticate(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === admin.username && password === admin.password) {
        // simple success response (do not force change here)
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
  return new Promise((res) => setTimeout(() => res({
    totalUsers: mockData.users.length,
    totalSites: mockData.sites.length,
    totalVisits: mockData.visits.length,
    totalPayments: mockData.payments.length,
    pendingRequests: mockData.requests.filter(r => r.request_status === 'pending').length,
    pendingPayments: mockData.payments.filter(p => p.payment_status === 'pending').length,
  }), 250));
}

export function getUsers() { return Promise.resolve(mockData.users); }
export function getSites() { return Promise.resolve(mockData.sites); }
export function getRequests() { return Promise.resolve(mockData.requests); }
export function getPayments() { return Promise.resolve(mockData.payments); }

export function createSite(site) {
  const id = mockData.sites.length ? mockData.sites[mockData.sites.length - 1].site_id + 1 : 1;
  const entry = { site_id: id, site_name: site.site_name || `Site ${id}`, is_approved: !!site.is_approved };
  mockData.sites.push(entry);
  return Promise.resolve(entry);
}

export function createUser(user) {
  const id = mockData.users.length ? mockData.users[mockData.users.length - 1].user_id + 1 : 1;
  const entry = {
    user_id: id,
    first_name: user.first_name || 'New',
    last_name: user.last_name || 'User',
    email: user.email || `user${id}@example.com`,
    user_type: user.user_type || 'visitor',
    is_active: true,
  };
  mockData.users.push(entry);
  return Promise.resolve(entry);
}

export function deleteSite(siteId) {
  const idx = mockData.sites.findIndex(s => s.site_id === siteId);
  if (idx >= 0) mockData.sites.splice(idx, 1);
  return Promise.resolve({ ok: true });
}

export function approveRequest(requestId) {
  const r = mockData.requests.find(x => x.request_id === requestId);
  if (r) r.request_status = 'approved';
  return Promise.resolve(r || null);
}

export function rejectRequest(requestId) {
  const r = mockData.requests.find(x => x.request_id === requestId);
  if (r) r.request_status = 'rejected';
  return Promise.resolve(r || null);
}

export function assignGuide(requestId, payload) {
  const r = mockData.requests.find(x => x.request_id === requestId);
  if (r) r.assigned_guide_id = payload.guide_id || null;
  return Promise.resolve(r || null);
}

export function verifyPayment(paymentId) {
  const p = mockData.payments.find(x => x.payment_id === paymentId);
  if (p) p.payment_status = 'confirmed';
  return Promise.resolve(p || null);
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
