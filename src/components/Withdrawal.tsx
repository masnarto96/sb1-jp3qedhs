import React, { useState } from 'react';
import { ArrowDown, Coins, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface WithdrawalRequest {
  id: string;
  amount: number;
  type: 'coins' | 'ton';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  estimatedTime: string;
}

export const Withdrawal: React.FC = () => {
  const { user } = useUser();
  const [withdrawalType, setWithdrawalType] = useState<'coins' | 'ton'>('coins');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const withdrawalRequests: WithdrawalRequest[] = [
    {
      id: '1',
      amount: 1000,
      type: 'coins',
      status: 'completed',
      createdAt: '2024-01-15',
      estimatedTime: '24 hours'
    },
    {
      id: '2',
      amount: 0.1,
      type: 'ton',
      status: 'processing',
      createdAt: '2024-01-14',
      estimatedTime: '2-3 hours'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitWithdrawal = async () => {
    if (!user.isWalletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (withdrawalType === 'coins' && numAmount > user.coins) {
      alert('Insufficient coins');
      return;
    }

    if (withdrawalType === 'ton' && numAmount > user.tonBalance) {
      alert('Insufficient TON balance');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate withdrawal submission
    setTimeout(() => {
      alert('Withdrawal request submitted successfully!');
      setAmount('');
      setIsSubmitting(false);
    }, 2000);
  };

  const minWithdrawal = withdrawalType === 'coins' ? 100 : 0.01;
  const maxWithdrawal = withdrawalType === 'coins' ? user.coins : user.tonBalance;

  return (
    <div className="p-4 space-y-6">
      {/* Withdrawal Form */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <ArrowDown className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-800">Withdrawal</h2>
        </div>

        <div className="space-y-4">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Withdrawal Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setWithdrawalType('coins')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  withdrawalType === 'coins'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Coins className="w-6 h-6 mx-auto mb-1 text-green-600" />
                <div className="font-bold text-sm">Coins</div>
                <div className="text-xs text-gray-600">{user.coins.toLocaleString()} available</div>
              </button>
              <button
                onClick={() => setWithdrawalType('ton')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  withdrawalType === 'ton'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-6 h-6 mx-auto mb-1 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">T</span>
                </div>
                <div className="font-bold text-sm">TON</div>
                <div className="text-xs text-gray-600">{user.tonBalance.toFixed(4)} available</div>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Min: ${minWithdrawal} ${withdrawalType.toUpperCase()}`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={minWithdrawal}
                max={maxWithdrawal}
                step={withdrawalType === 'coins' ? 1 : 0.001}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                {withdrawalType.toUpperCase()}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min: {minWithdrawal} {withdrawalType.toUpperCase()}</span>
              <span>Max: {maxWithdrawal.toLocaleString()} {withdrawalType.toUpperCase()}</span>
            </div>
          </div>

          {/* Withdrawal Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Processing Time:</span>
                <span className="font-bold">{withdrawalType === 'coins' ? '24 hours' : '2-3 hours'}</span>
              </div>
              <div className="flex justify-between">
                <span>Fee:</span>
                <span className="font-bold">{withdrawalType === 'coins' ? 'Free' : '0.001 TON'}</span>
              </div>
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="font-bold">TON Blockchain</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitWithdrawal}
            disabled={!user.isWalletConnected || !amount || isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Withdrawal'}
          </button>

          {!user.isWalletConnected && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Please connect your wallet to withdraw</span>
            </div>
          )}
        </div>
      </div>

      {/* Withdrawal History */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Withdrawal History</h3>
        
        {withdrawalRequests.length === 0 ? (
          <div className="text-center py-6">
            <ArrowDown className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No withdrawal requests yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawalRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(request.status)}
                    <span className="font-bold text-gray-800">
                      {request.amount} {request.type.toUpperCase()}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Requested:</span>
                    <span>{request.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated time:</span>
                    <span>{request.estimatedTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdrawal Limits */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Withdrawal Limits</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-center">
              <Coins className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="font-bold text-gray-800">Coins</div>
              <div className="text-sm text-gray-600">Min: 100 coins</div>
              <div className="text-sm text-gray-600">Max: 10,000 coins/day</div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-center">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-xs">T</span>
              </div>
              <div className="font-bold text-gray-800">TON</div>
              <div className="text-sm text-gray-600">Min: 0.01 TON</div>
              <div className="text-sm text-gray-600">Max: 100 TON/day</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};