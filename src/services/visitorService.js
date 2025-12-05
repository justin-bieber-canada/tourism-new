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
    return Promise.resolve(dataService.getSites());
  },

  getSiteById: (id) => {
    const sites = dataService.getSites();
    return Promise.resolve(sites.find(s => s.site_id === parseInt(id)));
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
  }
};
