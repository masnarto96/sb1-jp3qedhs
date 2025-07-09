import React, { useState, useEffect } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Mining } from './components/Mining';
import { Tasks } from './components/Tasks';
import { Referral } from './components/Referral';
import { Wallet } from './components/Wallet';
import { Upgrade } from './components/Upgrade';
import { Withdrawal } from './components/Withdrawal';
import { UserProvider } from './contexts/UserContext';

function App() {
  const [activeTab, setActiveTab] = useState('mining');

  const renderContent = () => {
    switch (activeTab) {
      case 'mining':
        return <Mining />;
      case 'tasks':
        return <Tasks />;
      case 'referral':
        return <Referral />;
      case 'wallet':
        return <Wallet />;
      case 'upgrade':
        return <Upgrade />;
      case 'withdrawal':
        return <Withdrawal />;
      default:
        return <Mining />;
    }
  };

  return (
    <TonConnectUIProvider manifestUrl={`${window.location.origin}/tonconnect-manifest.json`}>
      <UserProvider>
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
          <div className="max-w-md mx-auto bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen">
            <Header />
            <main className="pb-20">
              {renderContent()}
            </main>
            <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
      </UserProvider>
    </TonConnectUIProvider>
  );
}

export default App;