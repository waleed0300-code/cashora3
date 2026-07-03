import React, { useState } from 'react';
import { 
  User, Package, Deposit, Withdrawal, ContactMessage, PaymentSettings 
} from '../types';
import { 
  ShieldAlert, Users, ArrowDownCircle, ArrowUpCircle, Box, Settings as SettingsIcon, Mail, 
  Trash2, Check, X, Shield, Smartphone, Landmark, CheckCircle2, Award, Search, PlusCircle, Reply
} from 'lucide-react';

interface AdminDashboardProps {
  users: User[];
  packages: Package[];
  deposits: Deposit[];
  withdrawals: Withdrawal[];
  messages: ContactMessage[];
  settings: PaymentSettings;
  onLogout: () => void;
  onNavigateLanding: () => void;
  onApproveDeposit: (id: string) => void;
  onRejectDeposit: (id: string) => void;
  onApproveWithdrawal: (id: string) => void;
  onRejectWithdrawal: (id: string) => void;
  onAdjustBalance: (userId: string, amount: number, type: 'add' | 'deduct') => void;
  onToggleFreeze: (userId: string) => void;
  onAddPackage: (title: string, cost: number, profit: number) => void;
  onDeletePackage: (id: string) => void;
  onUpdateGateways: (easypaisa: string, jazzcash: string, bank: string, title: string) => void;
  onUpdateBranding: (website: string, banner: string, footer: string) => void;
  onReplyMessage: (msgId: string, replyText: string) => void;
}

