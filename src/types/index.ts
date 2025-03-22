
export interface User {
  id: number;
  username: string;
  balance: number;
  referrer: string | null;
  created_at: string;
  referrals: string[];
  depositAmount?: number;
  lastStakingReward?: string | null;
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
