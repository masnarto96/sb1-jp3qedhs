import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  Settings,
  MessageSquare,
  BarChart3,
  Shield
} from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { StatsOverview } from './StatsOverview';
import { UserManagement } from './UserManagement';
import { WithdrawalManagement } from './WithdrawalManagement';
import { BroadcastSystem } from './BroadcastSystem';
import { AnalyticsDashboard } from './AnalyticsDashboard';

export const AdminDashboard: React.FC = () => {
  const { stats, loading } = useAdmin();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'withdrawals', label: 'Withdrawals', icon: DollarSign },
    { id: 'broadcast', label: 'Broadcast', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <StatsOverview />;
      case 'users':
        return <UserManagement />;
      case 'withdrawals':
        return <WithdrawalManagement />;
      case 'broadcast':
        return <BroadcastSystem />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'settings':
        return <div className="p-6">Settings panel coming soon...</div>;
      default:
        return <StatsOverview />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Tree TON Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Total Users: <span className="font-bold text-green-600">{stats.totalUsers.toLocaleString()}</span>
              </div>
              <div className="text-sm text-gray-600">
                Pending: <span className="font-bold text-orange-600">{stats.pendingWithdrawals}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-2">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                      activeTab === id
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};