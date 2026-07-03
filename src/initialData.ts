import { User, Package, Deposit, Withdrawal, Transaction, Notification, PaymentSettings, ContactMessage } from './types';

export const INITIAL_PACKAGES: Package[] = [
  { id: 'pkg1', title: 'Starter Package', deposit_amount: 300, profit_amount: 50, status: 'enabled' },
  { id: 'pkg2', title: 'Bronze Package', deposit_amount: 500, profit_amount: 100, status: 'enabled' },
  { id: 'pkg3', title: 'Silver Package', deposit_amount: 1000, profit_amount: 250, status: 'enabled' },
  { id: 'pkg4', title: 'Gold Package', deposit_amount: 3000, profit_amount: 800, status: 'enabled' },
  { id: 'pkg5', title: 'Platinum Package', deposit_amount: 5000, profit_amount: 1500, status: 'enabled' },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'admin_id',
    name: 'Cashora Admin',
    email: 'admin@cashora.com',
    balance: 50000,
    signup_bonus: 150,
    status: 'active',
    role: 'admin',
    referral_code: 'CASHORA_ADMIN',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr1',
    name: 'Waleed Ahmad',
    email: 'user@cashora.com',
    balance: 850,
    signup_bonus: 150,
    status: 'active',
    role: 'user',
    referral_code: 'WALEED88',
    created_at: '2026-06-25T10:00:00Z',
  },
  {
    id: 'usr2',
    name: 'Sarah Khan',
    email: 'sarah@example.com',
    balance: 1500,
    signup_bonus: 150,
    status: 'active',
    role: 'user',
    referral_code: 'SARAH77',
    created_at: '2026-06-26T14:30:00Z',
  },
  {
    id: 'usr3',
    name: 'Ali Raza',
    email: 'ali@example.com',
    balance: 150,
    signup_bonus: 150,
    status: 'frozen',
    role: 'user',
    referral_code: 'ALI123',
    created_at: '2026-06-24T08:15:00Z',
  }
];

export const INITIAL_DEPOSITS: Deposit[] = [
  {
    id: 'dep1',
    user_id: 'usr1',
    user_name: 'Waleed Ahmad',
    user_email: 'user@cashora.com',
    amount: 1000,
    screenshot: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&auto=format&fit=crop&q=60',
    status: 'approved',
    created_at: '2026-06-25T11:00:00Z'
  },
  {
    id: 'dep2',
    user_id: 'usr2',
    user_name: 'Sarah Khan',
    user_email: 'sarah@example.com',
    amount: 3000,
    screenshot: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&auto=format&fit=crop&q=60',
    status: 'pending',
    created_at: '2026-06-26T15:00:00Z'
  }
];

export const INITIAL_WITHDRAWALS: Withdrawal[] = [
  {
    id: 'wth1',
    user_id: 'usr1',
    user_name: 'Waleed Ahmad',
    user_email: 'user@cashora.com',
    amount: 300,
    method: 'Easypaisa',
    account_number: '03001234567',
    status: 'approved',
    created_at: '2026-06-26T09:00:00Z'
  },
  {
    id: 'wth2',
    user_id: 'usr2',
    user_name: 'Sarah Khan',
    user_email: 'sarah@example.com',
    amount: 500,
    method: 'JazzCash',
    account_number: '03129876543',
    status: 'pending',
    created_at: '2026-06-27T05:00:00Z'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    user_id: 'usr1',
    type: 'bonus',
    amount: 150,
    description: 'Signup Bonus Credited',
    created_at: '2026-06-25T10:00:00Z'
  },
  {
    id: 'tx2',
    user_id: 'usr1',
    type: 'deposit',
    amount: 1000,
    description: 'Deposit PKR 1,000 via Easypaisa Approved',
    created_at: '2026-06-25T11:00:00Z'
  },
  {
    id: 'tx3',
    user_id: 'usr1',
    type: 'purchase',
    amount: 500,
    description: 'Activated Bronze Package',
    created_at: '2026-06-25T12:00:00Z'
  },
  {
    id: 'tx4',
    user_id: 'usr1',
    type: 'earning',
    amount: 100,
    description: 'Daily Profit from Bronze Package',
    created_at: '2026-06-26T00:00:00Z'
  },
  {
    id: 'tx5',
    user_id: 'usr1',
    type: 'withdrawal',
    amount: 300,
    description: 'Withdrawal PKR 300 to Easypaisa Account Approved',
    created_at: '2026-06-26T09:00:00Z'
  },
  {
    id: 'tx6',
    user_id: 'usr2',
    type: 'bonus',
    amount: 150,
    description: 'Signup Bonus Credited',
    created_at: '2026-06-26T14:30:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'not1',
    user_id: 'usr1',
    title: 'Registration Successful',
    message: 'Welcome to Cashora! You have received PKR 150 signup bonus.',
    status: 'read',
    created_at: '2026-06-25T10:01:00Z'
  },
  {
    id: 'not2',
    user_id: 'usr1',
    title: 'Deposit Approved',
    message: 'Your deposit of PKR 1,000 has been approved. Balance updated!',
    status: 'read',
    created_at: '2026-06-25T11:05:00Z'
  },
  {
    id: 'not3',
    user_id: 'usr1',
    title: 'Package Activated',
    message: 'Your Bronze Package (Deposit: 500, Profit: 100) is now active.',
    status: 'read',
    created_at: '2026-06-25T12:00:00Z'
  },
  {
    id: 'not4',
    user_id: 'usr1',
    title: 'Withdrawal Approved',
    message: 'Your withdrawal request for PKR 300 has been processed successfully.',
    status: 'unread',
    created_at: '2026-06-26T09:05:00Z'
  }
];

export const INITIAL_SETTINGS: PaymentSettings = {
  easypaisa_number: '0300-1234567',
  jazzcash_number: '0315-9876543',
  bank_account: 'PK99UNIL00000123456789',
  account_title: 'Cashora Private Ltd',
  website_name: 'Cashora',
  logo: 'https://images.unsplash.com/photo-1534972195531-d756b9bda9f2?w=100&auto=format&fit=crop&q=60'
};

export const INITIAL_CONTACTS: ContactMessage[] = [
  {
    id: 'msg1',
    name: 'Muhammad Hammad',
    email: 'hammad@example.com',
    subject: 'Deposit inquiry',
    message: 'I made a deposit 2 hours ago using Easypaisa, but it is still pending. Can you please check?',
    status: 'unread',
    created_at: '2026-06-26T18:20:00Z'
  },
  {
    id: 'msg2',
    name: 'Zainab Bibi',
    email: 'zainab@example.com',
    subject: 'Partnership Proposal',
    message: 'We would love to promote Cashora on our social media handles with over 100k followers.',
    reply: 'Thank you for reaching out Zainab. We will contact you soon.',
    status: 'replied',
    created_at: '2026-06-25T11:30:00Z'
  }
];
