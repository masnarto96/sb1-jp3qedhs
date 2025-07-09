import React, { useState } from 'react';
import { ArrowUp, Zap, TrendingUp, Coins, Lock } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface UpgradeOption {
  id: string;
  name: string;
  description: string;
  level: number;
  cost: number;
  benefits: string[];
  icon: React.ReactNode;
}

export const Upgrade: React.FC = () => {
  const { user, updateUser } = useUser();
  const [selectedUpgrade, setSelectedUpgrade] = useState<string | null>(null);

  const upgrades: UpgradeOption[] = [
    {
      id: 'mining-rate',
      name: 'Mining Rate',
      description: 'Increase points per tap',
      level: user.level + 1,
      cost: 0.1 * user.level,
      benefits: [
        `+${user.level} points per tap`,
        'Faster mining progression',
        'Higher daily earnings'
      ],
      icon: <TrendingUp className="w-8 h-8 text-green-600" />
    },
    {
      id: 'energy-capacity',
      name: 'Energy Capacity',
      description: 'Increase maximum energy',
      level: user.level + 1,
      cost: 0.05 * user.level,
      benefits: [
        `+50 maximum energy`,
        'Mine for longer periods',
        'Less waiting time'
      ],
      icon: <Zap className="w-8 h-8 text-yellow-600" />
    },
    {
      id: 'auto-miner',
      name: 'Auto Miner',
      description: 'Automatic mining when offline',
      level: user.level >= 5 ? user.level + 1 : 5,
      cost: 0.5,
      benefits: [
        'Mine while offline',
        'Passive income generation',
        'No manual tapping required'
      ],
      icon: <Coins className="w-8 h-8 text-blue-600" />
    }
  ];

  const handleUpgrade = (upgrade: UpgradeOption) => {
    if (!user.isWalletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (user.tonBalance < upgrade.cost) {
      alert('Insufficient TON balance');
      return;
    }

    // Simulate upgrade purchase
    updateUser({
      level: Math.max(user.level + 1, upgrade.level),
      tonBalance: user.tonBalance - upgrade.cost,
      miningRate: upgrade.id === 'mining-rate' ? user.miningRate + 1 : user.miningRate,
      maxEnergy: upgrade.id === 'energy-capacity' ? user.maxEnergy + 50 : user.maxEnergy,
      energy: upgrade.id === 'energy-capacity' ? user.energy + 50 : user.energy
    });

    setSelectedUpgrade(null);
  };

  const canAfford = (cost: number) => user.isWalletConnected && user.tonBalance >= cost;
  const isUnlocked = (upgrade: UpgradeOption) => user.level >= (upgrade.id === 'auto-miner' ? 5 : 1);

  return (
    <div className="p-4 space-y-6">
      {/* Current Stats */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <ArrowUp className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-800">Upgrades</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{user.level}</div>
            <div className="text-sm text-gray-600">Level</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">{user.miningRate}</div>
            <div className="text-sm text-gray-600">Mining Rate</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{user.maxEnergy}</div>
            <div className="text-sm text-gray-600">Max Energy</div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">TON Balance</span>
            <span className="font-bold">{user.tonBalance.toFixed(4)} TON</span>
          </div>
        </div>
      </div>

      {/* Upgrade Options */}
      <div className="space-y-4">
        {upgrades.map((upgrade) => (
          <div key={upgrade.id} className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className="bg-gray-100 rounded-lg p-3">
                  {upgrade.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-bold text-gray-800">{upgrade.name}</h3>
                    {!isUnlocked(upgrade) && <Lock className="w-4 h-4 text-gray-400" />}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{upgrade.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-blue-600">Level {upgrade.level}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm font-bold text-green-600">{upgrade.cost.toFixed(3)} TON</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedUpgrade(upgrade.id)}
                disabled={!isUnlocked(upgrade)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  !isUnlocked(upgrade)
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : canAfford(upgrade.cost)
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {!isUnlocked(upgrade) ? 'Locked' : 'Upgrade'}
              </button>
            </div>
            
            {selectedUpgrade === upgrade.id && (
              <div className="border-t pt-3 mt-3">
                <h4 className="font-bold text-gray-800 mb-2">Benefits:</h4>
                <ul className="space-y-1 mb-4">
                  {upgrade.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleUpgrade(upgrade)}
                    disabled={!canAfford(upgrade.cost)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Confirm Upgrade
                  </button>
                  <button
                    onClick={() => setSelectedUpgrade(null)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-bold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {!isUnlocked(upgrade) && (
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Lock className="w-4 h-4" />
                  <span>Unlocks at level {upgrade.id === 'auto-miner' ? 5 : 1}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};