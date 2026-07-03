import React, { useState } from 'react';
import { 
  User, Package, Deposit, Withdrawal, Transaction, Notification, PaymentSettings 
} from '../types';
import { 
  LayoutDashboard, Box, ArrowDownCircle, ArrowUpCircle, History, UserCheck, Bell, LogOut, 
  Copy, CheckCircle, Smartphone, Landmark, CheckCircle2, ChevronRight, AlertCircle, RefreshCw
} from 'lucide-react';

interface UserDashboardProps {
  user: User;
  packages: Package[];
  userPackages: Array<{ title: string; deposit_amount: number; profit_amount: number; created_at: string }>;
  deposits: Deposit[];
  withdrawals: Withdrawal[];
  transactions: Transaction[];
  notifications: Notification[];
  settings: PaymentSettings;
  onLogout: () => void;
  onNavigateLanding: () => void;
  onAddDeposit: (amount: number, screenshot: string) => void;
  onAddWithdrawal: (amount: number, method: string, accNum: string) => void;
  onActivatePackage: (pkgId: string) => string | true;
  onMarkNotificationsRead: () => void;
  onUpdateProfile: (name: string, email: string) => void;
}

export default function UserDashboard({
  user, packages, userPackages, deposits, withdrawals, transactions, notifications, settings,
  onLogout, onNavigateLanding, onAddDeposit, onAddWithdrawal, onActivatePackage, onMarkNotificationsRead, onUpdateProfile
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'deposit' | 'withdrawal' | 'history' | 'profile'>('overview');
  
  // Deposit state
  const [depAmount, setDepAmount] = useState('');
  const [depScreenshot, setDepScreenshot] = useState('https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&auto=format&fit=crop&q=60');
  const [depSuccess, setDepSuccess] = useState(false);

  // Withdrawal state
  const [wthAmount, setWthAmount] = useState('');
  const [wthMethod, setWthMethod] = useState('Easypaisa');
  const [wthAccount, setWthAccount] = useState('');
  const [wthSuccess, setWthSuccess] = useState(false);
  const [wthError, setWthError] = useState('');

  // Package state
  const [pkgSuccess, setPkgSuccess] = useState('');
  const [pkgError, setPkgError] = useState('');

  // Profile state
  const [profName, setProfName] = useState(user.name);
  const [profEmail, setProfEmail] = useState(user.email);
  const [profSuccess, setProfSuccess] = useState(false);

  // Notifications State
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(depAmount);
    if (!val || val <= 0) return;
    onAddDeposit(val, depScreenshot);
    setDepSuccess(true);
    setDepAmount('');
    setTimeout(() => setDepSuccess(false), 5000);
  };

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(wthAmount);
    setWthError('');
    if (!val || val <= 0) {
      setWthError('Please enter a valid amount.');
      return;
    }
    if (val > user.balance) {
      setWthError('Insufficient balance to request this payout.');
      return;
    }
    onAddWithdrawal(val, wthMethod, wthAccount);
    setWthSuccess(true);
    setWthAmount('');
    setWthAccount('');
    setTimeout(() => setWthSuccess(false), 5000);
  };

  const handleActivatePkg = (pkgId: string) => {
    setPkgError('');
    setPkgSuccess('');
    const res = onActivatePackage(pkgId);
    if (res === true) {
      setPkgSuccess('Package activated successfully! Earning credited to your wallet balance.');
      setTimeout(() => setPkgSuccess(''), 5000);
    } else {
      setPkgError(res);
      setTimeout(() => setPkgError(''), 5000);
    }
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profName || !profEmail) return;
    onUpdateProfile(profName, profEmail);
    setProfSuccess(true);
    setTimeout(() => setProfSuccess(false), 4000);
  };

  const [copied, setCopied] = useState(false);
  const copyReferral = () => {
    navigator.clipboard.writeText(user.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen text-slate-100 flex relative overflow-hidden w-full">
      {/* Ambient glass background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[140px] rounded-full pointer-events-none"></div>

      {/* Sidebar Layout */}
      <aside className="hidden md:flex flex-col w-64 bg-white/5 border-r border-white/10 backdrop-blur-2xl p-6 shrink-0 z-20">
        <div className="flex items-center gap-2 mb-10 cursor-pointer" onClick={onNavigateLanding}>
          <div className="p-1.5 bg-white/10 border border-white/20 rounded-lg">
            <LayoutDashboard className="h-5 w-5 text-emerald-400" />
          </div>
          <span className="text-lg font-black text-white tracking-tight">Cashora</span>
        </div>

        <nav className="space-y-1.5 flex-1">
          <span className="text-[10px] font-extrabold tracking-widest text-blue-200/40 uppercase block px-3 mb-2">Workspace</span>
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'overview' ? 'bg-white/10 text-emerald-400 border border-white/10 shadow-lg shadow-emerald-500/5' : 'text-blue-200/60 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard className="h-4 w-4" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('packages')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'packages' ? 'bg-white/10 text-emerald-400 border border-white/10 shadow-lg shadow-emerald-500/5' : 'text-blue-200/60 hover:text-white hover:bg-white/5'}`}
          >
            <Box className="h-4 w-4" /> Investment Packages
          </button>
          <button 
            onClick={() => setActiveTab('deposit')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'deposit' ? 'bg-white/10 text-emerald-400 border border-white/10 shadow-lg shadow-emerald-500/5' : 'text-blue-200/60 hover:text-white hover:bg-white/5'}`}
          >
            <ArrowDownCircle className="h-4 w-4" /> Deposit System
          </button>
          <button 
            onClick={() => setActiveTab('withdrawal')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'withdrawal' ? 'bg-white/10 text-emerald-400 border border-white/10 shadow-lg shadow-emerald-500/5' : 'text-blue-200/60 hover:text-white hover:bg-white/5'}`}
          >
            <ArrowUpCircle className="h-4 w-4" /> Withdrawal System
          </button>

          <span className="text-[10px] font-extrabold tracking-widest text-blue-200/40 uppercase block px-3 pt-6 mb-2">Statement & details</span>
          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'history' ? 'bg-white/10 text-emerald-400 border border-white/10 shadow-lg shadow-emerald-500/5' : 'text-blue-200/60 hover:text-white hover:bg-white/5'}`}
          >
            <History className="h-4 w-4" /> Transactions History
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'profile' ? 'bg-white/10 text-emerald-400 border border-white/10 shadow-lg shadow-emerald-500/5' : 'text-blue-200/60 hover:text-white hover:bg-white/5'}`}
          >
            <UserCheck className="h-4 w-4" /> My Profile
          </button>
        </nav>

        <div className="pt-6 border-t border-white/10">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/25 text-red-400 text-sm font-semibold rounded-xl border border-red-500/20 transition-all"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Workspace Top Row */}
        <header className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 md:hidden">
            <span className="text-lg font-black text-white cursor-pointer" onClick={onNavigateLanding}>Cashora</span>
          </div>

          <div className="hidden md:block">
            <span className="text-xs font-semibold text-blue-200/40">Live Preview Interactive Dashboard</span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  if (!showNotifMenu) onMarkNotificationsRead();
                }}
                className="p-2 text-blue-200/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition relative"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 h-3.5 w-3.5 bg-red-500 text-[9px] font-black text-white flex items-center justify-center rounded-full border border-slate-900">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-3 glass-panel-heavy w-80 rounded-2xl shadow-2xl p-2 z-50 text-slate-100">
                  <div className="px-3 py-2 border-b border-white/10 flex justify-between items-center text-xs font-bold">
                    <span>In-App Messages</span>
                    <button 
                      onClick={() => {
                        onMarkNotificationsRead();
                        setShowNotifMenu(false);
                      }}
                      className="text-emerald-400 hover:text-emerald-300 transition"
                    >
                      Dismiss all
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto mt-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-blue-200/40 text-center py-6">No notifications logs.</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-2.5 border-b border-white/5 hover:bg-white/5 rounded-lg transition">
                          <strong className="text-xs font-bold text-white block">{n.title}</strong>
                          <p className="text-[11px] text-blue-200/60 leading-normal mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-white block">{user.name}</span>
                <span className="text-[10px] text-blue-200/40 block">{user.email}</span>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60" 
                alt="Avatar" 
                className="h-9 w-9 rounded-full border border-emerald-400 object-cover"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Panels */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Mobile view top tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto md:hidden pb-2 border-b border-white/10">
            {['overview', 'packages', 'deposit', 'withdrawal', 'history', 'profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap capitalize transition-all ${activeTab === tab ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/10' : 'bg-white/5 border border-white/10 text-blue-200/60'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* OVERVIEW PANEL */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Wallet Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl">
                  <span className="text-xs text-blue-200/60 block mb-1">Available Wallet Balance</span>
                  <h2 className="text-3xl font-black text-white">PKR {user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setActiveTab('deposit')} className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 text-xs font-extrabold rounded-lg flex items-center gap-1 transition shadow-md shadow-emerald-500/10">
                      <ArrowDownCircle className="h-3.5 w-3.5" /> Deposit
                    </button>
                    <button onClick={() => setActiveTab('withdrawal')} className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold rounded-lg flex items-center gap-1 border border-white/15 transition shadow-md">
                      <ArrowUpCircle className="h-3.5 w-3.5" /> Cashout
                    </button>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-blue-200/60 block mb-1">Signup Welcome Bonus</span>
                    <h2 className="text-3xl font-black text-white">PKR {user.signup_bonus.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Credited successfully
                  </span>
                </div>

                <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-blue-200/60 block mb-1">Active Packages</span>
                    <h2 className="text-3xl font-black text-white">{userPackages.length} active plans</h2>
                  </div>
                  <button onClick={() => setActiveTab('packages')} className="text-xs text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1 mt-2 transition">
                    Activate plans <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Running plans directory */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="glass-panel p-6 rounded-2xl lg:col-span-8">
                  <h4 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">My Active Yield Portfolios</h4>
                  {userPackages.length === 0 ? (
                    <div className="text-center py-12 text-blue-200/40">
                      <Box className="h-10 w-10 mx-auto mb-3 opacity-20" />
                      <p className="text-sm mb-3">You don't have any yield active right now.</p>
                      <button onClick={() => setActiveTab('packages')} className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-extrabold rounded-lg shadow-lg shadow-emerald-400/10 transition">
                        Browse Investment Packages
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-blue-200/60">
                        <thead>
                          <tr className="border-b border-white/10 text-[10px] font-extrabold uppercase text-blue-200/40">
                            <th className="py-2.5">Package</th>
                            <th className="py-2.5">Invested</th>
                            <th className="py-2.5">Daily Profit</th>
                            <th className="py-2.5">Status</th>
                            <th className="py-2.5">Activated On</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userPackages.map((up, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                              <td className="py-3 font-bold text-white">{up.title}</td>
                              <td className="py-3 text-white">PKR {up.deposit_amount}</td>
                              <td className="py-3 text-emerald-400 font-bold">PKR {up.profit_amount}</td>
                              <td className="py-3"><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold rounded">ACTIVE</span></td>
                              <td className="py-3 text-[10px] text-blue-200/40">{new Date(up.created_at).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Referral module */}
                <div className="glass-panel p-6 rounded-2xl lg:col-span-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-white mb-3 uppercase tracking-wider">Fast Referral Commission</h4>
                    <p className="text-xs text-blue-200/60 leading-relaxed mb-4">
                      Share your custom invitation code. When any referral registers, commission is credited to your balance instantly.
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-200/40 font-semibold block mb-2">My Referral Code</span>
                    <div className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                      <input 
                        type="text" 
                        value={user.referral_code} 
                        readOnly 
                        className="bg-transparent text-xs font-mono text-white flex-1 px-3 py-2.5 border-none focus:outline-none"
                      />
                      <button 
                        onClick={copyReferral}
                        className="px-3 bg-white/10 hover:bg-white/20 border-l border-white/10 text-slate-300 transition"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    {copied && <span className="text-[10px] text-emerald-400 mt-1.5 block">Copied to clipboard!</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PACKAGES PANEL */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="text-center max-w-lg mx-auto mb-8">
                <h3 className="text-2xl font-black text-white">Yield Generator Contracts</h3>
                <p className="text-blue-200/60 text-sm mt-1">Select and buy an investment plan to start receiving daily margins automatically logged inside your ledger.</p>
              </div>

              {pkgSuccess && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 animate-pulse" />
                  <span>{pkgSuccess}</span>
                </div>
              )}
              {pkgError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-xl flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>{pkgError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map(pkg => (
                  <div key={pkg.id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2 text-center">{pkg.title}</h4>
                      <div className="py-5 border-t border-b border-white/10 text-center my-4">
                        <span className="text-[10px] text-blue-200/40 block">Deduction Cost</span>
                        <h2 className="text-2xl font-black text-emerald-400">PKR {pkg.deposit_amount.toLocaleString()}</h2>
                      </div>
                      <ul className="space-y-2 text-xs text-blue-200/60 mb-6">
                        <li className="flex justify-between">
                          <span>Daily Earnings:</span>
                          <strong className="text-white">PKR {pkg.profit_amount.toLocaleString()}</strong>
                        </li>
                        <li className="flex justify-between">
                          <span>Validity:</span>
                          <strong className="text-white">Lifetime contract</strong>
                        </li>
                      </ul>
                    </div>
                    <button
                      onClick={() => handleActivatePkg(pkg.id)}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/10"
                    >
                      Activate Package
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DEPOSIT PANEL */}
          {activeTab === 'deposit' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="glass-panel p-6 rounded-2xl lg:col-span-6">
                <h4 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">Gateway Payment Coordinates</h4>
                <p className="text-xs text-blue-200/60 leading-relaxed mb-6">
                  Please initiate a manual funds transfer of any amount using your mobile wallet to the payment information below. Note recipient name must exactly match our account title.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 text-emerald-400 rounded-lg">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <strong className="text-xs text-white block">Easypaisa Wallet</strong>
                        <span className="text-[10px] text-blue-200/40 font-mono">{settings.easypaisa_number}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/25">Active</span>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 text-blue-400 rounded-lg">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <strong className="text-xs text-white block">JazzCash Wallet</strong>
                        <span className="text-[10px] text-blue-200/40 font-mono">{settings.jazzcash_number}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/25">Active</span>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 text-blue-200/50 rounded-lg">
                        <Landmark className="h-5 w-5" />
                      </div>
                      <div>
                        <strong className="text-xs text-white block">Local Bank IBAN</strong>
                        <span className="text-[10px] text-blue-200/40 font-mono">{settings.bank_account}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/25">Active</span>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-[10px] text-blue-200/40 font-semibold block mb-0.5">Verified Account Title</span>
                  <span className="text-sm font-extrabold text-white">{settings.account_title}</span>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl lg:col-span-6">
                <h4 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">Submit Verification</h4>
                
                {depSuccess && (
                  <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Your deposit request has been submitted. It will be verified by our team within 24 hours.</span>
                  </div>
                )}

                <form onSubmit={handleDepositSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-blue-200/80 block mb-2">Deposit Amount (PKR)</label>
                    <input 
                      type="number" 
                      value={depAmount}
                      onChange={(e) => setDepAmount(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                      placeholder="e.g. 1000"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-200/80 block mb-2">Simulated Receipt Slip Upload</label>
                    <input 
                      type="text" 
                      value={depScreenshot}
                      onChange={(e) => setDepScreenshot(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-blue-100/80 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                      placeholder="Receipt Image URL (Simulated)"
                      required
                    />
                    <span className="text-[10px] text-blue-200/40 block mt-1">In this workspace simulation, you can pass any valid image link.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-extrabold text-sm rounded-xl transition shadow-lg shadow-emerald-500/10"
                  >
                    Submit Screenshot
                  </button>
                </form>

                {/* Submissions queue logs */}
                <div className="mt-8 border-t border-white/10 pt-6">
                  <h5 className="text-xs font-bold text-white mb-4 uppercase">My Verification Logs</h5>
                  {deposits.length === 0 ? (
                    <p className="text-xs text-blue-200/40">No deposits recorded yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {deposits.map(d => (
                        <div key={d.id} className="p-3 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-extrabold text-white">PKR {d.amount.toLocaleString()}</span>
                            <span className="text-[10px] text-blue-200/40 block">{new Date(d.created_at).toLocaleDateString()}</span>
                          </div>
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded ${d.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' : d.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 'bg-red-500/10 text-red-400 border border-red-500/25'}`}>
                            {d.status.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* WITHDRAWAL PANEL */}
          {activeTab === 'withdrawal' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="glass-panel p-6 rounded-2xl lg:col-span-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">Available Wallet Liquidity</h4>
                  <div className="text-center py-8">
                    <span className="text-xs text-blue-200/40 block">Deductible Balance</span>
                    <h2 className="text-4xl font-black text-white mt-1">PKR {user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-xs font-bold text-white block mb-1">Standard Processing Window</span>
                  <p className="text-xs text-blue-200/60 leading-normal mb-0">
                    Withdrawal queries are screened and credited to mobile wallets inside a secure 24-hour cycle. Zero fee structures apply on local transactions.
                  </p>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl lg:col-span-6">
                <h4 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">Cashout Request</h4>
                
                {wthSuccess && (
                  <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Your withdrawal request has been received. It will be processed within 24 hours.</span>
                  </div>
                )}
                {wthError && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{wthError}</span>
                  </div>
                )}

                <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-blue-200/80 block mb-2">Withdrawal Amount (PKR)</label>
                    <input 
                      type="number" 
                      value={wthAmount}
                      onChange={(e) => setWthAmount(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                      placeholder="Min PKR 100"
                      min="100"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-200/80 block mb-2">Transfer Gateway Method</label>
                    <select 
                      value={wthMethod}
                      onChange={(e) => setWthMethod(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all [&>option]:bg-slate-900"
                    >
                      <option value="Easypaisa">Easypaisa Mobile Wallet</option>
                      <option value="JazzCash">JazzCash Mobile Wallet</option>
                      <option value="Bank Account">Bank Wire Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-200/80 block mb-2">Wallet Account Number / IBAN</label>
                    <input 
                      type="text" 
                      value={wthAccount}
                      onChange={(e) => setWthAccount(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                      placeholder="e.g. 03001234567"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-blue-500/10"
                  >
                    Submit Cashout
                  </button>
                </form>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <h5 className="text-xs font-bold text-white mb-4 uppercase">My Withdrawal Logs</h5>
                  {withdrawals.length === 0 ? (
                    <p className="text-xs text-blue-200/40">No payouts requested yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {withdrawals.map(w => (
                        <div key={w.id} className="p-3 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-extrabold text-white">PKR {w.amount.toLocaleString()}</span>
                            <span className="text-[10px] text-blue-200/40 block">{w.method} • {w.account_number}</span>
                          </div>
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded ${w.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' : w.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 'bg-red-500/10 text-red-400 border border-red-500/25'}`}>
                            {w.status.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* HISTORY PANEL */}
          {activeTab === 'history' && (
            <div className="glass-panel p-6 rounded-2xl">
              <h4 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">Ledger Statement Ledger</h4>
              {transactions.length === 0 ? (
                <p className="text-xs text-blue-200/40 py-12 text-center">No statements logged.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-blue-200/60">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] font-extrabold uppercase text-blue-200/40">
                        <th className="py-2.5">Transaction ID</th>
                        <th className="py-2.5">Type</th>
                        <th className="py-2.5">Amount</th>
                        <th className="py-2.5">Description</th>
                        <th className="py-2.5">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(tx => (
                        <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="py-3 font-mono text-blue-200/40">#TX{tx.id.substring(0, 6)}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-blue-200/80 text-[10px] font-bold rounded">
                              {tx.type.toUpperCase()}
                            </span>
                          </td>
                          <td className={`py-3 font-bold ${['deposit', 'bonus', 'earning'].includes(tx.type) ? 'text-emerald-400' : 'text-red-400'}`}>
                            {['deposit', 'bonus', 'earning'].includes(tx.type) ? '+' : '-'} PKR {tx.amount.toLocaleString()}
                          </td>
                          <td className="py-3 text-white">{tx.description}</td>
                          <td className="py-3 text-[10px] text-blue-200/40">{new Date(tx.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* PROFILE PANEL */}
          {activeTab === 'profile' && (
            <div className="glass-panel p-6 rounded-2xl max-w-xl">
              <h4 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">Account Settings</h4>
              
              {profSuccess && (
                <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl">
                  Profile updated successfully.
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-blue-200/80 block mb-2">My Full Name</label>
                  <input 
                    type="text" 
                    value={profName}
                    onChange={(e) => setProfName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-blue-200/80 block mb-2">My Email Address</label>
                  <input 
                    type="email" 
                    value={profEmail}
                    onChange={(e) => setProfEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/10"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
