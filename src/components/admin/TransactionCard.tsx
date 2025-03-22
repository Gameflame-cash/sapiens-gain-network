import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
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
  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium capitalize">
                {transaction.type} {isPending ? 'Request' : `- ${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}`}
              </h3>
              <p className="text-sm text-muted-foreground">
                User: {username}
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
