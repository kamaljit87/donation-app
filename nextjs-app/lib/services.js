import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getUser: async () => {
    const response = await api.get('/auth/user');
    return response.data;
  },
};

export const donationService = {
  createDonation: async (data) => {
    const response = await api.post('/donations', data);
    return response.data;
  },

  getAllDonations: async (params) => {
    const response = await api.get('/admin/donations', { params });
    return response.data;
  },

  getDonation: async (id) => {
    const response = await api.get(`/admin/donations/${id}`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/admin/statistics');
    return response.data;
  },
};

export const paymentService = {
  createOrder: async (donationId, amount) => {
    const response = await api.post('/payment/create-order', {
      donation_id: donationId,
      amount,
    });
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post('/payment/verify', paymentData);
    return response.data;
  },

  paymentFailed: async (data) => {
    const response = await api.post('/payment/failed', data);
    return response.data;
  },
};
