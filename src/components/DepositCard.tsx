
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { DollarSign, Copy, Wallet } from 'lucide-react';
import DatabaseService from '@/services/DatabaseService';

interface DepositCardProps {
  onDeposit: (amount: number) => void;
  referralCount: number;
}

const DepositCard: React.FC<DepositCardProps> = ({ onDeposit, referralCount }) => {
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showUsdtAddress, setShowUsdtAddress] = useState<boolean>(false);
  const usdtAddress = "TURvPp42rgt773TNTNzdjg2wXN1E3P6PxT";

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setShowUsdtAddress(true);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(usdtAddress);
    toast.success('USDT address copied to clipboard');
  };

  const handleConfirmDeposit = async () => {
    const depositAmount = parseFloat(amount);
    setIsSubmitting(true);
    
    try {
      // Create transaction using regular handler
      onDeposit(depositAmount);
      
      // Force a refresh of IndexedDB
      const currentTransactions = await DatabaseService.getTransactions();
      console.log('Current transactions after deposit:', currentTransactions);
      
      setAmount('');
      setShowUsdtAddress(false);
      toast.success(`Deposit request of $${depositAmount.toFixed(2)} submitted`);
    } catch (error) {
      console.error('Error during deposit:', error);
      toast.error('An error occurred while processing your deposit');
    } finally {
      setIsSubmitting(false);
    }
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
        {!showUsdtAddress ? (
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
        ) : (
          <div className="space-y-3 animate-fade-in">
            <p className="text-sm text-muted-foreground">Send {amount} USDT (TRC20) to:</p>
            <div className="relative">
              <div className="bg-secondary p-3 rounded-md text-sm font-mono break-all relative">
                {usdtAddress}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2" 
                  onClick={handleCopyAddress}
                >
                  <Copy size={14} />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              After sending, click the confirm button below. Your deposit will be pending until approved by an admin.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!showUsdtAddress ? (
          <Button 
            onClick={handleDeposit} 
            className="w-full glass-button" 
            disabled={isSubmitting}
          >
            <Wallet size={16} className="mr-2" />
            {isSubmitting ? 'Processing...' : 'Deposit Now'}
          </Button>
        ) : (
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              onClick={() => setShowUsdtAddress(false)} 
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmDeposit} 
              className="flex-1 glass-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'I Have Sent USDT'}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default DepositCard;
