const STORAGE_KEY = 'tourism_app_data';

const initialData = {
  users: [
    { user_id: 1, username: 'admin', password: 'admin123', first_name: 'Admin', last_name: 'User', email: 'admin@example.com', user_type: 'admin', is_active: true }
  ],
  sites: [
    { site_id: 1, site_name: 'Lalibela', location: 'Lalibela, Amhara', description: 'Rock-hewn churches.', price: 500, guide_fee: 200, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Bet_Giyorgis_Lalibela.jpg/1200px-Bet_Giyorgis_Lalibela.jpg', is_approved: true },
    { site_id: 2, site_name: 'Simien Mountains', location: 'Gondar, Amhara', description: 'Spectacular landscapes.', price: 300, guide_fee: 150, image: 'https://whc.unesco.org/uploads/thumbs/site_0009_0008-750-750-20151104113424.jpg', is_approved: true },
    { site_id: 3, site_name: 'Axum Obelisk', location: 'Axum, Tigray', description: 'Ancient obelisks.', price: 400, guide_fee: 180, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Rome_Stele.jpg/800px-Rome_Stele.jpg', is_approved: true }
  ],
  requests: [],
  payments: [],
  visits: []
};

const loadData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initialData;
};

const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const dataService = {
  getUsers: () => loadData().users,
  addUser: (user) => {
    const data = loadData();
    // Check for duplicates
    const exists = data.users.some(u => u.email === user.email || u.username === user.username);
    if (exists) {
      throw new Error('User with this email or username already exists');
    }

    // Allow specified type, but default to visitor. Prevent creating 'admin' type.
    let type = user.user_type || 'visitor';
    if (type === 'admin') type = 'visitor';

    const newUser = { ...user, user_id: data.users.length + 1, user_type: type, is_active: true };
    data.users.push(newUser);
    saveData(data);
    return newUser;
  },
  findUser: (username, password) => {
    const users = loadData().users;
    return users.find(u => (u.username === username || u.email === username) && u.password === password);
  },
  
  getSites: () => loadData().sites,
  addSite: (site) => {
    const data = loadData();
    const newSite = { ...site, site_id: data.sites.length + 1, is_approved: true };
    data.sites.push(newSite);
    saveData(data);
    return newSite;
  },
  deleteSite: (id) => {
    const data = loadData();
    data.sites = data.sites.filter(s => s.site_id !== id);
    saveData(data);
    return true;
  },

  getRequests: () => loadData().requests,
  addRequest: (request) => {
    const data = loadData();
    const newRequest = { 
      ...request, 
      request_id: data.requests.length + 1, 
      request_status: 'pending',
      created_at: new Date().toISOString()
    };
    data.requests.push(newRequest);
    saveData(data);
    return newRequest;
  },
  updateRequestStatus: (id, status) => {
    const data = loadData();
    const req = data.requests.find(r => r.request_id === id);
    if (req) {
      req.request_status = status;
      saveData(data);
    }
    return req;
  },

  getPayments: () => loadData().payments,
  addPayment: (payment) => {
    const data = loadData();
    const newPayment = {
      ...payment,
      payment_id: data.payments.length + 1,
      payment_status: 'waiting', // waiting for admin confirmation
      created_at: new Date().toISOString()
    };
    data.payments.push(newPayment);
    saveData(data);
    return newPayment;
  },
  updatePaymentStatus: (id, status) => {
    const data = loadData();
    const pay = data.payments.find(p => p.payment_id === id);
    if (pay) {
      pay.payment_status = status;
      saveData(data);
    }
    return pay;
  },

  addFeedback: (requestId, rating, comment) => {
    const data = loadData();
    const req = data.requests.find(r => r.request_id === requestId);
    if (req) {
      req.rating = rating;
      req.feedback = comment;
      saveData(data);
    }
    return req;
  },

  getSummary: () => {
    const data = loadData();
    return {
      totalUsers: data.users.length,
      totalSites: data.sites.length,
      totalVisits: data.visits ? data.visits.length : 0,
      totalPayments: data.payments.length,
      pendingRequests: data.requests.filter(r => r.request_status === 'pending').length,
      pendingPayments: data.payments.filter(p => p.payment_status === 'waiting').length
    };
  }
};
