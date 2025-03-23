
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '@/components/Background';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react';
import AdminAuth from '@/components/admin/AdminAuth';
import TransactionTabs from '@/components/admin/TransactionTabs';
import { useTransactions } from '@/hooks/useTransactions';
import { User } from '@/types';
import { toast } from 'sonner';

// Admin usernames for demonstration
const ADMIN_USERS = ['admin', 'admin123', 'superadmin'];

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { loadData, transactions, pendingTransactions } = useTransactions();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Check if user is an admin
    if (currentUser && ADMIN_USERS.includes(currentUser.username)) {
      loadData();
      setAuthenticated(true);
    }
    
    setLoading(false);

    // Force refresh every few seconds to ensure latest data
    const refreshInterval = setInterval(() => {
      if (authenticated) {
        loadData();
        console.log("Admin panel - auto refreshing transactions...");
      }
    }, 3000);

    return () => clearInterval(refreshInterval);
  }, [loadData, authenticated]);

  const handleAuthenticate = () => {
    setAuthenticated(true);
    loadData();
    toast.success('Admin authenticated successfully');
  };

  const handleRefresh = () => {
    loadData();
    toast.info('Transactions refreshed');
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
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Total transactions: {transactions.length} • Pending: {pendingTransactions.length}
          </p>
          {transactions.length === 0 && (
            <div className="mt-2 p-4 bg-amber-100 dark:bg-amber-900 rounded-md">
              <p className="text-amber-800 dark:text-amber-200">
                No transactions found in storage. If you submitted a deposit request, it might not have been saved properly.
                Try making another deposit from the dashboard or check if localStorage is enabled in your browser.
              </p>
            </div>
          )}
          
          {pendingTransactions.length > 0 && (
            <div className="mt-2 p-4 bg-blue-100 dark:bg-blue-900 rounded-md">
              <p className="text-blue-800 dark:text-blue-200">
                You have {pendingTransactions.length} pending transaction{pendingTransactions.length !== 1 ? 's' : ''} awaiting your approval.
              </p>
            </div>
          )}
        </div>
        
        <TransactionTabs />
      </div>
    </Background>
  );
};

export default Admin;
