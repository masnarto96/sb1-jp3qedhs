import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com/api';

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  constructor() {
    // Add auth interceptor
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // User management
  async createUser(userData: any) {
    try {
      const response = await this.api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('API Error - Create User:', error);
      // Return mock data for demo
      return {
        id: userData.telegramId,
        ...userData,
        points: 0,
        coins: 0,
        level: 1,
        energy: 100,
        maxEnergy: 100,
        miningRate: 1,
        referralCount: 0,
        tonBalance: 0,
        walletAddress: '',
        isWalletConnected: false,
        completedTasks: [],
        totalMined: 0,
        lastActive: Date.now()
      };
    }
  }

  async getUser(userId: string) {
    try {
      const response = await this.api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('API Error - Get User:', error);
      throw error;
    }
  }

  async updateUser(userId: string, updates: any) {
    try {
      const response = await this.api.put(`/users/${userId}`, updates);
      return response.data;
    } catch (error) {
      console.error('API Error - Update User:', error);
      // Return success for demo
      return { success: true };
    }
  }

  // Mining operations
  async recordMining(userId: string, points: number) {
    const response = await this.api.post('/mining/record', {
      userId,
      points,
      timestamp: Date.now()
    });
    return response.data;
  }

  // Task management
  async completeTask(userId: string, taskId: string) {
    const response = await this.api.post('/tasks/complete', {
      userId,
      taskId,
      completedAt: Date.now()
    });
    return response.data;
  }

  // Referral system
  async processReferral(referrerId: string, newUserId: string) {
    const response = await this.api.post('/referrals', {
      referrerId,
      newUserId,
      timestamp: Date.now()
    });
    return response.data;
  }

  // Withdrawal requests
  async createWithdrawal(userId: string, amount: number, type: string, address: string) {
    const response = await this.api.post('/withdrawals', {
      userId,
      amount,
      type,
      address,
      status: 'pending',
      createdAt: Date.now()
    });
    return response.data;
  }

  async getWithdrawals(userId?: string) {
    const url = userId ? `/withdrawals?userId=${userId}` : '/withdrawals';
    const response = await this.api.get(url);
    return response.data;
  }

  async updateWithdrawal(withdrawalId: string, updates: any) {
    const response = await this.api.put(`/withdrawals/${withdrawalId}`, updates);
    return response.data;
  }

  // Admin endpoints
  async getAdminStats() {
    const response = await this.api.get('/admin/stats');
    return response.data;
  }

  async getAllUsers(page = 1, limit = 50) {
    const response = await this.api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getAllWithdrawals(status?: string) {
    const url = status ? `/admin/withdrawals?status=${status}` : '/admin/withdrawals';
    const response = await this.api.get(url);
    return response.data;
  }

  async processWithdrawal(withdrawalId: string, action: 'approve' | 'reject', reason?: string) {
    const response = await this.api.post(`/admin/withdrawals/${withdrawalId}/${action}`, {
      reason,
      processedAt: Date.now()
    });
    return response.data;
  }
}

export const apiService = new ApiService();