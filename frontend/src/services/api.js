import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
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
  create: async (companyId) => {
    console.log('Creating session for company:', companyId);
    const response = await api.post('/sessions', null, {
      params: { company_id: companyId }
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
};

export default api;