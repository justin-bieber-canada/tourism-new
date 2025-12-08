import { api } from './api';

export const guideService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      if (response.user.user_type !== 'guide') {
          throw new Error('Not a guide account');
      }
      return response.user;
    } catch (error) {
      throw error;
    }
  },

  getAssignedRequests: async (guideId) => {
    try {
        const response = await api.get('/requests');
        // Backend returns { requests: [...] }
        const requests = Array.isArray(response)
          ? response
          : (response.requests || response.data || []);
        // Filter for requests assigned to this guide OR approved requests that need a guide (if that's the logic)
        // Based on previous code: r.assigned_guide_id === guideId || (r.request_status === 'approved' && !r.assigned_guide_id)
        return requests.filter(r => r.assigned_guide_id === guideId || (r.request_status === 'approved' && !r.assigned_guide_id));
    } catch (error) {
        console.error("Failed to fetch requests", error);
        return [];
    }
  },

  updateRequestStatus: async (requestId, status, notes, guideId) => {
    if (status === 'accepted_by_guide' && guideId) {
        await api.patch(`/requests/${requestId}/assign-guide`, { assigned_guide_id: guideId });
        status = 'approved'; 
    }
    return await api.patch(`/requests/${requestId}/status`, { status, notes });
  }
};
