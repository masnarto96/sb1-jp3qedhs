import React, { useState } from 'react';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminProvider } from './contexts/AdminContext';

export const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-100">
        {!isAuthenticated ? (
          <AdminLogin onLogin={() => setIsAuthenticated(true)} />
        ) : (
          <AdminDashboard />
        )}
      </div>
    </AdminProvider>
  );
};