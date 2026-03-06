const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('aura_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const apiService = {
  async login(credentials: any) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('aura_token', data.token);
      localStorage.setItem('aura_user', JSON.stringify(data.user));
    }
    return data;
  },

  async logout() {
    localStorage.removeItem('aura_token');
    localStorage.removeItem('aura_user');
  },

  async getHealth() {
    console.log('API: fetching health...');
    const res = await fetch(`${API_URL}/health`);
    return res.json();
  },

  async getEvents() {
    console.log('API: fetching events...');
    const res = await fetch(`${API_URL}/events`);
    return res.json();
  },

  async trackEvent(event: any) {
    console.log('API: tracking event...', event.type);
    const res = await fetch(`${API_URL}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    return res.json();
  },

  async getRecommendations() {
    console.log('API: fetching recommendations...');
    const res = await fetch(`${API_URL}/recommendations`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getPricingTrends() {
    console.log('API: fetching pricing trends...');
    const res = await fetch(`${API_URL}/pricing/trends`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getProducts() {
    console.log('API: fetching products...');
    const res = await fetch(`${API_URL}/products`);
    return res.json();
  },

  async getNotifications() {
    console.log('API: fetching notifications...');
    const res = await fetch(`${API_URL}/notifications`);
    return res.json();
  },

  async markNotificationAsRead(id: string) {
    console.log('API: marking notification as read...', id);
    const res = await fetch(`${API_URL}/notifications/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return res.json();
  },

  async downloadBehaviorReport() {
    console.log('API: downloading behavior report...');
    const token = localStorage.getItem('aura_token');
    // For browser downloads with tokens, we usually append as a query param or use a specialized downloader
    // For simplicity in this demo, we'll use a direct link (professional production would use a signed URL)
    window.location.href = `${API_URL}/reports/behavior/export?token=${token}`;
  }
};
