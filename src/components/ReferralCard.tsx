
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Copy, Users } from 'lucide-react';

interface ReferralCardProps {
  username: string;
  onAddReferral: (referral: string) => void;
  referrals: string[];
}

const ReferralCard: React.FC<ReferralCardProps> = ({ username, onAddReferral, referrals }) => {
  const [newReferral, setNewReferral] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(username);
    toast.success('Referral code copied to clipboard!');
  };

  const handleAddReferral = () => {
    if (!newReferral) {
      toast.error('Please enter a referral code');
      return;
    }
    
    if (newReferral === username) {
      toast.error('You cannot refer yourself');
      return;
    }
    
    if (referrals.includes(newReferral)) {
      toast.error('You have already added this referral');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onAddReferral(newReferral);
      setNewReferral('');
      setIsSubmitting(false);
      toast.success(`Referral ${newReferral} added successfully!`);
    }, 1000);
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Referrals</CardTitle>
            <CardDescription>Manage your referral network</CardDescription>
          </div>
          <Users className="text-primary h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Your referral code:</p>
            <div className="flex items-center gap-2">
              <code className="bg-secondary p-2 rounded-md flex-1 font-mono text-sm">{username}</code>
              <Button variant="outline" size="icon" onClick={handleCopyReferralLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Add a new referral:</p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter referral code"
                className="glass-input"
                value={newReferral}
                onChange={(e) => setNewReferral(e.target.value)}
              />
              <Button 
                onClick={handleAddReferral} 
                className="glass-button whitespace-nowrap"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start pt-0">
        <p className="text-sm text-muted-foreground mb-2">Your referrals ({referrals.length}/10):</p>
        {referrals.length > 0 ? (
          <div className="w-full rounded-md bg-secondary p-2 max-h-24 overflow-auto">
            <ul className="space-y-1">
              {referrals.map((referral, index) => (
                <li key={index} className="text-sm font-mono">{referral}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No referrals yet</p>
        )}
      </CardFooter>
    </Card>
  );
};

export default ReferralCard;
