import { dataService } from './dataService';

export const visitorService = {
  login: (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = dataService.findUser(username, password);
        if (user) {
          if (user.user_type === 'visitor') {
            resolve(user);
          } else {
            reject(new Error('Not a visitor account'));
          }
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  },

  register: (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = dataService.addUser(userData);
        resolve(user);
      }, 500);
    });
  },

  getSites: () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(dataService.getSites());
      }, 800);
    });
  },

  getSiteById: (id) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const sites = dataService.getSites();
        resolve(sites.find(s => s.site_id === parseInt(id)));
      }, 800);
    });
  },

  createRequest: (requestData) => {
    return Promise.resolve(dataService.addRequest(requestData));
  },

  getMyRequests: (userId) => {
    const requests = dataService.getRequests();
    return Promise.resolve(requests.filter(r => r.visitor_id === userId));
  },

  submitPayment: (paymentData) => {
    return Promise.resolve(dataService.addPayment(paymentData));
  },

  getMyPayments: (userId) => {
    // Payments are linked to requests, which are linked to users
    const requests = dataService.getRequests().filter(r => r.visitor_id === userId);
    const requestIds = requests.map(r => r.request_id);
    const payments = dataService.getPayments().filter(p => requestIds.includes(p.request_id));
    return Promise.resolve(payments);
  },
  
  getHistory: (userId) => {
      // Combine requests and payments to show history
      const requests = dataService.getRequests().filter(r => r.visitor_id === userId);
      return Promise.resolve(requests);
  },

  submitFeedback: (requestId, rating, comment) => {
    return Promise.resolve(dataService.addFeedback(requestId, rating, comment));
  },

  updateProfile: (user) => {
    return Promise.resolve(dataService.updateUser(user));
  },

  changePassword: (userId, newPassword) => {
    // In a real app, we would verify old password first
    const users = dataService.getUsers();
    const user = users.find(u => u.user_id === userId);
    if (user) {
      user.password = newPassword;
      return Promise.resolve(dataService.updateUser(user));
    }
    return Promise.reject(new Error('User not found'));
  }
};
