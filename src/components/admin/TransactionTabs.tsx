
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import TransactionCard from './TransactionCard';
import { useTransactions } from '@/hooks/useTransactions';

const TransactionTabs: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    getUsernameById,
    handleApproveTransaction,
    handleRejectTransaction,
    pendingTransactions,
    approvedTransactions,
    rejectedTransactions
  } = useTransactions();

  return (
    <>
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
