
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '@/components/Background';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react';
import AdminAuth from '@/components/admin/AdminAuth';
import TransactionTabs from '@/components/admin/TransactionTabs';
import { useTransactions } from '@/hooks/useTransactions';
import { toast } from 'sonner';
import DatabaseService from '@/services/DatabaseService';

// Admin usernames for demonstration
const ADMIN_USERS = ['admin', 'admin123', 'superadmin'];

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [localTransactions, setLocalTransactions] = useState([]);
  const navigate = useNavigate();
  const { loadData, transactions, pendingTransactions } = useTransactions();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Check if user is an admin
    if (currentUser && ADMIN_USERS.includes(currentUser.username)) {
      setAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  // Direct access to localStorage transactions
  useEffect(() => {
    const getLocalStorageTransactions = () => {
      try {
        const storedTransactions = JSON.parse(localStorage.getItem('sapiens_transactions') || '[]');
        setLocalTransactions(storedTransactions);
        console.log("Direct localStorage transactions:", storedTransactions);
        return storedTransactions;
      } catch (error) {
        console.error("Error reading localStorage:", error);
        return [];
      }
    };

    // Get transactions immediately
    getLocalStorageTransactions();
    
    // And set up an interval to check regularly
    const interval = setInterval(() => {
      getLocalStorageTransactions();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Load transaction data when authenticated changes
  useEffect(() => {
    if (authenticated) {
      // Force initialize database then load data
      const initAndLoad = async () => {
        try {
          const localData = JSON.parse(localStorage.getItem('sapiens_transactions') || '[]');
          console.log("Admin authenticated, local transactions:", localData);
          
          await DatabaseService.initFromLocalStorage();
          loadData();
          
          // Double-check that data is loaded
          const dbTransactions = await DatabaseService.getTransactions();
          console.log("Database transactions after load:", dbTransactions);
        } catch (error) {
          console.error("Error initializing database:", error);
        }
      };
      
      initAndLoad();
    }
  }, [authenticated, loadData]);

  const handleAuthenticate = () => {
    setAuthenticated(true);
    loadData();
    toast.success('Admin authenticated successfully');
  };

  const handleRefresh = async () => {
    // Direct localStorage read for debugging
    const localData = JSON.parse(localStorage.getItem('sapiens_transactions') || '[]');
    console.log("Local storage transactions:", localData);
    setLocalTransactions(localData);
    
    // Normal database refresh
    await loadData();
    
    // Debug log to check if transactions are loaded
    const dbTransactions = await DatabaseService.getTransactions();
    console.log("Manual refresh triggered. DB Transactions:", dbTransactions);
    console.log("Pending transactions in state:", pendingTransactions);
    
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

  // Use local transactions as fallback if database is empty
  const displayTransactions = transactions.length > 0 ? transactions : localTransactions;
  const displayPendingTransactions = displayTransactions.filter(t => t.status === 'pending');

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
            Total transactions: {displayTransactions.length} • Pending: {displayPendingTransactions.length}
          </p>
          {displayTransactions.length === 0 && (
            <div className="mt-2 p-4 bg-amber-100 dark:bg-amber-900 rounded-md">
              <p className="text-amber-800 dark:text-amber-200">
                No transactions found in storage. If you submitted a deposit request, it might not have been saved properly.
                Try making another deposit from the dashboard or check if your browser supports IndexedDB.
              </p>
            </div>
          )}
          
          {displayPendingTransactions.length > 0 && (
            <div className="mt-2 p-4 bg-blue-100 dark:bg-blue-900 rounded-md">
              <p className="text-blue-800 dark:text-blue-200">
                You have {displayPendingTransactions.length} pending transaction{displayPendingTransactions.length !== 1 ? 's' : ''} awaiting your approval.
              </p>
            </div>
          )}
        </div>
        
        <TransactionTabs localTransactions={localTransactions} />
      </div>
    </Background>
  );
};

export default Admin;
