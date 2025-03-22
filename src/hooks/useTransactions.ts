import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User, Transaction } from '@/types';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = () => {
    const storedTransactions = JSON.parse(localStorage.getItem('sapiens_transactions') || '[]');
    const storedUsers = JSON.parse(localStorage.getItem('sapiens_users') || '[]');
    
    setTransactions(storedTransactions);
    setUsers(storedUsers);
  };

  const getUsernameById = (userId: number) => {
    const user = users.find(user => user.id === userId);
    return user ? user.username : 'Unknown User';
  };

  const handleApproveTransaction = (transaction: Transaction) => {
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
      
      const updatedTransactions = transactions.map(t => 
        t.id === transaction.id ? { ...t, status: 'approved' as const } : t
      );
      
      localStorage.setItem('sapiens_users', JSON.stringify(updatedUsers));
      localStorage.setItem('sapiens_transactions', JSON.stringify(updatedTransactions));
      
      setTransactions(updatedTransactions);
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
      
      const updatedTransactions = transactions.map(t => 
        t.id === transaction.id ? { ...t, status: 'approved' as const } : t
      );
      
      localStorage.setItem('sapiens_users', JSON.stringify(updatedUsers));
      localStorage.setItem('sapiens_transactions', JSON.stringify(updatedTransactions));
      
      setTransactions(updatedTransactions);
      setUsers(updatedUsers);
      
      toast.success(`Withdrawal of $${transaction.amount} approved for ${user.username}`);
      
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.id === user.id) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUsers[userIndex]));
      }
    }
  };

  const handleRejectTransaction = (transaction: Transaction) => {
    const updatedTransactions = transactions.map(t => 
      t.id === transaction.id ? { ...t, status: 'rejected' as const } : t
    );
    
    localStorage.setItem('sapiens_transactions', JSON.stringify(updatedTransactions));
    
    setTransactions(updatedTransactions);
    
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

  return {
    transactions,
    users,
    searchTerm,
    setSearchTerm,
    loadData,
    getUsernameById,
    handleApproveTransaction,
    handleRejectTransaction,
    filteredTransactions,
    pendingTransactions,
    approvedTransactions,
    rejectedTransactions
  };
};
