
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, DollarSign } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  referralCount: number;
  stakingActive: boolean;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, referralCount, stakingActive }) => {
  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-8">
        <CardDescription className="text-sm font-medium text-muted-foreground">Your Current Balance</CardDescription>
        <CardTitle className="text-4xl font-bold flex items-center gap-2">
          <DollarSign className="text-primary" size={28} />
          <span className="tabular-nums">{balance.toFixed(2)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Referrals</p>
            <p className="text-2xl font-medium tabular-nums">{referralCount} / 10</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Staking</p>
            <div className="flex items-center gap-2">
              {stakingActive ? (
                <>
                  <Sparkles className="h-5 w-5 text-primary animate-pulse-gentle" />
                  <span className="text-primary font-medium">Active</span>
                </>
              ) : (
                <span className="text-muted-foreground">{referralCount >= 10 ? "Deposit $100 to activate" : "Need 10 referrals"}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
