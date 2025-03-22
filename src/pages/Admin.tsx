
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Background from '@/components/Background';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Shield, ArrowLeft } from 'lucide-react';

interface User {
  id: number;
  username: string;
  balance: number;
  referrer: string | null;
  created_at: string;
  referrals: string[];
  depositAmount?: number; // Added this property to fix the type error
  lastStakingReward?: string | null;
}

interface Transaction {
  id: string;
  userId: number;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  address?: string;
  timestamp: string;
}

// Admin usernames for demonstration
const ADMIN_USERS = ['admin', 'admin123', 'superadmin'];

const Admin = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [adminPassword, setAdminPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Check if user is an admin
    if (currentUser && ADMIN_USERS.includes(currentUser.username)) {
      loadData();
      setAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  const loadData = () => {
    // Load transactions and users from localStorage
    const storedTransactions = JSON.parse(localStorage.getItem('sapiens_transactions') || '[]');
    const storedUsers = JSON.parse(localStorage.getItem('sapiens_users') || '[]');
    
    setTransactions(storedTransactions);
    setUsers(storedUsers);
  };

  const handleAdminAuth = () => {
    // Simple admin password for demo
    if (adminPassword === 'admin12345') {
      setAuthenticated(true);
      loadData();
      toast.success('Admin access granted');
    } else {
      toast.error('Invalid admin password');
    }
  };

  const getUsernameById = (userId: number) => {
    const user = users.find(user => user.id === userId);
    return user ? user.username : 'Unknown User';
  };

  const handleApproveTransaction = (transaction: Transaction) => {
    // Find the user associated with this transaction
    const user = users.find(u => u.id === transaction.userId);
    if (!user) {
      toast.error('User not found');
      return;
    }

    const updatedUsers = [...users];
    const userIndex = updatedUsers.findIndex(u => u.id === transaction.userId);
    
    if (transaction.type === 'deposit') {
      // Update user balance for deposit
      updatedUsers[userIndex] = {
        ...user,
        balance: user.balance + transaction.amount,
        depositAmount: Math.max((user.depositAmount || 0), transaction.amount)
      };
      
      // Update transaction status
      const updatedTransactions = transactions.map(t => 
        t.id === transaction.id ? { ...t, status: 'approved' as const } : t
      );
      
      // Save to localStorage
      localStorage.setItem('sapiens_users', JSON.stringify(updatedUsers));
      localStorage.setItem('sapiens_transactions', JSON.stringify(updatedTransactions));
      
      // Update state
      setTransactions(updatedTransactions);
      setUsers(updatedUsers);
      
      toast.success(`Deposit of $${transaction.amount} approved for ${user.username}`);
      
      // Update currentUser if it's the same user
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.id === user.id) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUsers[userIndex]));
      }
    } else if (transaction.type === 'withdrawal') {
      // Ensure user has enough balance
      if (user.balance < transaction.amount) {
        toast.error('User has insufficient balance');
        return;
      }
      
      // Update user balance for withdrawal
      updatedUsers[userIndex] = {
        ...user,
        balance: user.balance - transaction.amount
      };
      
      // Update transaction status
      const updatedTransactions = transactions.map(t => 
        t.id === transaction.id ? { ...t, status: 'approved' as const } : t
      );
      
      // Save to localStorage
      localStorage.setItem('sapiens_users', JSON.stringify(updatedUsers));
      localStorage.setItem('sapiens_transactions', JSON.stringify(updatedTransactions));
      
      // Update state
      setTransactions(updatedTransactions);
      setUsers(updatedUsers);
      
      toast.success(`Withdrawal of $${transaction.amount} approved for ${user.username}`);
      
      // Update currentUser if it's the same user
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.id === user.id) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUsers[userIndex]));
      }
    }
  };

  const handleRejectTransaction = (transaction: Transaction) => {
    // Update transaction status to rejected
    const updatedTransactions = transactions.map(t => 
      t.id === transaction.id ? { ...t, status: 'rejected' as const } : t
    );
    
    // Save to localStorage
    localStorage.setItem('sapiens_transactions', JSON.stringify(updatedTransactions));
    
    // Update state
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
          <Card className="w-full glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" /> Admin Access
              </CardTitle>
              <CardDescription>Enter admin password to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                type="password" 
                placeholder="Admin Password" 
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="glass-input"
              />
              <Button onClick={handleAdminAuth} className="w-full glass-button">
                Authenticate
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Button>
            </CardContent>
          </Card>
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
        
        <div className="mb-6">
          <Input
            placeholder="Search by username, type, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input max-w-md"
          />
        </div>
        
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-4">
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingTransactions.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {pendingTransactions.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            {pendingTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No pending transactions</p>
            ) : (
              pendingTransactions.map(transaction => (
                <Card key={transaction.id} className="glass-card overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium capitalize">
                            {transaction.type} Request
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            User: {getUsernameById(transaction.userId)}
                          </p>
                          <p className="text-sm">
                            Amount: ${transaction.amount.toFixed(2)}
                          </p>
                          {transaction.address && (
                            <p className="text-xs font-mono bg-secondary p-1 rounded mt-1 break-all">
                              Address: {transaction.address}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApproveTransaction(transaction)}
                            className="h-8 bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleRejectTransaction(transaction)}
                            className="h-8"
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="approved" className="space-y-4">
            {approvedTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No approved transactions</p>
            ) : (
              approvedTransactions.map(transaction => (
                <Card key={transaction.id} className="glass-card overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium capitalize">
                            {transaction.type} - Approved
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            User: {getUsernameById(transaction.userId)}
                          </p>
                          <p className="text-sm">
                            Amount: ${transaction.amount.toFixed(2)}
                          </p>
                          {transaction.address && (
                            <p className="text-xs font-mono bg-secondary p-1 rounded mt-1 break-all">
                              Address: {transaction.address}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="rejected" className="space-y-4">
            {rejectedTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No rejected transactions</p>
            ) : (
              rejectedTransactions.map(transaction => (
                <Card key={transaction.id} className="glass-card overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium capitalize">
                            {transaction.type} - Rejected
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            User: {getUsernameById(transaction.userId)}
                          </p>
                          <p className="text-sm">
                            Amount: ${transaction.amount.toFixed(2)}
                          </p>
                          {transaction.address && (
                            <p className="text-xs font-mono bg-secondary p-1 rounded mt-1 break-all">
                              Address: {transaction.address}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Background>
  );
};

export default Admin;
