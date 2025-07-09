import React from 'react';
import { TreePine, CheckSquare, Users, Wallet, ArrowUp, ArrowDown } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'mining', label: 'Mine', icon: TreePine },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'referral', label: 'Referral', icon: Users },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'upgrade', label: 'Upgrade', icon: ArrowUp },
    { id: 'withdrawal', label: 'Withdraw', icon: ArrowDown }
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 shadow-lg">
      <div className="grid grid-cols-6 gap-1 p-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center py-2 px-1 rounded-lg transition-all ${
              activeTab === id
                ? 'bg-green-100 text-green-600'
                : 'text-gray-500 hover:text-green-600'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};