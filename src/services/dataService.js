const STORAGE_KEY = 'tourism_app_data';

const initialData = {
  users: [
    { user_id: 1, username: 'admin', password: 'admin123', first_name: 'Admin', last_name: 'User', email: 'admin@example.com', user_type: 'admin', is_active: true },
    { user_id: 2, username: 'researcher', password: 'researcher123', first_name: 'John', last_name: 'Doe', email: 'researcher@example.com', user_type: 'researcher', is_active: true }
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
  const dataStr = localStorage.getItem(STORAGE_KEY);
  let data = dataStr ? JSON.parse(dataStr) : initialData;

  // Ensure default researcher exists (fix for existing local storage)
  if (data.users && !data.users.some(u => u.username === 'researcher')) {
     const researcher = { 
       user_id: 999, // Use a distinct ID to avoid collision
       username: 'researcher', 
       password: 'researcher123', 
       first_name: 'John', 
       last_name: 'Doe', 
       email: 'researcher@example.com', 
       user_type: 'researcher', 
       is_active: true 
     };
     data.users.push(researcher);
     localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // Ensure default guide exists - REMOVED as per user request
  /*
  if (data.users && !data.users.some(u => u.username === 'guide')) {
     const guide = { 
       user_id: 888, 
       username: 'guide', 
       password: 'guide123', 
       first_name: 'Abebe', 
       last_name: 'Kebede', 
       email: 'guide@example.com', 
       user_type: 'site_agent', 
       is_active: true 
     };
     data.users.push(guide);
     localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  */

  // Migration: Update any researchers with old default password '123456' to 'password123'
  // FORCE RESET: Ensure ALL researchers have 'password123' to fix login issues
  if (data.users) {
    let changed = false;
    data.users.forEach(u => {
      if (u.user_type === 'researcher' && u.password !== 'password123') {
        u.password = 'password123';
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }

  return data;
};

const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const dataService = {
  getUsers: () => loadData().users,
  addUser: (user) => {
    const data = loadData();
    // Check for duplicates
    const exists = data.users.some(u => 
      (user.email && u.email === user.email) || 
      (user.username && u.username === user.username)
    );
    if (exists) {
      throw new Error('User with this email or username already exists');
    }

    // Allow specified type, but default to visitor. Prevent creating 'admin' type.
    let type = user.user_type || 'visitor';
    if (type === 'admin') type = 'visitor';

    // Generate default username/password if missing
    // Username is the email provided by admin (or used from registration)
    const username = user.username || user.email || `user${data.users.length + 1}`;
    // Mock password for added users (if not provided during registration)
    const password = user.password || 'password123';

    const newUser = { 
      ...user, 
      username,
      password,
      user_id: data.users.length + 1, 
      user_type: type, 
      is_active: true 
    };
    data.users.push(newUser);
    saveData(data);
    return newUser;
  },
  findUser: (username, password) => {
    const users = loadData().users;
    // Case-insensitive check for username/email
    return users.find(u => {
      const uName = u.username ? u.username.toLowerCase() : '';
      const uEmail = u.email ? u.email.toLowerCase() : '';
      const input = username ? username.toLowerCase() : '';
      
      return (uName === input || uEmail === input) && u.password === password;
    });
  },
  updateUserStatus: (userId, isActive) => {
    const data = loadData();
    const user = data.users.find(u => u.user_id === userId);
    if (user) {
      user.is_active = isActive;
      saveData(data);
    }
    return user;
  },
  deleteUser: (userId) => {
    const data = loadData();
    const index = data.users.findIndex(u => u.user_id === userId);
    if (index !== -1) {
      data.users.splice(index, 1);
      saveData(data);
      return true;
    }
    return false;
  },
  
  getSites: () => loadData().sites,
  addSite: (site) => {
    const data = loadData();
    // Default is_approved to false if not specified (researchers need approval)
    const isApproved = site.hasOwnProperty('is_approved') ? site.is_approved : false;
    const newSite = { ...site, site_id: data.sites.length + 1, is_approved: isApproved };
    data.sites.push(newSite);
    saveData(data);
    return newSite;
  },
  updateSite: (site) => {
    const data = loadData();
    const index = data.sites.findIndex(s => s.site_id === site.site_id);
    if (index !== -1) {
      data.sites[index] = { ...data.sites[index], ...site };
      saveData(data);
      return data.sites[index];
    }
    throw new Error('Site not found');
  },
  deleteSite: (id) => {
    const data = loadData();
    data.sites = data.sites.filter(s => s.site_id !== id);
    saveData(data);
    return true;
  },
  updateUser: (id, updates) => {
    const data = loadData();
    const user = data.users.find(u => u.user_id === id);
    if (user) {
      Object.assign(user, updates);
      saveData(data);
      return user;
    }
    throw new Error('User not found');
  },
  changePassword: (id, newPassword) => {
    const data = loadData();
    const user = data.users.find(u => u.user_id === id);
    if (user) {
      if (user.password === newPassword) {
        throw new Error('New password cannot be the same as the old password');
      }
      user.password = newPassword;
      saveData(data);
      return true;
    }
    throw new Error('User not found');
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

  updateUser: (updatedUser) => {
    const data = loadData();
    const index = data.users.findIndex(u => u.user_id === updatedUser.user_id);
    if (index !== -1) {
      data.users[index] = { ...data.users[index], ...updatedUser };
      saveData(data);
      return data.users[index];
    }
    return null;
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
