import React, { useState } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminProvider } from './contexts/AdminContext';

export const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <TonConnectUIProvider manifestUrl={`${window.location.origin}/tonconnect-manifest.json`}>
      <AdminProvider>
        <div className="min-h-screen bg-gray-100">
          {!isAuthenticated ? (
            <AdminLogin onLogin={() => setIsAuthenticated(true)} />
          ) : (
            <AdminDashboard />
          )}
        </div>
      </AdminProvider>
    </TonConnectUIProvider>
  );
};