import React, { createContext, useContext, useState, useEffect } from 'react';
import { tonService } from '../services/tonService';
import { apiService } from '../services/apiService';
import { telegramService } from '../services/telegramService';

interface User {
  id: string;
  telegramId: string;
  username: string;
  firstName: string;
  lastName: string;
  points: number;
  coins: number;
  level: number;
  energy: number;
  maxEnergy: number;
  miningRate: number;
  referralCount: number;
  referralCode: string;
  lastMining: number;
  tonBalance: number;
  walletAddress: string;
  isWalletConnected: boolean;
  completedTasks: string[];
  totalMined: number;
  joinedAt: number;
  lastActive: number;
}

interface UserContextType {
  user: User;
  updateUser: (updates: Partial<User>) => void;
  addPoints: (amount: number) => void;
  convertPointsToCoins: (points: number) => void;
  completeTask: (taskId: string, reward: number) => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  processWithdrawal: (amount: number, type: 'ton' | 'coins') => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>({
    id: '',
    telegramId: '',
    username: 'TreeMiner',
    firstName: '',
    lastName: '',
    points: 0,
    coins: 0,
    level: 1,
    energy: 100,
    maxEnergy: 100,
    miningRate: 1,
    referralCount: 0,
    referralCode: '',
    lastMining: Date.now(),
    tonBalance: 0,
    walletAddress: '',
    isWalletConnected: false,
    completedTasks: [],
    totalMined: 0,
    joinedAt: Date.now(),
    lastActive: Date.now()
  });

  // Initialize user from Telegram WebApp
  useEffect(() => {
    const initUser = async () => {
      try {
        // Get Telegram user data
        const tg = (window as any).Telegram?.WebApp;
        if (tg?.initDataUnsafe?.user || true) { // Allow demo mode
          const telegramUser = tg?.initDataUnsafe?.user || {
            id: Math.floor(Math.random() * 1000000),
            username: 'demo_user',
            first_name: 'Demo',
            last_name: 'User'
          };
          
          // Load or create user
          let userData;
          try {
            userData = await apiService.getUser(telegramUser.id.toString());
          } catch (error) {
            // Create new user
            userData = await apiService.createUser({
              telegramId: telegramUser.id.toString(),
              username: telegramUser.username || `user${telegramUser.id}`,
              firstName: telegramUser.first_name || '',
              lastName: telegramUser.last_name || '',
              referralCode: `TREE${telegramUser.id}`,
              joinedAt: Date.now()
            });
          }
          
          setUser(userData);
        } else {
          // Demo user for testing
          const demoUser = {
            id: Math.floor(Math.random() * 1000000),
            username: 'demo_user',
            first_name: 'Demo',
            last_name: 'User'
          };
          
          // Load or create user
          let userData;
          try {
            userData = await apiService.getUser(demoUser.id.toString());
          } catch (error) {
            // Create new user
            userData = await apiService.createUser({
              telegramId: demoUser.id.toString(),
              username: demoUser.username || `user${demoUser.id}`,
              firstName: demoUser.first_name || '',
              lastName: demoUser.last_name || '',
              referralCode: `TREE${demoUser.id}`,
              joinedAt: Date.now()
            });
          }
          
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to initialize user:', error);
        // Set demo user on error
        setUser(prev => ({
          ...prev,
          id: 'demo123',
          telegramId: 'demo123',
          username: 'demo_user',
          firstName: 'Demo',
          lastName: 'User'
        }));
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setUser(prev => {
        if (prev.energy < prev.maxEnergy) {
          const newEnergy = Math.min(prev.maxEnergy, prev.energy + 1);
          // Update backend
          apiService.updateUser(prev.id, { energy: newEnergy });
          return { ...prev, energy: newEnergy };
        }
        return prev;
      });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const updateUser = async (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
    try {
      await apiService.updateUser(user.id, updates);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const addPoints = async (amount: number) => {
    if (user.energy <= 0) return;

    const newPoints = user.points + amount;
    const newEnergy = Math.max(0, user.energy - 1);
    const newTotalMined = user.totalMined + amount;

    setUser(prev => ({ 
      ...prev, 
      points: newPoints,
      energy: newEnergy,
      totalMined: newTotalMined,
      lastMining: Date.now()
    }));

    try {
      await apiService.recordMining(user.id, amount);
      await apiService.updateUser(user.id, {
        points: newPoints,
        energy: newEnergy,
        totalMined: newTotalMined,
        lastMining: Date.now()
      });
    } catch (error) {
      console.error('Failed to record mining:', error);
    }
  };

  const convertPointsToCoins = async (points: number) => {
    if (user.points >= points) {
      const coins = Math.floor(points / 100);
      const newPoints = user.points - points;
      const newCoins = user.coins + coins;

      setUser(prev => ({
        ...prev,
        points: newPoints,
        coins: newCoins
      }));

      try {
        await apiService.updateUser(user.id, {
          points: newPoints,
          coins: newCoins
        });
      } catch (error) {
        console.error('Failed to convert points:', error);
      }
    }
  };

  const completeTask = async (taskId: string, reward: number) => {
    if (!user.completedTasks.includes(taskId)) {
      const newCompletedTasks = [...user.completedTasks, taskId];
      const newCoins = user.coins + reward;

      setUser(prev => ({
        ...prev,
        completedTasks: newCompletedTasks,
        coins: newCoins
      }));

      try {
        await apiService.completeTask(user.id, taskId);
        await apiService.updateUser(user.id, {
          completedTasks: newCompletedTasks,
          coins: newCoins
        });
      } catch (error) {
        console.error('Failed to complete task:', error);
      }
    }
  };

  const connectWallet = async () => {
    try {
      const wallet = await tonService.connectWallet();
      if (wallet && wallet.address) {
        const balance = await tonService.getBalance(wallet.address);
        
        setUser(prev => ({
          ...prev,
          walletAddress: wallet.address,
          tonBalance: balance,
          isWalletConnected: true
        }));

        await apiService.updateUser(user.id, {
          walletAddress: wallet.address,
          tonBalance: balance,
          isWalletConnected: true
        });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      // Don't throw error to prevent UI crashes
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const disconnectWallet = async () => {
    try {
      await tonService.disconnect();
      
      setUser(prev => ({
        ...prev,
        walletAddress: '',
        tonBalance: 0,
        isWalletConnected: false
      }));

      await apiService.updateUser(user.id, {
        walletAddress: '',
        tonBalance: 0,
        isWalletConnected: false
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };


  const processWithdrawal = async (amount: number, type: 'ton' | 'coins') => {
    try {
      const withdrawal = await apiService.createWithdrawal(
        user.id,
        amount,
        type,
        user.walletAddress
      );

      // Send notification
      await telegramService.sendNotification(
        user.telegramId,
        `Withdrawal request submitted!\nAmount: ${amount} ${type.toUpperCase()}\nStatus: Processing`
      );

      return withdrawal;
    } catch (error) {
      console.error('Failed to process withdrawal:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      updateUser, 
      addPoints, 
      convertPointsToCoins, 
      completeTask,
      connectWallet,
      disconnectWallet,
      processWithdrawal,
      loading
    }}>
      {children}
    </UserContext.Provider>
  );
};