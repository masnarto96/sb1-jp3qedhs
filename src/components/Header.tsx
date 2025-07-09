import React from 'react';
import { TreePine, Coins, Zap } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export const Header: React.FC = () => {
  const { user } = useUser();

  return (
    <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <TreePine className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Tree TON</h1>
        </div>
        <div className="text-right">
          <div className="text-sm opacity-90">@{user.username}</div>
          <div className="text-xs opacity-75">Level {user.level}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/20 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <TreePine className="w-4 h-4" />
            <span className="text-xs font-medium">Points</span>
          </div>
          <div className="text-lg font-bold">{user.points.toLocaleString()}</div>
        </div>
        
        <div className="bg-white/20 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Coins className="w-4 h-4" />
            <span className="text-xs font-medium">Coins</span>
          </div>
          <div className="text-lg font-bold">{user.coins.toLocaleString()}</div>
        </div>
        
        <div className="bg-white/20 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-medium">Energy</span>
          </div>
          <div className="text-lg font-bold">{user.energy}/{user.maxEnergy}</div>
        </div>
      </div>
    </header>
  );
};