import React, { useState } from 'react';
import { Users, Copy, Share2, Gift, UserPlus } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export const Referral: React.FC = () => {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);
  
  const referralLink = `https://t.me/realtreeton?start=${user.id}`;
  const referralCode = `TREE${user.id}`;

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Tree TON',
        text: 'Join me in Tree TON and start mining tokens together!',
        url: referralLink
      });
    } else {
      handleCopy(referralLink);
    }
  };

  const referralRewards = [
    { friends: 1, reward: 100 },
    { friends: 5, reward: 500 },
    { friends: 10, reward: 1000 },
    { friends: 25, reward: 2500 },
    { friends: 50, reward: 5000 }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Referral Stats */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white shadow-lg">
        <div className="flex items-center space-x-2 mb-3">
          <Users className="w-6 h-6" />
          <h2 className="text-xl font-bold">Referral Program</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <UserPlus className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{user.referralCount}</div>
            <div className="text-sm opacity-90">Friends Invited</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <Gift className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{user.referralCount * 100}</div>
            <div className="text-sm opacity-90">Coins Earned</div>
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Your Referral Link</h3>
        
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-3">
                <div className="text-sm font-medium text-gray-700">Referral Code</div>
                <div className="text-lg font-bold text-green-600">{referralCode}</div>
              </div>
              <button
                onClick={() => handleCopy(referralCode)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-all"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-3">
                <div className="text-sm font-medium text-gray-700">Referral Link</div>
                <div className="text-xs text-gray-500 break-all">{referralLink}</div>
              </div>
              <button
                onClick={() => handleCopy(referralLink)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transition-all"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleShare}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-bold mt-4 flex items-center justify-center space-x-2 hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          <Share2 className="w-5 h-5" />
          <span>Share with Friends</span>
        </button>
        
        {copied && (
          <div className="text-center text-green-600 font-bold mt-2">
            Copied to clipboard!
          </div>
        )}
      </div>

      {/* How it Works */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">How it Works</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 rounded-full p-2">
              <span className="text-green-600 font-bold text-sm">1</span>
            </div>
            <div>
              <div className="font-bold text-gray-800">Share your link</div>
              <div className="text-sm text-gray-600">Send your referral link to friends</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 rounded-full p-2">
              <span className="text-green-600 font-bold text-sm">2</span>
            </div>
            <div>
              <div className="font-bold text-gray-800">Friends join</div>
              <div className="text-sm text-gray-600">They use your link to join Tree TON</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 rounded-full p-2">
              <span className="text-green-600 font-bold text-sm">3</span>
            </div>
            <div>
              <div className="font-bold text-gray-800">Earn rewards</div>
              <div className="text-sm text-gray-600">Get 100 coins for each friend who joins</div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Rewards */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Referral Milestones</h3>
        <div className="space-y-3">
          {referralRewards.map((milestone, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${user.referralCount >= milestone.friends ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="font-bold text-gray-800">{milestone.friends} Friends</span>
              </div>
              <div className="flex items-center space-x-2">
                <Gift className="w-4 h-4 text-green-600" />
                <span className="font-bold text-green-600">+{milestone.reward} coins</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};