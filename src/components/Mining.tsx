import React, { useState, useEffect } from 'react';
import { TreePine, Zap, TrendingUp } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export const Mining: React.FC = () => {
  const { user, addPoints } = useUser();
  const [isAnimating, setIsAnimating] = useState(false);
  const [floatingPoints, setFloatingPoints] = useState<{ id: number; points: number; x: number; y: number }[]>([]);

  const handleMine = (e: React.MouseEvent) => {
    if (user.energy <= 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const points = user.miningRate * user.level;
    addPoints(points);

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);

    // Add floating points animation
    const id = Date.now();
    setFloatingPoints(prev => [...prev, { id, points, x, y }]);
    setTimeout(() => {
      setFloatingPoints(prev => prev.filter(p => p.id !== id));
    }, 1000);
  };

  const energyPercentage = (user.energy / user.maxEnergy) * 100;

  return (
    <div className="p-4 space-y-6">
      {/* Mining Stats */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Tree Mining</h2>
          <div className="flex items-center space-x-1 text-green-600">
            <TrendingUp className="w-5 h-5" />
            <span className="font-bold">+{user.miningRate * user.level}/tap</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Mining Rate</span>
            <span className="font-bold">{user.miningRate * user.level} points/tap</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Mined</span>
            <span className="font-bold">{user.points.toLocaleString()} points</span>
          </div>
        </div>
      </div>

      {/* Energy Bar */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-gray-800">Energy</span>
          </div>
          <span className="text-sm font-bold text-gray-600">{user.energy}/{user.maxEnergy}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${energyPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Energy regenerates over time</p>
      </div>

      {/* Mining Tree */}
      <div className="relative bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-8 shadow-lg">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Tap the Tree to Mine!</h3>
          <p className="text-sm text-gray-600">Each tap consumes 1 energy</p>
        </div>
        
        <div className="relative flex justify-center">
          <button
            onClick={handleMine}
            disabled={user.energy <= 0}
            className={`relative w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-2xl flex items-center justify-center transition-all duration-200 ${
              isAnimating ? 'scale-95' : 'scale-100'
            } ${user.energy <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
          >
            <TreePine className="w-16 h-16 text-white" />
          </button>
          
          {/* Floating Points */}
          {floatingPoints.map(({ id, points, x, y }) => (
            <div
              key={id}
              className="absolute pointer-events-none animate-bounce"
              style={{
                left: x,
                top: y,
                animation: 'float-up 1s ease-out forwards'
              }}
            >
              <span className="text-green-600 font-bold text-lg">+{points}</span>
            </div>
          ))}
        </div>
        
        {user.energy <= 0 && (
          <div className="text-center mt-4">
            <p className="text-red-500 font-bold">No energy! Wait for regeneration.</p>
          </div>
        )}
      </div>

      {/* Points to Coins Conversion */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Convert Points</h3>
          <span className="text-sm text-gray-600">100 points = 1 coin</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Available Points</span>
            <span className="font-bold">{user.points.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Can Convert to</span>
            <span className="font-bold text-green-600">{Math.floor(user.points / 100)} coins</span>
          </div>
          <button 
            onClick={() => {
              const convertiblePoints = Math.floor(user.points / 100) * 100;
              if (convertiblePoints > 0) {
                // convertPointsToCoins(convertiblePoints);
              }
            }}
            disabled={user.points < 100}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-emerald-600 transition-all"
          >
            Convert to Coins
          </button>
        </div>
      </div>
    </div>
  );
};