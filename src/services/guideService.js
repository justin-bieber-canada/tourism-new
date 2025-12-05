import { dataService } from './dataService';

export const guideService = {
  login: (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = dataService.findUser(username, password);
        if (user) {
          if (user.user_type === 'guide') {
            resolve(user);
          } else {
            reject(new Error('Not a guide account'));
          }
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  },

  getAssignedRequests: (guideId) => {
    const requests = dataService.getRequests();
    // Filter requests assigned to this guide
    // Note: In a real app, we'd filter by assigned_guide_id. 
    // For demo, if no assigned_guide_id exists on requests yet, we might show all 'approved' requests 
    // or mock some assignments. Let's assume we'll add assignment logic or just show approved ones for now as "Available to Pick" 
    // or strictly assigned ones. The doc says "Admin assigns".
    // Let's mock that some requests are assigned to this guide (id 888) if they don't have one, for demo purposes.
    return Promise.resolve(requests.filter(r => r.assigned_guide_id === guideId || (r.request_status === 'approved' && !r.assigned_guide_id)));
  },

  updateRequestStatus: (requestId, status, notes) => {
    const data = JSON.parse(localStorage.getItem('tourism_app_data'));
    const reqIndex = data.requests.findIndex(r => r.request_id === requestId);
    if (reqIndex !== -1) {
      data.requests[reqIndex].request_status = status;
      if (notes) data.requests[reqIndex].guide_notes = notes;
      localStorage.setItem('tourism_app_data', JSON.stringify(data));
      return Promise.resolve(data.requests[reqIndex]);
    }
    return Promise.reject(new Error('Request not found'));
  },

  submitReport: (reportData) => {
    const data = JSON.parse(localStorage.getItem('tourism_app_data'));
    if (!data.reports) {
      data.reports = [];
    }
    
    const newReport = {
      report_id: Date.now(),
      ...reportData
    };
    
    data.reports.push(newReport);
    localStorage.setItem('tourism_app_data', JSON.stringify(data));
    return Promise.resolve(true);
  },

  updateProfile: (user) => {
    return Promise.resolve(dataService.updateUser(user));
  },

  changePassword: (userId, newPassword) => {
    const users = dataService.getUsers();
    const user = users.find(u => u.user_id === userId);
    if (user) {
      user.password = newPassword;
      return Promise.resolve(dataService.updateUser(user));
    }
    return Promise.reject(new Error('User not found'));
  }
};
