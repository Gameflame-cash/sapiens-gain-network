
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowUp, Wallet } from 'lucide-react';

interface WithdrawCardProps {
  balance: number;
  onWithdraw: (amount: number, address: string) => void;
}

const WithdrawCard: React.FC<WithdrawCardProps> = ({ balance, onWithdraw }) => {
  const [amount, setAmount] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (withdrawAmount > balance) {
      toast.error('Insufficient balance');
      return;
    }
    
    if (!address || !address.trim()) {
      toast.error('Please enter your USDT address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      onWithdraw(withdrawAmount, address);
      setAmount('');
      setAddress('');
      toast.success(`Withdrawal request of $${withdrawAmount.toFixed(2)} submitted`);
      
      // Force a refresh of localStorage data
      const currentTransactions = JSON.parse(localStorage.getItem('sapiens_transactions') || '[]');
      console.log('Current transactions after withdrawal:', currentTransactions);
    } catch (error) {
      console.error('Error during withdrawal:', error);
      toast.error('An error occurred while processing your withdrawal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl">Withdraw Funds</CardTitle>
        <CardDescription>
          Request a withdrawal to your USDT wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            type="number"
            placeholder="Enter amount"
            className="pl-9 glass-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <Input
            placeholder="Your USDT (TRC20) Address"
            className="glass-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Ensure you enter the correct TRC20 address. Withdrawals require admin approval.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleWithdraw} 
          className="w-full glass-button" 
          disabled={isSubmitting || balance <= 0}
        >
          <ArrowUp size={16} className="mr-2" />
          {isSubmitting ? 'Processing...' : 'Request Withdrawal'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WithdrawCard;
