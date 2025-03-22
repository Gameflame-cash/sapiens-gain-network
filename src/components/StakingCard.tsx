
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Clock } from 'lucide-react';

interface StakingCardProps {
  stakingActive: boolean;
  referralCount: number;
  nextReward: Date | null;
}

const StakingCard: React.FC<StakingCardProps> = ({ stakingActive, referralCount, nextReward }) => {
  // Calculate time until next reward
  const getTimeUntilNextReward = () => {
    if (!nextReward) return 'Not activated';
    
    const now = new Date();
    const diff = nextReward.getTime() - now.getTime();
    
    if (diff <= 0) return 'Available now';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  const referralProgress = Math.min(100, (referralCount / 10) * 100);

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Staking Rewards</CardTitle>
            <CardDescription>Earn $1 daily on $100 deposit</CardDescription>
          </div>
          <Sparkles className={`h-5 w-5 ${stakingActive ? 'text-primary animate-pulse-gentle' : 'text-muted-foreground'}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Referral Progress</span>
              <span className="font-medium">{referralCount}/10</span>
            </div>
            <Progress value={referralProgress} className="h-2" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Staking Status</span>
              <span className={`text-sm font-medium ${stakingActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {stakingActive ? 'Active' : referralCount >= 10 ? 'Deposit $100 to activate' : 'Need 10 referrals'}
              </span>
            </div>
          </div>
          
          {stakingActive && (
            <div className="space-y-1 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Next Reward
                </span>
                <span className="text-sm font-medium">{getTimeUntilNextReward()}</span>
              </div>
              <div className="text-sm text-muted-foreground pt-1">
                Daily Reward: <span className="text-primary font-medium">$1.00</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StakingCard;
