
import axios from 'axios';

const API_BASE_URL = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          }, {
            headers: {
              'ngrok-skip-browser-warning': 'true',
            },
          });
          const { access_token } = response.data;
          localStorage.setItem('token', access_token);
          
          error.config.headers.Authorization = `Bearer ${access_token}`;
          return axios(error.config);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = '/login';
        }
      } else {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const managerLogin = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/manager/login`, {
      email,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });
    
    const { access_token, refresh_token, user } = response.data;
    
    localStorage.setItem('token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
};

export const getDashboardOverview = async () => {
  try {
    const response = await apiClient.get('/manager/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    throw error;
  }
};

export const getDailyReport = async (date) => {
  try {
    const response = await apiClient.get('/manager/reports/daily', {
      params: { date },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching daily report:', error);
    throw error;
  }
};

export const getLiveQueue = async () => {
  try {
    const response = await apiClient.get('/manager/queue/live');
    return response.data;
  } catch (error) {
    console.error('Error fetching live queue:', error);
    throw error;
  }
};

export const getAllDoctors = async () => {
  try {
    const response = await apiClient.get('/manager/doctors');
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

export const createDoctor = async (doctorData) => {
  try {
    const response = await apiClient.post('/manager/doctors', doctorData);
    return response.data;
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
};

export const updateDoctor = async (doctorId, doctorData) => {
  try {
    const response = await apiClient.put(`/manager/doctors/${doctorId}`, doctorData);
    return response.data;
  } catch (error) {
    console.error('Error updating doctor:', error);
    throw error;
  }
};

export const toggleDoctorActivation = async (doctorId, active = true) => {
  try {
    const response = await apiClient.put(`/manager/doctors/${doctorId}/activate`, null, {
      params: { active },
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling doctor activation:', error);
    throw error;
  }
};

export const getAllPatients = async (page = 1, size = 20, search = '') => {
  try {
    const response = await apiClient.get('/manager/patients', {
      params: { page, size, search },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
