import axios from 'axios';
import { offlineService, syncService } from './offlineService';

// API base configuration / تكوين API الأساسي
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token / مقاطع الطلب لإضافة رمز المصادقة
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh / مقاطع الاستجابة لتحديث الرمز
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          
          localStorage.setItem('access_token', response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// API service functions / وظائف خدمة API
export const apiService = {
  // Authentication / المصادقة
  async login(credentials) {
    try {
      const response = await api.post('/auth/login/', credentials);
      const { access, refresh, user } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register/', userData);
      // Don't store tokens on registration - user needs approval
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  // Dashboard / لوحة التحكم
  async getDashboardStats() {
    try {
      const response = await api.get('/dashboard/stats/');
      return response.data;
    } catch (error) {
      if (!syncService.isOnline()) {
        // Return cached stats or default values
        return {
          total_funding: 0,
          active_projects: 0,
          verified_reports: 0,
        };
      }
      throw error.response?.data || error.message;
    }
  },

  // Projects / المشاريع
  async getProjects(filters = {}) {
    try {
      const response = await api.get('/projects/', { params: filters });
      
      // Cache projects for offline use
      await offlineService.cacheProjects(response.data.results || response.data);
      
      return response.data;
    } catch (error) {
      if (!syncService.isOnline()) {
        // Return cached projects
        const cachedProjects = await offlineService.getCachedProjects();
        return { results: cachedProjects };
      }
      throw error.response?.data || error.message;
    }
  },

  async getPublicProjects() {
    try {
      const response = await api.get('/public/projects/');
      await offlineService.cacheProjects(response.data);
      return response.data;
    } catch (error) {
      if (!syncService.isOnline()) {
        return await offlineService.getCachedProjects();
      }
      throw error.response?.data || error.message;
    }
  },

  async createProject(projectData) {
    try {
      const response = await api.post('/projects/', projectData);
      return response.data;
    } catch (error) {
      if (!syncService.isOnline()) {
        // Store for later sync
        await offlineService.storeOfflineAction('CREATE_PROJECT', projectData);
        return { ...projectData, id: Date.now(), status: 'pending_sync' };
      }
      throw error.response?.data || error.message;
    }
  },

  async updateProject(projectId, projectData) {
    try {
      const response = await api.put(`/projects/${projectId}/`, projectData);
      return response.data;
    } catch (error) {
      if (!syncService.isOnline()) {
        await offlineService.storeOfflineAction('UPDATE_PROJECT', { id: projectId, ...projectData });
        return { ...projectData, id: projectId, status: 'pending_sync' };
      }
      throw error.response?.data || error.message;
    }
  },

  // Funding / التمويل
  async fundProject(fundingData) {
    try {
      const response = await api.post('/funding/', fundingData);
      return response.data;
    } catch (error) {
      if (!syncService.isOnline()) {
        await offlineService.storeOfflineAction('FUND_PROJECT', fundingData);
        return { ...fundingData, id: Date.now(), status: 'pending_sync' };
      }
      console.error('Funding API error:', error.response?.data);
      throw error.response?.data || { error: error.message };
    }
  },

  async getFundingHistory() {
    try {
      const response = await api.get('/funding/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reports / التقارير
  async getReports(filters = {}) {
    try {
      const response = await api.get('/reports/', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async submitReport(reportData) {
    try {
      const response = await api.post('/reports/', reportData);
      return response.data;
    } catch (error) {
      if (!syncService.isOnline()) {
        await offlineService.storeOfflineAction('SUBMIT_REPORT', reportData);
        return { ...reportData, id: Date.now(), status: 'pending_sync' };
      }
      throw error.response?.data || error.message;
    }
  },

  // Aid Distribution / توزيع المساعدات
  async getDistributions() {
    try {
      const response = await api.get('/distributions/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async recordDistribution(distributionData) {
    try {
      const response = await api.post('/distributions/', distributionData);
      return response.data;
    } catch (error) {
      if (!syncService.isOnline()) {
        await offlineService.storeOfflineAction('RECORD_DISTRIBUTION', distributionData);
        return { ...distributionData, id: Date.now(), status: 'pending_sync' };
      }
      throw error.response?.data || error.message;
    }
  },

  // Organisations / المنظمات
  async getOrganisations() {
    try {
      const response = await api.get('/organisations/');
      await offlineService.cacheOrganisations(response.data.results || response.data);
      return response.data;
    } catch (error) {
      if (!syncService.isOnline()) {
        return await offlineService.getCachedOrganisations();
      }
      throw error.response?.data || error.message;
    }
  },

  // Verification / التوثيق
  async getVerifications() {
    try {
      const response = await api.get('/verifications/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Public Stats / الإحصائيات العامة
  async getPublicStats() {
    try {
      const response = await api.get('/public/stats/');
      return response.data;
    } catch (error) {
      if (!syncService.isOnline()) {
        return {
          total_projects: 0,
          total_funding: 0,
          active_projects: 0,
          completed_projects: 0,
        };
      }
      throw error.response?.data || error.message;
    }
  },

  // Field Officers / موظفي الميدان
  async createFieldOfficer(userData) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('Creating field officer with org ID:', user.organisation);
      const response = await api.post('/auth/register/', {
        ...userData,
        organisation: parseInt(user.organisation),
        password_confirm: userData.password
      });
      return response.data;
    } catch (error) {
      console.error('Field officer creation error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Users / المستخدمون
  async getUsers() {
    try {
      const response = await api.get('/users/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verified Reports / التقارير الموثقة
  async getVerifiedReports() {
    try {
      const response = await api.get('/reports/', { params: { is_verified: true } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // All Reports (Admin) / جميع التقارير
  async getAllReports() {
    try {
      const response = await api.get('/reports/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Blockchain Verifications / توثيقات البلوك تشين
  async getBlockchainVerifications() {
    try {
      const response = await api.get('/verifications/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Audit Logs / سجلات التدقيق
  async getAuditLogs() {
    try {
      const response = await api.get('/audit/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Project Approval / الموافقة على المشروع
  async approveProject(projectId) {
    try {
      const response = await api.patch(`/projects/${projectId}/`, { status: 'approved' });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async rejectProject(projectId) {
    try {
      const response = await api.patch(`/projects/${projectId}/`, { status: 'rejected' });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default apiService;