import React, { useState, useEffect } from 'react';
import { User, Package, Deposit, Withdrawal, Transaction, Notification, ContactMessage, PaymentSettings } from './types';
import LandingPage from './components/LandingPage';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import { Wallet, LogIn, UserPlus, KeyRound, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'register' | 'dashboard' | 'admin'>('landing');

  // Database States loaded from LocalStorage or seeded
  const [users, setUsers] = useState<User[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<PaymentSettings>({
    easypaisa_number: "0300 1234567",
    jazzcash_number: "0312 7654321",
    bank_account: "PK12 ABCD 0123 4567 8901 2345",
    account_title: "Cashora Corp Operations",
    website_name: "Cashora"
  });

  // Current logged in user ID
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Load state on mount
  useEffect(() => {
    // 1. Seed Packages
    const savedPackages = localStorage.getItem('cashora_packages');
    if (savedPackages) {
      setPackages(JSON.parse(savedPackages));
    } else {
      const initialPackages: Package[] = [
        { id: '1', title: 'Starter Plan', deposit_amount: 300, profit_amount: 50 },
        { id: '2', title: 'Bronze Plan', deposit_amount: 1000, profit_amount: 180 },
        { id: '3', title: 'Silver Plan', deposit_amount: 2000, profit_amount: 400 },
        { id: '4', title: 'Gold Plan', deposit_amount: 5000, profit_amount: 1100 },
        { id: '5', title: 'Diamond Plan', deposit_amount: 10000, profit_amount: 2500 }
      ];
      setPackages(initialPackages);
      localStorage.setItem('cashora_packages', JSON.stringify(initialPackages));
    }

    // 2. Seed Users
    const savedUsers = localStorage.getItem('cashora_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const initialUsers: User[] = [
        {
          id: 'admin-1',
          name: 'Chief Administrator',
          email: 'admin@cashora.com',
          password: 'admin123', // Demo credentials
          balance: 0,
          signup_bonus: 0,
          role: 'admin',
          status: 'active',
          referral_code: 'ADMIN99'
        },
        {
          id: 'user-1',
          name: 'Demo Investor',
          email: 'user@cashora.com',
          password: 'user123', // Demo credentials
          balance: 150, // PKR 150 starting signup bonus
          signup_bonus: 150,
          role: 'user',
          status: 'active',
          referral_code: 'CASH777'
        }
      ];
      setUsers(initialUsers);
      localStorage.setItem('cashora_users', JSON.stringify(initialUsers));
    }

    // 3. Load Deposits
    const savedDeposits = localStorage.getItem('cashora_deposits');
    if (savedDeposits) setDeposits(JSON.parse(savedDeposits));

    // 4. Load Withdrawals
    const savedWithdrawals = localStorage.getItem('cashora_withdrawals');
    if (savedWithdrawals) setWithdrawals(JSON.parse(savedWithdrawals));

    // 5. Load Transactions
    const savedTransactions = localStorage.getItem('cashora_transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      const initialTx: Transaction[] = [
        {
          id: 'tx-initial',
          user_id: 'user-1',
          amount: 150,
          type: 'bonus',
          description: 'Welcome signup bonus credited to wallet balance.',
          created_at: new Date().toISOString()
        }
      ];
      setTransactions(initialTx);
      localStorage.setItem('cashora_transactions', JSON.stringify(initialTx));
    }

    // 6. Load Notifications
    const savedNotifications = localStorage.getItem('cashora_notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else {
      const initialNotif: Notification[] = [
        {
          id: 'notif-1',
          user_id: 'user-1',
          title: 'Welcome to Cashora!',
          message: 'Your registration is complete. We have credited PKR 150 bonus into your account.',
          status: 'unread',
          created_at: new Date().toISOString()
        }
      ];
      setNotifications(initialNotif);
      localStorage.setItem('cashora_notifications', JSON.stringify(initialNotif));
    }

    // 7. Load Settings
    const savedSettings = localStorage.getItem('cashora_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    // 8. Load Support messages
    const savedMsgs = localStorage.getItem('cashora_messages');
    if (savedMsgs) setContactMessages(JSON.parse(savedMsgs));

    // Check session
    const activeUserId = sessionStorage.getItem('cashora_active_user');
    if (activeUserId) {
      setCurrentUserId(activeUserId);
      const matchedUser = JSON.parse(localStorage.getItem('cashora_users') || '[]').find((u: User) => u.id === activeUserId);
      if (matchedUser) {
        setCurrentPage(matchedUser.role === 'admin' ? 'admin' : 'dashboard');
      }
    }
  }, []);

  // Sync state modifications to LocalStorage
  const syncUsers = (updated: User[]) => {
    setUsers(updated);
    localStorage.setItem('cashora_users', JSON.stringify(updated));
  };

  const syncPackages = (updated: Package[]) => {
    setPackages(updated);
    localStorage.setItem('cashora_packages', JSON.stringify(updated));
  };

  const syncDeposits = (updated: Deposit[]) => {
    setDeposits(updated);
    localStorage.setItem('cashora_deposits', JSON.stringify(updated));
  };

  const syncWithdrawals = (updated: Withdrawal[]) => {
    setWithdrawals(updated);
    localStorage.setItem('cashora_withdrawals', JSON.stringify(updated));
  };

  const syncTransactions = (updated: Transaction[]) => {
    setTransactions(updated);
    localStorage.setItem('cashora_transactions', JSON.stringify(updated));
  };

  const syncNotifications = (updated: Notification[]) => {
    setNotifications(updated);
    localStorage.setItem('cashora_notifications', JSON.stringify(updated));
  };

  const syncMessages = (updated: ContactMessage[]) => {
    setContactMessages(updated);
    localStorage.setItem('cashora_messages', JSON.stringify(updated));
  };

  const syncSettings = (updated: PaymentSettings) => {
    setSettings(updated);
    localStorage.setItem('cashora_settings', JSON.stringify(updated));
  };

  // Auth Operations
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regReferral, setRegReferral] = useState('');
  const [regErr, setRegErr] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErr('');
    const matched = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPassword);
    
    if (!matched) {
      setLoginErr('Invalid credentials. Check your email or password.');
      return;
    }

    if (matched.status === 'frozen') {
      setLoginErr('Your account is frozen by system administrator. Contact support.');
      return;
    }

    setCurrentUserId(matched.id);
    sessionStorage.setItem('cashora_active_user', matched.id);
    setCurrentPage(matched.role === 'admin' ? 'admin' : 'dashboard');
    setLoginEmail('');
    setLoginPassword('');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegErr('');

    if (regPass !== regConfirm) {
      setRegErr('Confirm password does not match original password.');
      return;
    }

    const emailTaken = users.some(u => u.email.toLowerCase() === regEmail.toLowerCase());
    if (emailTaken) {
      setRegErr('This email address is already registered on Cashora.');
      return;
    }

    // Create User account
    const newUserId = 'user-' + Date.now();
    const newUserReferral = 'CSH' + Math.floor(1000 + Math.random() * 9000);
    const newUser: User = {
      id: newUserId,
      name: regName,
      email: regEmail,
      password: regPass,
      balance: 150, // Welcome Bonus PKR 150
      signup_bonus: 150,
      role: 'user',
      status: 'active',
      referral_code: newUserReferral
    };

    const updatedUsers = [...users, newUser];
    syncUsers(updatedUsers);

    // Register transaction log
    const updatedTxs = [
      ...transactions,
      {
        id: 'tx-' + Date.now(),
        user_id: newUserId,
        amount: 150,
        type: 'bonus',
        description: 'PKR 150 Welcome signup bonus credited.',
        created_at: new Date().toISOString()
      }
    ];
    syncTransactions(updatedTxs);

    // Register notifications log
    const updatedNotifs = [
      ...notifications,
      {
        id: 'notif-' + Date.now(),
        user_id: newUserId,
        title: 'Welcome Bonus Credited!',
        message: 'Claimed PKR 150 starting welcome bonus added to balance.',
        status: 'unread',
        created_at: new Date().toISOString()
      }
    ];
    syncNotifications(updatedNotifs);

    // If referral exists, credit commission to referrer
    if (regReferral) {
      const referrerIndex = updatedUsers.findIndex(u => u.referral_code.toUpperCase() === regReferral.toUpperCase());
      if (referrerIndex !== -1) {
        const referrer = updatedUsers[referrerIndex];
        const updatedRefUsers = [...updatedUsers];
        updatedRefUsers[referrerIndex] = {
          ...referrer,
          balance: referrer.balance + 100 // Reward PKR 100 for inviting user
        };
        syncUsers(updatedRefUsers);

        // Referrer transaction
        const refTx = [
          ...updatedTxs,
          {
            id: 'tx-ref-' + Date.now(),
            user_id: referrer.id,
            amount: 100,
            type: 'bonus',
            description: `Referral commission received for inviting ${regName}.`,
            created_at: new Date().toISOString()
          }
        ];
        syncTransactions(refTx);

        // Referrer notification
        const refNotif = [
          ...updatedNotifs,
          {
            id: 'notif-ref-' + Date.now(),
            user_id: referrer.id,
            title: 'Referral Margin Earned',
            message: `PKR 100 credited for registration of referral ${regName}.`,
            status: 'unread',
            created_at: new Date().toISOString()
          }
        ];
        syncNotifications(refNotif);
      }
    }

    setCurrentUserId(newUserId);
    sessionStorage.setItem('cashora_active_user', newUserId);
    setCurrentPage('dashboard');

    setRegName('');
    setRegEmail('');
    setRegPass('');
    setRegConfirm('');
    setRegReferral('');
  };

  const handleLogout = () => {
    setCurrentUserId(null);
    sessionStorage.removeItem('cashora_active_user');
    setCurrentPage('landing');
  };

  // User Dashboard Operations
  const currentUser = users.find(u => u.id === currentUserId);
  const userDeposits = deposits.filter(d => d.user_id === currentUserId);
  const userWithdrawals = withdrawals.filter(w => w.user_id === currentUserId);
  const userTransactions = transactions.filter(t => t.user_id === currentUserId);
  const userNotifications = notifications.filter(n => n.user_id === currentUserId);

  // Get active packages by parsing logs
  const activeUserPackages = transactions
    .filter(t => t.user_id === currentUserId && t.type === 'package_purchase')
    .map(t => {
      const parts = t.description.split(' - ');
      const title = parts[0]?.replace('Activated package: ', '') || 'Yield Plan';
      const cost = t.amount;
      const profit = Math.round(cost * 0.15); // 15% yields estimate
      return {
        title,
        deposit_amount: cost,
        profit_amount: profit,
        created_at: t.created_at
      };
    });

  const handleAddDeposit = (amount: number, screenshot: string) => {
    if (!currentUserId || !currentUser) return;
    const newDep: Deposit = {
      id: 'dep-' + Date.now(),
      user_id: currentUserId,
      user_name: currentUser.name,
      user_email: currentUser.email,
      amount,
      screenshot,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    syncDeposits([newDep, ...deposits]);
  };

  const handleAddWithdrawal = (amount: number, method: string, accNum: string) => {
    if (!currentUserId || !currentUser) return;

    // Deduct immediately so balance matches
    const updated = users.map(u => {
      if (u.id === currentUserId) {
        return { ...u, balance: u.balance - amount };
      }
      return u;
    });
    syncUsers(updated);

    const newWth: Withdrawal = {
      id: 'wth-' + Date.now(),
      user_id: currentUserId,
      user_name: currentUser.name,
      user_email: currentUser.email,
      amount,
      method,
      account_number: accNum,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    syncWithdrawals([newWth, ...withdrawals]);

    // Tx log
    const updatedTxs = [
      ...transactions,
      {
        id: 'tx-wth-' + Date.now(),
        user_id: currentUserId,
        amount,
        type: 'withdrawal',
        description: `Cashout request filed to ${method} Account (${accNum}).`,
        created_at: new Date().toISOString()
      }
    ];
    syncTransactions(updatedTxs);
  };

  const handleActivatePackage = (pkgId: string): string | true => {
    if (!currentUserId || !currentUser) return 'Authentication error.';
    const pkg = packages.find(p => p.id === pkgId);
    if (!pkg) return 'Package not found.';

    if (currentUser.balance < pkg.deposit_amount) {
      return `Insufficient balance. PKR ${pkg.deposit_amount} required.`;
    }

    // Deduct cost and activate
    const updatedUsers = users.map(u => {
      if (u.id === currentUserId) {
        // We activate instantly and also award the first daily return yield right away for interactive simulation!
        return { ...u, balance: u.balance - pkg.deposit_amount + pkg.profit_amount };
      }
      return u;
    });
    syncUsers(updatedUsers);

    // Register purchases txs
    const updatedTxs = [
      ...transactions,
      {
        id: 'tx-buy-' + Date.now(),
        user_id: currentUserId,
        amount: pkg.deposit_amount,
        type: 'package_purchase',
        description: `Activated package: ${pkg.title}`,
        created_at: new Date().toISOString()
      },
      {
        id: 'tx-yield-' + Date.now(),
        user_id: currentUserId,
        amount: pkg.profit_amount,
        type: 'earning',
        description: `Daily profit yield credited for ${pkg.title}`,
        created_at: new Date().toISOString()
      }
    ];
    syncTransactions(updatedTxs);

    // Register notification
    const updatedNotifs = [
      ...notifications,
      {
        id: 'notif-buy-' + Date.now(),
        user_id: currentUserId,
        title: 'Plan Activated Successfully!',
        message: `Contract active. PKR ${pkg.profit_amount} daily profit yields are online.`,
        status: 'unread',
        created_at: new Date().toISOString()
      }
    ];
    syncNotifications(updatedNotifs);

    return true;
  };

  const handleMarkNotificationsRead = () => {
    if (!currentUserId) return;
    const updated = notifications.map(n => {
      if (n.user_id === currentUserId) return { ...n, status: 'read' as const };
      return n;
    });
    syncNotifications(updated);
  };

  const handleUpdateProfile = (name: string, email: string) => {
    if (!currentUserId) return;
    const updated = users.map(u => {
      if (u.id === currentUserId) return { ...u, name, email };
      return u;
    });
    syncUsers(updated);
  };

  // Admin Operations
  const handleApproveDeposit = (id: string) => {
    const dep = deposits.find(d => d.id === id);
    if (!dep) return;

    // Credit user's wallet balance
    const updatedUsers = users.map(u => {
      if (u.id === dep.user_id) return { ...u, balance: u.balance + dep.amount };
      return u;
    });
    syncUsers(updatedUsers);

    // Update deposit status
    const updatedDeps = deposits.map(d => {
      if (d.id === id) return { ...d, status: 'approved' as const };
      return d;
    });
    syncDeposits(updatedDeps);

    // Add transaction log
    const updatedTxs = [
      ...transactions,
      {
        id: 'tx-appdep-' + Date.now(),
        user_id: dep.user_id,
        amount: dep.amount,
        type: 'deposit',
        description: `Deposit receipt verification complete. Funds credited to balance.`,
        created_at: new Date().toISOString()
      }
    ];
    syncTransactions(updatedTxs);

    // Emit notification to user
    const updatedNotifs = [
      ...notifications,
      {
        id: 'notif-appdep-' + Date.now(),
        user_id: dep.user_id,
        title: 'Deposit Approved!',
        message: `Your deposit of PKR ${dep.amount} has been validated and added.`,
        status: 'unread',
        created_at: new Date().toISOString()
      }
    ];
    syncNotifications(updatedNotifs);
  };

  const handleRejectDeposit = (id: string) => {
    const dep = deposits.find(d => d.id === id);
    if (!dep) return;

    const updatedDeps = deposits.map(d => {
      if (d.id === id) return { ...d, status: 'rejected' as const };
      return d;
    });
    syncDeposits(updatedDeps);

    const updatedNotifs = [
      ...notifications,
      {
        id: 'notif-rejdep-' + Date.now(),
        user_id: dep.user_id,
        title: 'Deposit Rejected',
        message: `Your deposit of PKR ${dep.amount} was rejected due to receipt mismatch.`,
        status: 'unread',
        created_at: new Date().toISOString()
      }
    ];
    syncNotifications(updatedNotifs);
  };

  const handleApproveWithdrawal = (id: string) => {
    const wth = withdrawals.find(w => w.id === id);
    if (!wth) return;

    const updatedWths = withdrawals.map(w => {
      if (w.id === id) return { ...w, status: 'approved' as const };
      return w;
    });
    syncWithdrawals(updatedWths);

    const updatedNotifs = [
      ...notifications,
      {
        id: 'notif-appwth-' + Date.now(),
        user_id: wth.user_id,
        title: 'Payout Processed!',
        message: `Your withdrawal of PKR ${wth.amount} has been successfully credited to your ${wth.method} account.`,
        status: 'unread',
        created_at: new Date().toISOString()
      }
    ];
    syncNotifications(updatedNotifs);
  };

  const handleRejectWithdrawal = (id: string) => {
    const wth = withdrawals.find(w => w.id === id);
    if (!wth) return;

    // Refund the user's account
    const updatedUsers = users.map(u => {
      if (u.id === wth.user_id) return { ...u, balance: u.balance + wth.amount };
      return u;
    });
    syncUsers(updatedUsers);

    const updatedWths = withdrawals.map(w => {
      if (w.id === id) return { ...w, status: 'rejected' as const };
      return w;
    });
    syncWithdrawals(updatedWths);

    const updatedTxs = [
      ...transactions,
      {
        id: 'tx-refwth-' + Date.now(),
        user_id: wth.user_id,
        amount: wth.amount,
        type: 'bonus',
        description: `Rejected withdrawal of PKR ${wth.amount} refunded to balance.`,
        created_at: new Date().toISOString()
      }
    ];
    syncTransactions(updatedTxs);

    const updatedNotifs = [
      ...notifications,
      {
        id: 'notif-rejwth-' + Date.now(),
        user_id: wth.user_id,
        title: 'Payout Rejected & Refunded',
        message: `Your withdrawal of PKR ${wth.amount} was rejected. Funds returned to balance.`,
        status: 'unread',
        created_at: new Date().toISOString()
      }
    ];
    syncNotifications(updatedNotifs);
  };

  const handleAdjustBalance = (userId: string, amount: number, type: 'add' | 'deduct') => {
    const target = users.find(u => u.id === userId);
    if (!target) return;

    const updated = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          balance: type === 'add' ? u.balance + amount : Math.max(0, u.balance - amount)
        };
      }
      return u;
    });
    syncUsers(updated);

    const updatedTxs = [
      ...transactions,
      {
        id: 'tx-adj-' + Date.now(),
        user_id: userId,
        amount,
        type: type === 'add' ? 'bonus' : 'package_purchase',
        description: `Admin manual balance adjustment (${type === 'add' ? 'Credit' : 'Debit'}).`,
        created_at: new Date().toISOString()
      }
    ];
    syncTransactions(updatedTxs);

    const updatedNotifs = [
      ...notifications,
      {
        id: 'notif-adj-' + Date.now(),
        user_id: userId,
        title: 'Balance Adjustment',
        message: `System administrator adjusted your available balance by ${type === 'add' ? '+' : '-'} PKR ${amount}.`,
        status: 'unread',
        created_at: new Date().toISOString()
      }
    ];
    syncNotifications(updatedNotifs);
  };

  const handleToggleFreeze = (userId: string) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'frozen' as const : 'active' as const };
      }
      return u;
    });
    syncUsers(updated);
  };

  const handleAddPackage = (title: string, cost: number, profit: number) => {
    const newPkg: Package = {
      id: 'pkg-' + Date.now(),
      title,
      deposit_amount: cost,
      profit_amount: profit
    };
    syncPackages([...packages, newPkg]);
  };

  const handleDeletePackage = (id: string) => {
    syncPackages(packages.filter(p => p.id !== id));
  };

  const handleUpdateGateways = (easypaisa: string, jazzcash: string, bank: string, title: string) => {
    const updated = { ...settings, easypaisa_number: easypaisa, jazzcash_number: jazzcash, bank_account: bank, account_title: title };
    syncSettings(updated);
  };

  const handleUpdateBranding = (website: string, banner: string, footer: string) => {
    const updated = { ...settings, website_name: website };
    syncSettings(updated);
  };

  const handleAddContactMessage = (msg: Omit<ContactMessage, 'id' | 'created_at' | 'status'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      created_at: new Date().toISOString(),
      status: 'unread'
    };
    syncMessages([newMsg, ...contactMessages]);
  };

  const handleReplyMessage = (msgId: string, replyText: string) => {
    const updated = contactMessages.map(m => {
      if (m.id === msgId) return { ...m, reply: replyText, status: 'read' as const };
      return m;
    });
    syncMessages(updated);
  };

  return (
    <div className="min-h-screen frosted-bg text-slate-100 font-sans relative">
      {currentPage === 'landing' && (
        <LandingPage 
          packages={packages} 
          onNavigate={(p) => setCurrentPage(p)} 
          isLoggedIn={!!currentUserId} 
          userRole={currentUser?.role}
          onAddContact={handleAddContactMessage}
        />
      )}

      {currentPage === 'login' && (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
          {/* Mesh Decorative Elements */}
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-400/20 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-400/10 blur-[120px] rounded-full pointer-events-none"></div>

          <button 
            onClick={() => setCurrentPage('landing')}
            className="absolute top-6 left-6 flex items-center gap-1.5 text-sm font-semibold text-blue-200 hover:text-white transition z-10"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
          
          <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl space-y-6 relative z-10">
            <div className="text-center">
              <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl inline-block mb-3 shadow-lg">
                <Wallet className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Login to Cashora</h3>
              <p className="text-xs text-blue-200/70 mt-1">Access your high-yield passive earning dashboard</p>
            </div>

            {loginErr && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-200 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{loginErr}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-blue-200/80 block mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200/80 block mb-2">Password</label>
                <div className="relative bg-white/5 border border-white/10 rounded-xl flex items-center focus-within:border-emerald-400 focus-within:bg-white/10 transition-all">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="bg-transparent flex-1 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none border-none rounded-xl"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-3 text-blue-200/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-extrabold text-sm rounded-xl transition shadow-lg shadow-emerald-500/10"
              >
                Sign In
              </button>
            </form>

            <div className="text-center pt-2 border-t border-white/10">
              <span className="text-xs text-blue-200/50">Don't have an account? </span>
              <button onClick={() => setCurrentPage('register')} className="text-xs text-emerald-400 hover:text-white font-bold">Register here</button>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-[10px] text-blue-200/60 space-y-1">
              <strong className="text-blue-100 block mb-1">💡 Live Simulation Accounts:</strong>
              <div className="flex justify-between">
                <span>👤 User Demo: <code className="font-mono text-emerald-300">user@cashora.com</code></span>
                <span>🔑 Pass: <code className="font-mono text-emerald-300">user123</code></span>
              </div>
              <div className="flex justify-between">
                <span>🛡️ Admin Demo: <code className="font-mono text-emerald-300">admin@cashora.com</code></span>
                <span>🔑 Pass: <code className="font-mono text-emerald-300">admin123</code></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'register' && (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
          {/* Mesh Decorative Elements */}
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-400/20 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-400/10 blur-[120px] rounded-full pointer-events-none"></div>

          <button 
            onClick={() => setCurrentPage('landing')}
            className="absolute top-6 left-6 flex items-center gap-1.5 text-sm font-semibold text-blue-200 hover:text-white transition z-10"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
          
          <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl space-y-6 relative z-10">
            <div className="text-center">
              <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl inline-block mb-3 shadow-lg">
                <UserPlus className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Join Cashora Platform</h3>
              <p className="text-xs text-blue-200/70 mt-1">Get PKR 150 Signup welcome bonus credited immediately</p>
            </div>

            {regErr && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-200 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{regErr}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-blue-200/80 block mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200/80 block mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-blue-200/80 block mb-2">Password</label>
                  <input 
                    type="password" 
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                    placeholder="Min 6 chars"
                    minLength={6}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-blue-200/80 block mb-2">Confirm Password</label>
                  <input 
                    type="password" 
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                    placeholder="Repeat password"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200/80 block mb-2">Referral Code (Optional)</label>
                <input 
                  type="text" 
                  value={regReferral}
                  onChange={(e) => setRegReferral(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                  placeholder="e.g. CASH777"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-extrabold text-sm rounded-xl transition shadow-lg shadow-emerald-500/10"
              >
                Register Account
              </button>
            </form>

            <div className="text-center pt-2 border-t border-white/10">
              <span className="text-xs text-blue-200/50">Already have an account? </span>
              <button onClick={() => setCurrentPage('login')} className="text-xs text-emerald-400 hover:text-white font-bold">Sign In</button>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'dashboard' && currentUser && (
        <UserDashboard 
          user={currentUser}
          packages={packages}
          userPackages={activeUserPackages}
          deposits={userDeposits}
          withdrawals={userWithdrawals}
          transactions={userTransactions}
          notifications={userNotifications}
          settings={settings}
          onLogout={handleLogout}
          onNavigateLanding={() => setCurrentPage('landing')}
          onAddDeposit={handleAddDeposit}
          onAddWithdrawal={handleAddWithdrawal}
          onActivatePackage={handleActivatePackage}
          onMarkNotificationsRead={handleMarkNotificationsRead}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {currentPage === 'admin' && (
        <AdminDashboard 
          users={users}
          packages={packages}
          deposits={deposits}
          withdrawals={withdrawals}
          messages={contactMessages}
          settings={settings}
          onLogout={handleLogout}
          onNavigateLanding={() => setCurrentPage('landing')}
          onApproveDeposit={handleApproveDeposit}
          onRejectDeposit={handleRejectDeposit}
          onApproveWithdrawal={handleApproveWithdrawal}
          onRejectWithdrawal={handleRejectWithdrawal}
          onAdjustBalance={handleAdjustBalance}
          onToggleFreeze={handleToggleFreeze}
          onAddPackage={handleAddPackage}
          onDeletePackage={handleDeletePackage}
          onUpdateGateways={handleUpdateGateways}
          onUpdateBranding={handleUpdateBranding}
          onReplyMessage={handleReplyMessage}
        />
      )}
    </div>
  );
}
