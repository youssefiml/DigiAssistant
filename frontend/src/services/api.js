import axios from 'axios';

// Use environment variable or fallback to proxy for development
// In development, use '/api' to leverage Vite proxy
// In production, use the full Railway URL with https://
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : 'https://web-production-34558.up.railway.app');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ==================== COMPANY ====================
export const companyAPI = {
  create: async (data) => {
    console.log('Creating company profile...', data);
    try {
      const response = await api.post('/company', data);
      console.log('Company created:', response.data);
      return response.data;
    } catch (err) {
      console.error('companyAPI.create error:', err.message, err.response?.data);
      throw err;
    }
  },

  getMyCompany: async () => {
    try {
      const response = await api.get('/company/my-company');
      console.log('Company fetched:', response.data);
      return response.data;
    } catch (error) {
      console.log('No existing company found');
      throw error;
    }
  },
};

// ==================== SESSIONS ====================
export const sessionAPI = {
  createWithTempCompany: async (companyData) => {
    console.log('Creating session with temp company:', companyData);
    const response = await api.post('/sessions/temp', companyData);
    console.log('Session created:', response.data);
    return response.data;
  },

  create: async (companyId) => {
    console.log('Creating session for company:', companyId);
    const response = await api.post('/sessions', {
      company_id: companyId
    });
    console.log('Session created:', response.data);
    return response.data;
  },

  getNextQuestion: async (sessionId) => {
    console.log('Getting next question for session:', sessionId);
    const response = await api.post(`/sessions/${sessionId}/next`);
    console.log('Next question:', response.data);
    return response.data;
  },

  submitAnswer: async (sessionId, answer) => {
    console.log('Submitting answer for session:', sessionId);
    const response = await api.post(`/sessions/${sessionId}/answers`, {
      user_text: answer
    });
    console.log('Answer response:', response.data);
    return response.data;
  },

  getResults: async (sessionId) => {
    console.log('Getting results for session:', sessionId);
    const response = await api.get(`/sessions/${sessionId}/results`);
    console.log('Results:', response.data);
    return response.data;
  },

  downloadPDF: async (sessionId) => {
    console.log('Downloading PDF for session:', sessionId);
    const response = await api.get(`/sessions/${sessionId}/download-pdf`, {
      responseType: 'blob'
    });
    console.log('PDF downloaded');
    return response.data;
  },
};

export default api;