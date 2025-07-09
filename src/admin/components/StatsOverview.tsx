import React from 'react';
import { Users, TrendingUp, DollarSign, AlertCircle, Coins, Activity } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export const StatsOverview: React.FC = () => {
  const { stats } = useAdmin();

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: Activity,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Total Mined',
      value: `${(stats.totalMined / 1000000).toFixed(1)}M`,
      icon: Coins,
      color: 'bg-yellow-500',
      change: '+15%'
    },
    {
      title: 'Total Withdrawals',
      value: `${stats.totalWithdrawals.toFixed(2)} TON`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+5%'
    },
    {
      title: 'Pending Withdrawals',
      value: stats.pendingWithdrawals.toString(),
      icon: AlertCircle,
      color: 'bg-orange-500',
      change: '-2%'
    },
    {
      title: 'Daily Active Users',
      value: stats.dailyActiveUsers.toLocaleString(),
      icon: TrendingUp,
      color: 'bg-indigo-500',
      change: '+10%'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Real-time statistics and system health</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm mt-2 ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">API Status</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">TON Network</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Telegram Bot</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">New user registered</span>
              <span className="text-xs text-gray-400">2 min ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Withdrawal processed</span>
              <span className="text-xs text-gray-400">5 min ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Mining milestone reached</span>
              <span className="text-xs text-gray-400">10 min ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Task completed</span>
              <span className="text-xs text-gray-400">15 min ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};