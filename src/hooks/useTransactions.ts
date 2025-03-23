
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { User, Transaction } from '@/types';
import DatabaseService from '@/services/DatabaseService';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize database from localStorage if needed
  useEffect(() => {
    const initializeDatabase = async () => {
      if (!isInitialized) {
        await DatabaseService.initFromLocalStorage();
        setIsInitialized(true);
      }
    };
    
    initializeDatabase();
  }, [isInitialized]);

  const loadData = useCallback(async () => {
    try {
      // Get data from IndexedDB
      const storedTransactions = await DatabaseService.getTransactions();
      const storedUsers = await DatabaseService.getUsers();
      
      console.log('Loaded transactions from DB:', storedTransactions);
      console.log('Loaded users from DB:', storedUsers);
      
      setTransactions(storedTransactions);
      setUsers(storedUsers);
      setLastRefresh(Date.now());
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load transaction data');
    }
  }, []);

  // Initialize data
  useEffect(() => {
    if (isInitialized) {
      loadData();
    }
  }, [loadData, isInitialized]);
  
  // Auto-reload data periodically
  useEffect(() => {
    if (!isInitialized) return;
    
    const interval = setInterval(() => {
      loadData();
      console.log("Refreshing transaction data...");
    }, 3000); // Check every 3 seconds
    
    return () => clearInterval(interval);
  }, [loadData, isInitialized]);

  const getUsernameById = (userId: number) => {
    const user = users.find(user => user.id === userId);
    return user ? user.username : 'Unknown User';
  };

  const handleApproveTransaction = async (transaction: Transaction) => {
    const user = users.find(u => u.id === transaction.userId);
    if (!user) {
      toast.error('User not found');
      return;
    }

    const updatedUsers = [...users];
    const userIndex = updatedUsers.findIndex(u => u.id === transaction.userId);
    
    if (transaction.type === 'deposit') {
      updatedUsers[userIndex] = {
        ...user,
        balance: user.balance + transaction.amount,
        depositAmount: Math.max((user.depositAmount || 0), transaction.amount)
      };
      
      const updatedTransaction = { ...transaction, status: 'approved' as const };
      
      // Update both databases
      await DatabaseService.updateTransaction(updatedTransaction);
      await DatabaseService.updateUser(updatedUsers[userIndex]);
      
      setTransactions(prevTransactions => 
        prevTransactions.map(t => t.id === transaction.id ? updatedTransaction : t)
      );
      setUsers(updatedUsers);
      
      toast.success(`Deposit of $${transaction.amount} approved for ${user.username}`);
      
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.id === user.id) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUsers[userIndex]));
      }
    } else if (transaction.type === 'withdrawal') {
      if (user.balance < transaction.amount) {
        toast.error('User has insufficient balance');
        return;
      }
      
      updatedUsers[userIndex] = {
        ...user,
        balance: user.balance - transaction.amount
      };
      
      const updatedTransaction = { ...transaction, status: 'approved' as const };
      
      // Update both databases
      await DatabaseService.updateTransaction(updatedTransaction);
      await DatabaseService.updateUser(updatedUsers[userIndex]);
      
      setTransactions(prevTransactions => 
        prevTransactions.map(t => t.id === transaction.id ? updatedTransaction : t)
      );
      setUsers(updatedUsers);
      
      toast.success(`Withdrawal of $${transaction.amount} approved for ${user.username}`);
      
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.id === user.id) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUsers[userIndex]));
      }
    }
  };

  const handleRejectTransaction = async (transaction: Transaction) => {
    const updatedTransaction = { ...transaction, status: 'rejected' as const };
    
    // Update database
    await DatabaseService.updateTransaction(updatedTransaction);
    
    setTransactions(prevTransactions => 
      prevTransactions.map(t => t.id === transaction.id ? updatedTransaction : t)
    );
    
    toast.info(`Transaction ${transaction.id} rejected`);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const username = getUsernameById(transaction.userId).toLowerCase();
    return username.includes(searchTerm.toLowerCase()) || 
           transaction.type.includes(searchTerm.toLowerCase()) ||
           transaction.status.includes(searchTerm.toLowerCase());
  });

  const pendingTransactions = filteredTransactions.filter(t => t.status === 'pending');
  const approvedTransactions = filteredTransactions.filter(t => t.status === 'approved');
  const rejectedTransactions = filteredTransactions.filter(t => t.status === 'rejected');

  // Get user-specific transactions
  const getUserTransactions = (userId: number) => {
    return transactions.filter(t => t.userId === userId);
  };

  return {
    transactions,
    users,
    searchTerm,
    setSearchTerm,
    loadData,
    lastRefresh,
    getUsernameById,
    handleApproveTransaction,
    handleRejectTransaction,
    filteredTransactions,
    pendingTransactions,
    approvedTransactions,
    rejectedTransactions,
    getUserTransactions
  };
};
