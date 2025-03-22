import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Background from '@/components/Background';
import DashboardHeader from '@/components/DashboardHeader';
import BalanceCard from '@/components/BalanceCard';
import DepositCard from '@/components/DepositCard';
import ReferralCard from '@/components/ReferralCard';
import StakingCard from '@/components/StakingCard';
import WithdrawCard from '@/components/WithdrawCard';
import { User, Transaction } from '@/types';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextReward, setNextReward] = useState<Date | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      navigate('/');
      return;
    }
    
    setUser(JSON.parse(storedUser));
    setLoading(false);
    
    // Calculate next reward time if staking is active
    const userData = JSON.parse(storedUser);
    if (userData.lastStakingReward && userData.referrals.length >= 10 && userData.depositAmount >= 100) {
      const lastReward = new Date(userData.lastStakingReward);
      const nextRewardTime = new Date(lastReward);
      nextRewardTime.setDate(nextRewardTime.getDate() + 1);
      setNextReward(nextRewardTime);
    }
    
    // Check for staking reward
    const checkStakingReward = () => {
      if (!userData.lastStakingReward || userData.referrals.length < 10 || userData.depositAmount < 100) {
        return;
      }
      
      const now = new Date();
      const lastReward = new Date(userData.lastStakingReward);
      const timeDiff = now.getTime() - lastReward.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      
      if (daysDiff >= 1) {
        // Award staking reward
        userData.balance += 1; // $1 daily reward
        userData.lastStakingReward = now.toISOString();
        
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Update user state
        setUser(userData);
        
        // Calculate next reward time
        const nextRewardTime = new Date(now);
        nextRewardTime.setDate(nextRewardTime.getDate() + 1);
        setNextReward(nextRewardTime);
        
        toast.success('You received $1 staking reward!');
      }
    };
    
    checkStakingReward();
    
    // Check for reward every minute
    const interval = setInterval(checkStakingReward, 60000);
    
    return () => clearInterval(interval);
  }, [navigate]);
  
  const handleDeposit = (amount: number) => {
    if (!user) return;
    
    // Create a deposit transaction record
    const transactions = JSON.parse(localStorage.getItem('sapiens_transactions') || '[]');
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      userId: user.id,
      type: 'deposit',
      amount: amount,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    transactions.push(newTransaction);
    localStorage.setItem('sapiens_transactions', JSON.stringify(transactions));
    
    toast.info('Your deposit request is pending admin approval');
  };
  
  const handleWithdraw = (amount: number, address: string) => {
    if (!user) return;
    
    // Create a withdraw transaction record
    const transactions = JSON.parse(localStorage.getItem('sapiens_transactions') || '[]');
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      userId: user.id,
      type: 'withdrawal',
      amount: amount,
      status: 'pending',
      address: address,
      timestamp: new Date().toISOString()
    };
    
    transactions.push(newTransaction);
    localStorage.setItem('sapiens_transactions', JSON.stringify(transactions));
    
    toast.info('Your withdrawal request is pending admin approval');
  };
  
  const handleAddReferral = (referral: string) => {
    if (!user) return;
    
    // Check if referral exists in users
    const users = JSON.parse(localStorage.getItem('sapiens_users') || '[]');
    const referralUser = users.find((u: User) => u.username === referral);
    
    if (!referralUser) {
      toast.error('User not found');
      return;
    }
    
    // Add referral to user's referrals
    const updatedUser = { ...user };
    updatedUser.referrals = [...updatedUser.referrals, referral];
    updatedUser.balance += 10; // $10 referral bonus
    
    // Check if reached 10 referrals
    if (updatedUser.referrals.length === 10) {
      updatedUser.balance += 100; // $100 bonus for completing 10 referrals
      toast.success('Congratulations! You completed 10 referrals and earned a $100 bonus!');
    }
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update users array in localStorage
    const updatedUsers = users.map((u: User) => {
      if (u.id === updatedUser.id) return updatedUser;
      if (u.username === referral) {
        // Update referral's referrer
        return { ...u, referrer: updatedUser.username };
      }
      return u;
    });
    localStorage.setItem('sapiens_users', JSON.stringify(updatedUsers));
    
    // Update user state
    setUser(updatedUser);
  };
  
  if (loading) {
    return (
      <Background>
        <div className="container max-w-7xl mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
          <p className="text-lg">Loading...</p>
        </div>
      </Background>
    );
  }
  
  if (!user) {
    navigate('/');
    return null;
  }
  
  const isStakingActive = user.referrals.length >= 10 && user.depositAmount >= 100 && !!user.lastStakingReward;
  const referralLink = `${window.location.origin}/?ref=${encodeURIComponent(user.username)}`;

  return (
    <Background>
      <div className="container max-w-7xl mx-auto px-4 pb-20">
        <DashboardHeader username={user.username} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {/* Main balance card - full width on mobile, 1/3 on desktop */}
          <div className="lg:col-span-1 md:col-span-2 col-span-1 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <BalanceCard 
              balance={user.balance} 
              referralCount={user.referrals.length}
              stakingActive={isStakingActive}
            />
          </div>
          
          {/* Staking status card */}
          <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <StakingCard 
              stakingActive={isStakingActive}
              referralCount={user.referrals.length}
              nextReward={nextReward}
            />
          </div>
          
          {/* Deposit card */}
          <div className="animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
            <DepositCard 
              onDeposit={handleDeposit}
              referralCount={user.referrals.length}
            />
          </div>
          
          {/* Withdraw card */}
          <div className="lg:col-span-1 md:col-span-2 col-span-1 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
            <WithdrawCard 
              balance={user.balance}
              onWithdraw={handleWithdraw}
            />
          </div>
          
          {/* Referral card - full width */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 animate-slide-in-up" style={{ animationDelay: '0.5s' }}>
            <ReferralCard 
              username={user.username}
              onAddReferral={handleAddReferral}
              referrals={user.referrals || []}
              referralLink={referralLink}
            />
          </div>
        </div>
      </div>
    </Background>
  );
};

export default Dashboard;
