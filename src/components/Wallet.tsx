import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, Link, Coins, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useUser } from '../contexts/UserContext';
import { tonService } from '../services/tonService';

export const Wallet: React.FC = () => {
  const { user, connectWallet, disconnectWallet, updateUser } = useUser();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
    }
  };

  const refreshBalance = async () => {
    if (!user.isWalletConnected) return;
    
    setIsRefreshing(true);
    try {
      const balance = await tonService.getBalance(user.walletAddress);
      updateUser({ tonBalance: balance });
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <div className="p-4 space-y-6">
      {/* Wallet Connection */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <WalletIcon className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-800">TON Wallet</h2>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${
            user.isWalletConnected 
              ? 'bg-green-100 text-green-600' 
              : 'bg-red-100 text-red-600'
          }`}>
            {user.isWalletConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        {!user.isWalletConnected ? (
          <div className="text-center py-6">
            <WalletIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Connect Your TON Wallet</h3>
            <p className="text-gray-600 mb-4">Connect your TON wallet to make payments, upgrades, and withdrawals</p>
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center space-x-2 mx-auto"
            >
              {isConnecting && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>{isConnecting ? 'Connecting...' : 'Connect TON Wallet'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">TON Balance</span>
                <button
                  onClick={refreshBalance}
                  disabled={isRefreshing}
                  className="p-1 hover:bg-white/20 rounded transition-all"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="text-2xl font-bold mb-2">{user.tonBalance.toFixed(4)} TON</div>
              <div className="text-xs opacity-75">
                Address: {formatAddress(user.walletAddress)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => window.open(`https://tonscan.org/address/${user.walletAddress}`, '_blank')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-bold transition-all flex items-center justify-center space-x-2"
              >
                <Link className="w-4 h-4" />
                <span>View on Explorer</span>
              </button>
              <button 
                onClick={handleDisconnectWallet}
                className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold transition-all"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Wallet Stats */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Wallet Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <Coins className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{user.coins.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Coins</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{user.totalMined.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Points Mined</div>
          </div>
        </div>
      </div>

      {/* Wallet Features */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">What You Can Do</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-green-100 rounded-full p-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="font-bold text-gray-800">Upgrade Mining</div>
              <div className="text-sm text-gray-600">Pay TON to increase mining efficiency</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-blue-100 rounded-full p-2">
              <Coins className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-bold text-gray-800">Withdraw Earnings</div>
              <div className="text-sm text-gray-600">Convert coins to TON and withdraw</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-purple-100 rounded-full p-2">
              <WalletIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="font-bold text-gray-800">Secure Transactions</div>
              <div className="text-sm text-gray-600">All transactions on TON mainnet</div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <div className="font-bold text-yellow-800">Security Notice</div>
            <div className="text-sm text-yellow-700 mt-1">
              This app connects to TON mainnet. Always verify transaction details before confirming. 
              Never share your wallet seed phrase with anyone.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};