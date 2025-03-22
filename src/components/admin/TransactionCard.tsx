
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { Transaction } from '@/types';

interface TransactionCardProps {
  transaction: Transaction;
  username: string;
  isPending?: boolean;
  onApprove?: (transaction: Transaction) => void;
  onReject?: (transaction: Transaction) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  username,
  isPending = false,
  onApprove,
  onReject
}) => {
  // Format date to readable string
  const formattedDate = new Date(transaction.timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium capitalize">
                  {transaction.type} {isPending ? 'Request' : `- ${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}`}
                </h3>
                <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">ID: {transaction.id.slice(0, 8)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                User: {username} (ID: {transaction.userId})
              </p>
              <p className="text-sm font-semibold">
                Amount: ${transaction.amount.toFixed(2)}
              </p>
              {transaction.address && (
                <p className="text-xs font-mono bg-secondary p-1 rounded mt-1 break-all">
                  Address: {transaction.address}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <span className="inline-block w-3 h-3 rounded-full mr-1.5" style={{ 
                  backgroundColor: isPending ? 'orange' : transaction.status === 'approved' ? 'green' : 'red' 
                }}></span>
                {formattedDate}
              </p>
            </div>
            {isPending && onApprove && onReject && (
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => onApprove(transaction)}
                  className="h-8 bg-green-500 hover:bg-green-600"
                >
                  <CheckCircle className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => onReject(transaction)}
                  className="h-8"
                >
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
