
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '@/components/Background';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import AdminAuth from '@/components/admin/AdminAuth';
import TransactionTabs from '@/components/admin/TransactionTabs';
import { useTransactions } from '@/hooks/useTransactions';
import { User } from '@/types';

// Admin usernames for demonstration
const ADMIN_USERS = ['admin', 'admin123', 'superadmin'];

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { loadData } = useTransactions();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Check if user is an admin
    if (currentUser && ADMIN_USERS.includes(currentUser.username)) {
      loadData();
      setAuthenticated(true);
    }
    
    setLoading(false);
  }, [loadData]);

  const handleAuthenticate = () => {
    setAuthenticated(true);
    loadData();
  };

  if (loading) {
    return (
      <Background>
        <div className="container max-w-7xl mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
          <p className="text-lg">Loading...</p>
        </div>
      </Background>
    );
  }

  if (!authenticated) {
    return (
      <Background>
        <div className="container max-w-md mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
          <AdminAuth onAuthenticate={handleAuthenticate} />
        </div>
      </Background>
    );
  }

  return (
    <Background>
      <div className="container max-w-7xl mx-auto px-4 py-8 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Shield className="mr-2 h-6 w-6 text-primary" /> Admin Panel
          </h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
        
        <TransactionTabs />
      </div>
    </Background>
  );
};

export default Admin;
