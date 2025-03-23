
export interface User {
  id: number;
  username: string;
  balance: number;
  referrer: string | null;
  created_at: string;
  referrals: string[];
  depositAmount?: number;
  lastStakingReward?: string | null;
  email?: string;
  phone?: string;
}

export interface Transaction {
  id: string;
  userId: number;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  address?: string;
  timestamp: string;
}

export interface ReferralBonus {
  count: number;
  bonus: number;
}

export const REFERRAL_BONUSES: ReferralBonus[] = [
  { count: 10, bonus: 100 },
  { count: 20, bonus: 200 },
  { count: 30, bonus: 300 },
  { count: 40, bonus: 400 },
  { count: 50, bonus: 500 },
  { count: 60, bonus: 600 },
  { count: 70, bonus: 700 },
  { count: 80, bonus: 800 },
  { count: 90, bonus: 900 },
  { count: 100, bonus: 1500 },
];
