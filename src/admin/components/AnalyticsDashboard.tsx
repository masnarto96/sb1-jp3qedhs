import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const AnalyticsDashboard: React.FC = () => {
  // Mock data - replace with real analytics data
  const userGrowthData = [
    { date: '2024-01-01', users: 100 },
    { date: '2024-01-02', users: 150 },
    { date: '2024-01-03', users: 200 },
    { date: '2024-01-04', users: 280 },
    { date: '2024-01-05', users: 350 },
    { date: '2024-01-06', users: 420 },
    { date: '2024-01-07', users: 500 }
  ];

  const miningData = [
    { date: '2024-01-01', points: 10000 },
    { date: '2024-01-02', points: 15000 },
    { date: '2024-01-03', points: 22000 },
    { date: '2024-01-04', points: 28000 },
    { date: '2024-01-05', points: 35000 },
    { date: '2024-01-06', points: 42000 },
    { date: '2024-01-07', points: 50000 }
  ];

  const withdrawalData = [
    { type: 'TON', amount: 150 },
    { type: 'Coins', amount: 300 },
    { type: 'Pending', amount: 50 }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">Detailed insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-green-600">+24%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Retention Rate</p>
              <p className="text-2xl font-bold text-blue-600">78%</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Session</p>
              <p className="text-2xl font-bold text-purple-600">12m</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-orange-600">$2.4K</p>
            </div>
            <DollarSign className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Mining Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={miningData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="points" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">@topMiner1</span>
              <span className="font-bold text-green-600">50,000 points</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">@cryptoFan</span>
              <span className="font-bold text-green-600">45,000 points</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">@treeHugger</span>
              <span className="font-bold text-green-600">42,000 points</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Referral Leaders</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">@referralKing</span>
              <span className="font-bold text-blue-600">25 referrals</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">@networkPro</span>
              <span className="font-bold text-blue-600">20 referrals</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">@socialMiner</span>
              <span className="font-bold text-blue-600">18 referrals</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Withdrawal Stats</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={withdrawalData}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};