export default function AdminDashboard({
  users, packages, deposits, withdrawals, messages, settings,
  onLogout, onNavigateLanding, onApproveDeposit, onRejectDeposit, onApproveWithdrawal, onRejectWithdrawal,
  onAdjustBalance, onToggleFreeze, onAddPackage, onDeletePackage, onUpdateGateways, onUpdateBranding, onReplyMessage
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'deposits' | 'withdrawals' | 'packages' | 'settings' | 'inbox'>('overview');

  // Stats calcs
  const totalUsers = users.length;
  const activeUsersCount = users.filter(u => u.status === 'active').length;
  const approvedDepositsSum = deposits.filter(d => d.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0);
  const approvedWithdrawalsSum = withdrawals.filter(w => w.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingDeposits = deposits.filter(d => d.status === 'pending');
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const unreadMessages = messages.filter(m => m.status === 'unread');

  // Adjust Balance state
  const [adjustUserId, setAdjustUserId] = useState('');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustType, setAdjustType] = useState<'add' | 'deduct'>('add');
  const [adjustSuccess, setAdjustSuccess] = useState(false);

  // Search User state
  const [userSearch, setUserSearch] = useState('');

  // Package Creator state
  const [newPkgTitle, setNewPkgTitle] = useState('');
  const [newPkgCost, setNewPkgCost] = useState('');
  const [newPkgProfit, setNewPkgProfit] = useState('');
  const [pkgSuccess, setPkgSuccess] = useState(false);

  // Settings states
  const [easypaisaVal, setEasypaisaVal] = useState(settings.easypaisa_number);
  const [jazzcashVal, setJazzcashVal] = useState(settings.jazzcash_number);
  const [bankVal, setBankVal] = useState(settings.bank_account);
  const [titleVal, setTitleVal] = useState(settings.account_title);
  const [gatewaySuccess, setGatewaySuccess] = useState(false);

  const [websiteVal, setWebsiteVal] = useState(settings.website_name);
  const [bannerVal, setBannerVal] = useState('Smart Investments, Consistent Daily Earnings');
  const [footerVal, setFooterVal] = useState('© 2026 Cashora. All Rights Reserved. Fully Compatible with InfinityFree hosting.');
  const [brandingSuccess, setBrandingSuccess] = useState(false);

  // Message reply states
  const [replyMessageId, setReplyMessageId] = useState('');
  const [quickReplyText, setQuickReplyText] = useState('');

  const handleAdjustBalance = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(adjustAmount);
    if (!adjustUserId || !val || val <= 0) return;
    onAdjustBalance(adjustUserId, val, adjustType);
    setAdjustSuccess(true);
    setAdjustAmount('');
    setTimeout(() => setAdjustSuccess(false), 3000);
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(newPkgCost);
    const profit = parseFloat(newPkgProfit);
    if (!newPkgTitle || !cost || !profit) return;
    onAddPackage(newPkgTitle, cost, profit);
    setPkgSuccess(true);
    setNewPkgTitle('');
    setNewPkgCost('');
    setNewPkgProfit('');
    setTimeout(() => setPkgSuccess(false), 3000);
  };

  const handleSaveGateways = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGateways(easypaisaVal, jazzcashVal, bankVal, titleVal);
    setGatewaySuccess(true);
    setTimeout(() => setGatewaySuccess(false), 3000);
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBranding(websiteVal, bannerVal, footerVal);
    setBrandingSuccess(true);
    setTimeout(() => setBrandingSuccess(false), 3000);
  };

  const handleQuickReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessageId || !quickReplyText) return;
    onReplyMessage(replyMessageId, quickReplyText);
    setReplyMessageId('');
    setQuickReplyText('');
  };

  // Filtered User list
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.referral_code.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen frosted-bg text-slate-100 flex relative">
      {/* Sidebar Layout */}
      <aside className="hidden md:flex flex-col w-64 glass-panel rounded-none border-y-0 border-l-0 border-r border-white/10 p-6 shrink-0">
        <div className="flex items-center gap-2 mb-10 cursor-pointer" onClick={onNavigateLanding}>
          <div className="p-2 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-lg shadow-lg shadow-emerald-500/20">
            <Shield className="h-5 w-5 text-slate-950" />
          </div>
          <span className="text-lg font-black text-white tracking-tight">Cashora Admin</span>
        </div>

        <nav className="space-y-1.5 flex-1">
          <span className="text-[10px] font-extrabold tracking-widest text-blue-200/40 uppercase block px-3 mb-2">System Admin</span>
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition ${activeTab === 'overview' ? 'bg-white/10 text-emerald-300 border border-white/10' : 'text-blue-200/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <ShieldAlert className="h-4 w-4 text-emerald-400" /> Console Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition ${activeTab === 'users' ? 'bg-white/10 text-emerald-300 border border-white/10' : 'text-blue-200/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <Users className="h-4 w-4 text-emerald-400" /> Manage Users
          </button>
          <button 
            onClick={() => setActiveTab('deposits')}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-xl font-semibold text-sm transition ${activeTab === 'deposits' ? 'bg-white/10 text-emerald-300 border border-white/10' : 'text-blue-200/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <div className="flex items-center gap-3">
              <ArrowDownCircle className="h-4 w-4 text-emerald-400" /> Deposits
            </div>
            {pendingDeposits.length > 0 && (
              <span className="h-5 w-5 bg-red-500 text-[10px] font-black text-white flex items-center justify-center rounded-full animate-pulse">
                {pendingDeposits.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('withdrawals')}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-xl font-semibold text-sm transition ${activeTab === 'withdrawals' ? 'bg-white/10 text-emerald-300 border border-white/10' : 'text-blue-200/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <div className="flex items-center gap-3">
              <ArrowUpCircle className="h-4 w-4 text-emerald-400" /> Withdrawals
            </div>
            {pendingWithdrawals.length > 0 && (
              <span className="h-5 w-5 bg-amber-500 text-[10px] font-black text-slate-950 flex items-center justify-center rounded-full animate-pulse">
                {pendingWithdrawals.length}
              </span>
            )}
          </button>

          <span className="text-[10px] font-extrabold tracking-widest text-blue-200/40 uppercase block px-3 pt-6 mb-2">Design & database</span>
          <button 
            onClick={() => setActiveTab('packages')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition ${activeTab === 'packages' ? 'bg-white/10 text-emerald-300 border border-white/10' : 'text-blue-200/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <Box className="h-4 w-4 text-emerald-400" /> Packages Setup
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition ${activeTab === 'settings' ? 'bg-white/10 text-emerald-300 border border-white/10' : 'text-blue-200/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <SettingsIcon className="h-4 w-4 text-emerald-400" /> Web settings
          </button>
          <button 
            onClick={() => setActiveTab('inbox')}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-xl font-semibold text-sm transition ${activeTab === 'inbox' ? 'bg-white/10 text-emerald-300 border border-white/10' : 'text-blue-200/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-emerald-400" /> Inbox
            </div>
            {unreadMessages.length > 0 && (
              <span className="h-5 w-5 bg-blue-500 text-[10px] font-black text-white flex items-center justify-center rounded-full">
                {unreadMessages.length}
              </span>
            )}
          </button>
        </nav>

        <div className="pt-6 border-t border-white/10">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold rounded-xl transition border border-red-500/20"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/10 glass-panel-light sticky top-0 z-40 px-6 flex items-center justify-between rounded-none">
          <div className="flex items-center gap-4 md:hidden">
            <span className="text-lg font-black text-white cursor-pointer" onClick={onNavigateLanding}>Cashora Admin</span>
          </div>

          <div className="hidden md:block">
            <span className="text-xs font-semibold text-blue-200/60">Live Preview Interactive System Administration Panel</span>
          </div>

          <div className="ml-auto">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1 shadow-sm">
              <Shield className="h-3 w-3 animate-pulse" /> Root access enabled
            </span>
          </div>
        </header>

        {/* Console Panels */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Mobile view tabs */}
          <div className="flex gap-2 mb-2 overflow-x-auto md:hidden pb-3 border-b border-white/10">
            {['overview', 'users', 'deposits', 'withdrawals', 'packages', 'settings', 'inbox'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap capitalize transition ${activeTab === tab ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black shadow-md' : 'bg-white/5 border border-white/10 text-blue-200/60'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* OVERVIEW PANEL */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-panel p-6 rounded-2xl">
                  <span className="text-xs text-blue-200/40 block mb-1">Total Registered Users</span>
                  <h3 className="text-2xl font-black text-white">{totalUsers} users</h3>
                  <span className="text-xs text-emerald-400 font-semibold block mt-1">● {activeUsersCount} Active</span>
                </div>

                <div className="glass-panel p-6 rounded-2xl">
                  <span className="text-xs text-blue-200/40 block mb-1">Total Net Deposits Sum</span>
                  <h3 className="text-2xl font-black text-emerald-400">PKR {approvedDepositsSum.toLocaleString()}</h3>
                  <span className="text-xs text-blue-200/40 block mt-1">{pendingDeposits.length} pending validation</span>
                </div>

                <div className="glass-panel p-6 rounded-2xl">
                  <span className="text-xs text-blue-200/40 block mb-1">Total Payouts Approved</span>
                  <h3 className="text-2xl font-black text-blue-400 font-mono">PKR {approvedWithdrawalsSum.toLocaleString()}</h3>
                  <span className="text-xs text-blue-200/40 block mt-1">{pendingWithdrawals.length} pending verification</span>
                </div>

                <div className="glass-panel p-6 rounded-2xl">
                  <span className="text-xs text-blue-200/40 block mb-1">Support messages</span>
                  <h3 className="text-2xl font-black text-white">{messages.length} inquiries</h3>
                  <span className="text-xs text-amber-400 font-semibold block mt-1">● {unreadMessages.length} unread</span>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Fast verification deposit */}
                <div className="glass-panel p-6 rounded-2xl lg:col-span-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Fast Deposits Approval</h4>
                      <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-bold rounded border border-red-500/20">{pendingDeposits.length} Pending</span>
                    </div>

                    {pendingDeposits.length === 0 ? (
                      <p className="text-xs text-blue-200/40 text-center py-12">No pending deposits verification.</p>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {pendingDeposits.map(d => (
                          <div key={d.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center text-xs">
                            <div>
                              <strong className="text-white block">{d.user_name}</strong>
                              <span className="text-[10px] text-blue-200/40 block">PKR {d.amount}</span>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => onApproveDeposit(d.id)} className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/25 rounded border border-emerald-500/20 transition-colors"><Check className="h-3.5 w-3.5" /></button>
                              <button onClick={() => onRejectDeposit(d.id)} className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/25 rounded border border-red-500/20 transition-colors"><X className="h-3.5 w-3.5" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Fast withdrawal approval */}
                <div className="glass-panel p-6 rounded-2xl lg:col-span-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Fast Cashout Processing</h4>
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded border border-amber-500/20">{pendingWithdrawals.length} Pending</span>
                    </div>

                    {pendingWithdrawals.length === 0 ? (
                      <p className="text-xs text-blue-200/40 text-center py-12">No pending withdrawals.</p>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {pendingWithdrawals.map(w => (
                          <div key={w.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center text-xs">
                            <div>
                              <strong className="text-white block">{w.user_name}</strong>
                              <span className="text-[10px] text-blue-200/40 block">{w.method} • {w.account_number} • PKR {w.amount}</span>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => onApproveWithdrawal(w.id)} className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/25 rounded border border-emerald-500/20 transition-colors"><Check className="h-3.5 w-3.5" /></button>
                              <button onClick={() => onRejectWithdrawal(w.id)} className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/25 rounded border border-red-500/20 transition-colors"><X className="h-3.5 w-3.5" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MANAGE USERS PANEL */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Wallet adjustment tool and Users list */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="glass-panel p-6 rounded-2xl lg:col-span-4">
                  <h4 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">Balance Adjustment Console</h4>
                  
                  {adjustSuccess && (
                    <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl">
                      Wallet adjustment complete.
                    </div>
                  )}

                  <form onSubmit={handleAdjustBalance} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-blue-200/80 block mb-2">Target User Account</label>
                      <select 
                        value={adjustUserId}
                        onChange={(e) => setAdjustUserId(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all [&>option]:bg-slate-900"
                        required
                      >
                        <option value="">-- Choose User --</option>
                        {users.filter(u => u.role === 'user').map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-blue-200/80 block mb-2">Adjustment Mode</label>
                      <select 
                        value={adjustType}
                        onChange={(e) => setAdjustType(e.target.value as any)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all [&>option]:bg-slate-900"
                      >
                        <option value="add">Add Balance (+)</option>
                        <option value="deduct">Deduct Balance (-)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-blue-200/80 block mb-2">Amount (PKR)</label>
                      <input 
                        type="number" 
                        value={adjustAmount}
                        onChange={(e) => setAdjustAmount(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                        placeholder="e.g. 500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-350 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/10"
                    >
                      Process Adjustment
                    </button>
                  </form>
                </div>

                <div className="glass-panel p-6 rounded-2xl lg:col-span-8 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
                      <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">User Directory Registry</h4>
                      <div className="relative bg-white/5 border border-white/10 rounded-xl flex items-center px-3 py-1">
                        <Search className="h-4 w-4 text-blue-200/40 me-2" />
                        <input 
                          type="text" 
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          className="bg-transparent text-xs text-white border-none focus:outline-none py-1.5 placeholder-white/20"
                          placeholder="Search users..."
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-blue-200/60">
                        <thead>
                          <tr className="border-b border-white/10 text-[10px] font-extrabold uppercase text-blue-200/40">
                            <th className="py-2.5">User Details</th>
                            <th className="py-2.5">Email</th>
                            <th className="py-2.5">Balance</th>
                            <th className="py-2.5">Status</th>
                            <th className="py-2.5">Commission Code</th>
                            <th className="py-2.5">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map(usr => (
                            <tr key={usr.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 font-bold text-white">{usr.name} {usr.role === 'admin' ? '🛡️' : ''}</td>
                              <td className="py-3 text-blue-200/80">{usr.email}</td>
                              <td className="py-3 font-bold text-white">PKR {usr.balance.toLocaleString()}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded ${usr.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                  {usr.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-3 font-mono text-blue-200/40">{usr.referral_code}</td>
                              <td className="py-3">
                                {usr.role !== 'admin' && (
                                  <button
                                    onClick={() => onToggleFreeze(usr.id)}
                                    className={`px-2.5 py-1 text-[10px] font-bold rounded border transition ${usr.status === 'active' ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'}`}
                                  >
                                    {usr.status === 'active' ? 'Freeze' : 'Unfreeze'}
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DEPOSITS VERIFICATION */}
          {activeTab === 'deposits' && (
            <div className="glass-panel p-6 rounded-2xl">
              <h4 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">Deposits Verification Ledger</h4>
              {deposits.length === 0 ? (
                <p className="text-xs text-blue-200/40 text-center py-12">No deposits registered in database logs.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-blue-200/60">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] font-extrabold uppercase text-blue-200/40">
                        <th className="py-2.5">User Name</th>
                        <th className="py-2.5">Email</th>
                        <th className="py-2.5">Amount Submitted</th>
                        <th className="py-2.5">Receipt Slip</th>
                        <th className="py-2.5">Date</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deposits.map(dep => (
                        <tr key={dep.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 font-bold text-white">{dep.user_name}</td>
                          <td className="py-3 text-blue-200/80">{dep.user_email}</td>
                          <td className="py-3 font-bold text-white">PKR {dep.amount.toLocaleString()}</td>
                          <td className="py-3">
                            <a href={dep.screenshot} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 hover:text-emerald-300 underline font-semibold">
                              View Slip Receipt
                            </a>
                          </td>
                          <td className="py-3 text-blue-200/40">{new Date(dep.created_at).toLocaleString()}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded ${dep.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' : dep.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 'bg-red-500/10 text-red-400 border border-red-500/25'}`}>
                              {dep.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3">
                            {dep.status === 'pending' && (
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => onApproveDeposit(dep.id)} 
                                  className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-350 hover:to-teal-400 text-slate-950 font-bold text-[10px] rounded shadow-md cursor-pointer transition-all"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => onRejectDeposit(dep.id)} 
                                  className="px-2.5 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 font-bold text-[10px] rounded transition-all"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* WITHDRAWALS VERIFICATION */}
          {activeTab === 'withdrawals' && (
            <div className="glass-panel p-6 rounded-2xl">
              <h4 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">Withdrawals Verification Ledger</h4>
              {withdrawals.length === 0 ? (
                <p className="text-xs text-blue-200/40 text-center py-12">No withdrawals requested in database logs.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-blue-200/60">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] font-extrabold uppercase text-blue-200/40">
                        <th className="py-2.5">User Name</th>
                        <th className="py-2.5">Email</th>
                        <th className="py-2.5">Amount Requested</th>
                        <th className="py-2.5">Payout Method</th>
                        <th className="py-2.5">Account number</th>
                        <th className="py-2.5">Date</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map(wth => (
                        <tr key={wth.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 font-bold text-white">{wth.user_name}</td>
                          <td className="py-3 text-blue-200/80">{wth.user_email}</td>
                          <td className="py-3 font-bold text-white">PKR {wth.amount.toLocaleString()}</td>
                          <td className="py-3 font-semibold text-blue-400">{wth.method}</td>
                          <td className="py-3 font-mono text-blue-200/80">{wth.account_number}</td>
                          <td className="py-3 text-blue-200/40">{new Date(wth.created_at).toLocaleString()}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded ${wth.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' : wth.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 'bg-red-500/10 text-red-400 border border-red-500/25'}`}>
                              {wth.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3">
                            {wth.status === 'pending' && (
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => onApproveWithdrawal(wth.id)} 
                                  className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-350 hover:to-teal-400 text-slate-950 font-bold text-[10px] rounded shadow-md cursor-pointer transition-all"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => onRejectWithdrawal(wth.id)} 
                                  className="px-2.5 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 font-bold text-[10px] rounded transition-all"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* PACKAGES SETUP */}
          {activeTab === 'packages' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="glass-panel p-6 rounded-2xl lg:col-span-5">
                <h4 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">Launch New Yield Plan</h4>
                
                {pkgSuccess && (
                  <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl">
                    New investment plan created successfully.
                  </div>
                )}

                <form onSubmit={handleCreatePackage} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-blue-200/80 block mb-2">Package Name / Title</label>
                    <input 
                      type="text" 
                      value={newPkgTitle}
                      onChange={(e) => setNewPkgTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                      placeholder="e.g. Diamond Plan"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-200/80 block mb-2">Deposit Required (PKR)</label>
                    <input 
                      type="number" 
                      value={newPkgCost}
                      onChange={(e) => setNewPkgCost(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                      placeholder="3000"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-200/80 block mb-2">Daily Profit Yield (PKR)</label>
                    <input 
                      type="number" 
                      value={newPkgProfit}
                      onChange={(e) => setNewPkgProfit(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                      placeholder="800"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-350 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/10"
                  >
                    Launch Yield Plan
                  </button>
                </form>
              </div>

              <div className="glass-panel p-6 rounded-2xl lg:col-span-7 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">Yield Plans Database</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-blue-200/60">
                      <thead>
                        <tr className="border-b border-white/10 text-[10px] font-extrabold uppercase text-blue-200/40">
                          <th className="py-2.5">Title</th>
                          <th className="py-2.5">Deposit Amount</th>
                          <th className="py-2.5">Daily Profit</th>
                          <th className="py-2.5">Status</th>
                          <th className="py-2.5">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {packages.map(pkg => (
                          <tr key={pkg.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 font-bold text-white">{pkg.title}</td>
                            <td className="py-3 text-white">PKR {pkg.deposit_amount}</td>
                            <td className="py-3 text-emerald-400 font-bold">PKR {pkg.profit_amount}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold rounded">ENABLED</span>
                            </td>
                            <td className="py-3">
                              <button 
                                onClick={() => onDeletePackage(pkg.id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BRANDING & WEB SETTINGS */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="glass-panel p-6 rounded-2xl lg:col-span-6">
                <h4 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">Gateway payment configurations</h4>
                
                {gatewaySuccess && (
                  <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl">
                    Payment details updated.
                  </div>
                )}

                <form onSubmit={handleSaveGateways} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-blue-200/80 block mb-2">Easypaisa Recipient Number</label>
                    <input 
                      type="text" 
                      value={easypaisaVal}
                      onChange={(e) => setEasypaisaVal(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-200/80 block mb-2">JazzCash Recipient Number</label>
                    <input 
                      type="text" 
                      value={jazzcashVal}
                      onChange={(e) => setJazzcashVal(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-200/80 block mb-2">Bank Account IBAN</label>
                    <input 
                      type="text" 
                      value={bankVal}
                      onChange={(e) => setBankVal(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-200/80 block mb-2">Verified Account Title</label>
                    <input 
                      type="text" 
                      value={titleVal}
                      onChange={(e) => setTitleVal(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-350 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/10"
                  >
                    Save payment coordinates
                  </button>
                </form>
              </div>

              <div className="glass-panel p-6 rounded-2xl lg:col-span-6">
                <h4 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">Branding & Visual settings</h4>
                
                {brandingSuccess && (
                  <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl">
                    Website branding details saved.
                  </div>
                )}

                <form onSubmit={handleSaveBranding} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-blue-200/80 block mb-2">Platform Name</label>
                    <input 
                      type="text" 
                      value={websiteVal}
                      onChange={(e) => setWebsiteVal(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-200/80 block mb-2">Homepage Hero Header</label>
                    <input 
                      type="text" 
                      value={bannerVal}
                      onChange={(e) => setBannerVal(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-200/80 block mb-2">Footer Copyright notice</label>
                    <input 
                      type="text" 
                      value={footerVal}
                      onChange={(e) => setFooterVal(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl transition shadow-lg shadow-blue-500/10"
                  >
                    Save branding Details
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* INBOX SUPPORT PANEL */}
          {activeTab === 'inbox' && (
            <div className="glass-panel p-6 rounded-2xl">
              <h4 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">Customer Support Messages</h4>
              
              {messages.length === 0 ? (
                <p className="text-xs text-blue-200/40 text-center py-12">Support inbox is empty.</p>
              ) : (
                <div className="space-y-4">
                  {messages.map(msg => (
                    <div key={msg.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-sm font-bold text-white block">{msg.name}</strong>
                          <span className="text-xs text-blue-200/40 font-mono block">{msg.email} • {new Date(msg.created_at).toLocaleString()}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full ${msg.status === 'unread' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                          {msg.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="border-t border-white/10 pt-3">
                        <strong className="text-xs text-white block mb-1">Subject: {msg.subject}</strong>
                        <p className="text-xs text-blue-200/60 leading-relaxed mb-0">{msg.message}</p>
                      </div>

                      {msg.reply ? (
                        <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                          <strong className="text-xs text-emerald-400 block mb-1">Reply Logged:</strong>
                          <p className="text-xs text-blue-200/80 mb-0 italic">"{msg.reply}"</p>
                        </div>
                      ) : (
                        <div className="border-t border-white/10 pt-3">
                          {replyMessageId === msg.id ? (
                            <form onSubmit={handleQuickReply} className="flex gap-2">
                              <input 
                                type="text" 
                                value={quickReplyText}
                                onChange={(e) => setQuickReplyText(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/20 flex-1 focus:outline-none focus:border-emerald-400"
                                placeholder="Type support response..."
                                required
                              />
                              <button type="submit" className="px-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 shadow">
                                <Reply className="h-3 w-3" /> Reply
                              </button>
                            </form>
                          ) : (
                            <button 
                              onClick={() => {
                                setReplyMessageId(msg.id);
                                setQuickReplyText('');
                              }}
                              className="text-xs text-emerald-400 hover:text-emerald-350 font-bold inline-flex items-center gap-1 transition-colors"
                            >
                              <Reply className="h-3 w-3" /> Send Response
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
