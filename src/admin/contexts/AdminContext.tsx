import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { tonService } from '../../services/tonService';
import { telegramService } from '../../services/telegramService';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalMined: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
  totalRevenue: number;
  dailyActiveUsers: number;
  conversionRate: number;
}

interface AdminUser {
  id: string;
  telegramId: string;
  username: string;
  firstName: string;
  lastName: string;
  points: number;
  coins: number;
  level: number;
  totalMined: number;
  referralCount: number;
  isWalletConnected: boolean;
  tonBalance: number;
  joinedAt: number;
  lastActive: number;
  status: 'active' | 'banned' | 'suspended';
}

interface WithdrawalRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  type: 'ton' | 'coins';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  walletAddress: string;
  createdAt: number;
  processedAt?: number;
  reason?: string;
}

interface AdminContextType {
  stats: AdminStats;
  users: AdminUser[];
  withdrawals: WithdrawalRequest[];
  loading: boolean;
  refreshStats: () => Promise<void>;
  refreshUsers: () => Promise<void>;
  refreshWithdrawals: () => Promise<void>;
  processWithdrawal: (withdrawalId: string, action: 'approve' | 'reject', reason?: string) => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'banned' | 'suspended') => Promise<void>;
  sendBroadcast: (message: string, targetUsers?: string[]) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalMined: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0,
    totalRevenue: 0,
    dailyActiveUsers: 0,
    conversionRate: 0
  });
  
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshStats = async () => {
    try {
      const statsData = await apiService.getAdminStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    }
  };

  const refreshUsers = async () => {
    try {
      const usersData = await apiService.getAllUsers();
      setUsers(usersData.users);
    } catch (error) {
      console.error('Failed to refresh users:', error);
    }
  };

  const refreshWithdrawals = async () => {
    try {
      const withdrawalsData = await apiService.getAllWithdrawals();
      setWithdrawals(withdrawalsData);
    } catch (error) {
      console.error('Failed to refresh withdrawals:', error);
    }
  };

  const processWithdrawal = async (withdrawalId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      const withdrawal = withdrawals.find(w => w.id === withdrawalId);
      if (!withdrawal) return;

      if (action === 'approve') {
        // Process the actual withdrawal on blockchain
        await tonService.processWithdrawal(
          withdrawal.walletAddress,
          withdrawal.amount,
          withdrawal.type === 'ton' ? 'ton' : 'token'
        );

        // Send success notification
        await telegramService.notifyWithdrawalComplete(
          withdrawal.userId,
          withdrawal.amount,
          withdrawal.type
        );
      }

      // Update withdrawal status
      await apiService.processWithdrawal(withdrawalId, action, reason);
      
      // Refresh data
      await refreshWithdrawals();
      await refreshStats();
    } catch (error) {
      console.error('Failed to process withdrawal:', error);
      throw error;
    }
  };

  const updateUserStatus = async (userId: string, status: 'active' | 'banned' | 'suspended') => {
    try {
      await apiService.updateUser(userId, { status });
      await refreshUsers();
    } catch (error) {
      console.error('Failed to update user status:', error);
      throw error;
    }
  };

  const sendBroadcast = async (message: string, targetUsers?: string[]) => {
    try {
      const usersToNotify = targetUsers || users.map(u => u.telegramId);
      
      for (const userId of usersToNotify) {
        await telegramService.sendNotification(userId, message);
      }
    } catch (error) {
      console.error('Failed to send broadcast:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeAdmin = async () => {
      setLoading(true);
      try {
        await Promise.all([
          refreshStats(),
          refreshUsers(),
          refreshWithdrawals()
        ]);
      } catch (error) {
        console.error('Failed to initialize admin:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAdmin();
  }, []);

  return (
    <AdminContext.Provider value={{
      stats,
      users,
      withdrawals,
      loading,
      refreshStats,
      refreshUsers,
      refreshWithdrawals,
      processWithdrawal,
      updateUserStatus,
      sendBroadcast
    }}>
      {children}
    </AdminContext.Provider>
  );
};