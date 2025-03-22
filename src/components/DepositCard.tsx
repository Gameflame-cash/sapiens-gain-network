
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { DollarSign } from 'lucide-react';

interface DepositCardProps {
  onDeposit: (amount: number) => void;
  referralCount: number;
}

const DepositCard: React.FC<DepositCardProps> = ({ onDeposit, referralCount }) => {
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onDeposit(depositAmount);
      setAmount('');
      setIsSubmitting(false);
      toast.success(`Successfully deposited $${depositAmount.toFixed(2)}`);
    }, 1000);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl">Make a Deposit</CardTitle>
        <CardDescription>
          Add funds to your account
          {referralCount >= 10 && (
            <span className="block mt-1 text-primary font-medium">Deposit $100 to activate staking!</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            type="number"
            placeholder="Enter amount"
            className="pl-9 glass-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleDeposit} 
          className="w-full glass-button" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Deposit Now'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DepositCard;
