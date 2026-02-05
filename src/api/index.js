import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://hrms-lite-api-556b.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message 
      || error.response?.data?.detail 
      || error.message 
      || 'Something went wrong';
    
    // Show error toast unless explicitly disabled
    if (!error.config?.skipToast) {
      toast.error(message, {
        duration: 4000,
        style: {
          background: '#fef2f2',
          color: '#991b1b',
          border: '1px solid #fecaca',
        },
      });
    }
    
    return Promise.reject(error);
  }
);

// ==================== EMPLOYEE APIs ====================
export const employeeAPI = {
  getAll: async (department = null) => {
    const params = department ? { department } : {};
    const response = await api.get('/employees', { params });
    return response.data;
  },

  getById: async (employeeId) => {
    const response = await api.get(`/employees/${employeeId}`);
    return response.data;
  },

  create: async (employeeData) => {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },

  update: async (employeeId, updateData) => {
    const response = await api.put(`/employees/${employeeId}`, updateData);
    return response.data;
  },

  delete: async (employeeId) => {
    const response = await api.delete(`/employees/${employeeId}`);
    return response.data;
  },
};

// ==================== ATTENDANCE APIs ====================
export const attendanceAPI = {
  getAll: async (date = null) => {
    const params = date ? { date } : {};
    const response = await api.get('/attendance', { params });
    return response.data;
  },

  getByEmployee: async (employeeId) => {
    const response = await api.get(`/attendance/employee/${employeeId}`);
    return response.data;
  },

  getSummary: async (employeeId) => {
    const response = await api.get(`/attendance/employee/${employeeId}/summary`);
    return response.data;
  },

  getTodaySummary: async () => {
    const response = await api.get('/attendance/today/summary');
    return response.data;
  },

  mark: async (attendanceData) => {
    const response = await api.post('/attendance', attendanceData);
    return response.data;
  },

  update: async (employeeId, date, status) => {
    const response = await api.put(
      `/attendance/employee/${employeeId}/date/${date}`,
      null,
      { params: { status } }
    );
    return response.data;
  },

  delete: async (employeeId, date) => {
    const response = await api.delete(`/attendance/employee/${employeeId}/date/${date}`);
    return response.data;
  },
};

export default api;