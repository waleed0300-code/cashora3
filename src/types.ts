export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  balance: number;
  signup_bonus: number;
  status: 'active' | 'frozen';
  role: 'user' | 'admin';
  referral_code: string;
  profile_pic?: string;
  created_at?: string;
}

export interface Package {
  id: string;
  title: string;
  deposit_amount: number;
  profit_amount: number;
  status?: 'enabled' | 'disabled';
}

export interface UserPackage {
  id: string;
  user_id: string;
  package_id: string;
  title: string;
  deposit_amount: number;
  profit_amount: number;
  status: 'active' | 'completed';
  created_at: string;
}

export interface Deposit {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  amount: number;
  screenshot: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  amount: number;
  method: string;
  account_number: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'bonus' | 'purchase' | 'earning' | 'package_purchase';
  amount: number;
  description: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  status: 'unread' | 'read';
  created_at: string;
}

export interface PaymentSettings {
  easypaisa_number: string;
  jazzcash_number: string;
  bank_account: string;
  account_title: string;
  website_name: string;
  logo?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  reply?: string;
  status: 'unread' | 'replied';
  created_at: string;
}
