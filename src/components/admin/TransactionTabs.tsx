
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import TransactionCard from './TransactionCard';
import { useTransactions } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const TransactionTabs: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    getUsernameById,
    handleApproveTransaction,
    handleRejectTransaction,
    pendingTransactions,
    approvedTransactions,
    rejectedTransactions,
    loadData,
    lastRefresh
  } = useTransactions();

  // Load data when component mounts
  useEffect(() => {
    loadData();
    console.log("TransactionTabs mounted, loading data...");
    
    // Log the pending transactions to help debug
    console.log("Pending transactions in TransactionTabs:", pendingTransactions);
  }, [loadData]);

  const handleManualRefresh = () => {
    loadData();
    console.log("Manual refresh in TransactionTabs:");
    console.log("Pending transactions after refresh:", pendingTransactions);
  };

  const formatLastRefresh = () => {
    const date = new Date(lastRefresh);
    return date.toLocaleTimeString();
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Input
          placeholder="Search by username, type, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="glass-input max-w-md"
        />
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Last refresh: {formatLastRefresh()}</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleManualRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw size={14} /> Refresh Now
          </Button>
        </div>
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
            <div>
              <p className="text-center text-muted-foreground py-4">No pending transactions</p>
              <div className="bg-amber-100 dark:bg-amber-900 p-4 rounded-md">
                <p className="text-amber-800 dark:text-amber-200">
                  If you've made a deposit or withdrawal request and it's not showing here, 
                  try refreshing the page or clicking the "Refresh Now" button above.
                </p>
              </div>
            </div>
          ) : (
            pendingTransactions.map(transaction => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                username={getUsernameById(transaction.userId)}
                isPending={true}
                onApprove={handleApproveTransaction}
                onReject={handleRejectTransaction}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="approved" className="space-y-4">
          {approvedTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No approved transactions</p>
          ) : (
            approvedTransactions.map(transaction => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                username={getUsernameById(transaction.userId)}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="space-y-4">
          {rejectedTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No rejected transactions</p>
          ) : (
            rejectedTransactions.map(transaction => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                username={getUsernameById(transaction.userId)}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default TransactionTabs;
