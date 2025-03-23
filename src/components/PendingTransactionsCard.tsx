
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types';
import { Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface PendingTransactionsCardProps {
  transactions: Transaction[];
}

const PendingTransactionsCard: React.FC<PendingTransactionsCardProps> = ({ transactions }) => {
  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (pendingTransactions.length === 0) {
    return null;
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Clock className="h-5 w-5 mr-2 text-amber-500" />
          Pending Transactions
        </CardTitle>
        <CardDescription>
          Transactions awaiting approval
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {transaction.type === 'deposit' ? (
                      <ArrowDownLeft className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 mr-2 text-amber-500" />
                    )}
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </div>
                </TableCell>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                    Pending
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PendingTransactionsCard;
