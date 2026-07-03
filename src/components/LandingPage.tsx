import React, { useState } from 'react';
import { Wallet, Gift, Bolt, ShieldAlert, Award, ChevronDown, MessageSquare, Phone, MapPin, Send, Download, FileCode, CheckCircle2 } from 'lucide-react';
import { Package, ContactMessage } from '../types';

interface LandingPageProps {
  packages: Package[];
  onNavigate: (page: 'login' | 'register' | 'dashboard' | 'admin') => void;
  isLoggedIn: boolean;
  userRole?: 'user' | 'admin';
  onAddContact: (msg: Omit<ContactMessage, 'id' | 'created_at' | 'status'>) => void;
}

export default function LandingPage({ packages, onNavigate, isLoggedIn, userRole, onAddContact }: LandingPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [showExportModal, setShowExportModal] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;
    onAddContact({ name, email, subject, message });
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const faqs = [
    {
      q: "What is Cashora?",
      a: "Cashora is a premium online earning and high-yield investment platform. Users activate small, highly structured yield plans to receive passive daily dividends directly into their wallet balances."
    },
    {
      q: "What are the minimum deposit and withdrawal amounts?",
      a: "The minimum starter plan is PKR 300, which pays PKR 50 profit. Withdrawals can be requested for any amount starting at PKR 100 with zero delay."
    },
    {
      q: "Are my earnings guaranteed?",
      a: "Yes, our structures are backed by steady high-yield reserve pipelines. All withdrawals are processed automatically and completed within 24 hours directly to your mobile wallets."
    },
    {
      q: "How does the PKR 150 Signup Bonus work?",
      a: "As soon as you complete your registration, the system automatically credits a welcome bonus of PKR 150 to your available wallet balance. This balance can be used to purchase and activate investment packages."
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-900 relative">
      {/* Dynamic Header */}
      <nav className="sticky top-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="p-2 bg-gradient-to-tr from-emerald-500 to-blue-600 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">Cashora</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition">Features</a>
              <a href="#packages" className="text-sm font-medium text-slate-400 hover:text-white transition">Packages</a>
              <a href="#faq" className="text-sm font-medium text-slate-400 hover:text-white transition">FAQ</a>
              <a href="#contact" className="text-sm font-medium text-slate-400 hover:text-white transition">Contact</a>
              <button 
                onClick={() => setShowExportModal(true)} 
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-full border border-emerald-500/20 transition"
              >
                <Download className="h-3.5 w-3.5" /> InfinityFree PHP Code
              </button>
            </div>

            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <button
                  onClick={() => onNavigate(userRole === 'admin' ? 'admin' : 'dashboard')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-blue-600/20 transition"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('login')}
                    className="px-4 py-2 text-slate-400 hover:text-white text-sm font-semibold transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => onNavigate('register')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/20 transition"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        {/* Mesh Decorative Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-400/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-400/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/25 mb-4">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Official Earning Engine is Online
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                Smart Investments, Consistent <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Daily Earnings</span>
              </h1>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-xl">
                Join Cashora to unlock automated earnings with guaranteed daily returns. Submit deposits and receive fast payouts directly through Easypaisa, JazzCash, and local banks.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('register')}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-base rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  Start Earning with PKR 150 Bonus
                </button>
                <a
                  href="#packages"
                  className="inline-flex items-center justify-center px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-base rounded-xl border border-slate-700 hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  View Yield Plans
                </a>
              </div>

              {/* Counter details */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-800 text-center sm:text-left">
                <div>
                  <h4 className="text-2xl font-extrabold text-white">5,200+</h4>
                  <p className="text-xs text-slate-400">Paying Users</p>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-emerald-400">PKR 4.5M+</h4>
                  <p className="text-xs text-slate-400">Total Profit Paid</p>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-blue-400">99.9%</h4>
                  <p className="text-xs text-slate-400">Instant Success Rate</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center relative z-10">
              {/* Glassmorphism Presentation UI Card */}
              <div className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl relative">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-xs text-blue-200/60 block mb-0.5">Wallet Balance</span>
                    <h3 className="text-3xl font-black text-white">PKR 15,250.00</h3>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded border border-white/15">
                    Active
                  </span>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-blue-200/80">Gold Package Yield</span>
                    <span className="text-xs font-bold text-emerald-400">PKR 800 Daily</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-2 rounded-full w-[72%]"></div>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[10px] text-blue-200/40">
                    <span>Activated 2 days ago</span>
                    <span>Payout: 24h cycle</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 text-center">
                    <Bolt className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                    <span className="text-[10px] text-blue-200/50 block">Total Earnings</span>
                    <span className="text-xs font-extrabold text-white">PKR 1,600</span>
                  </div>
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 text-center">
                    <Gift className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                    <span className="text-[10px] text-blue-200/50 block">Signup Welcome</span>
                    <span className="text-xs font-extrabold text-white">PKR 150</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs font-extrabold tracking-widest text-emerald-400 uppercase">Premium Features</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">Engineered For Fast Returns</h2>
            <p className="text-blue-200/60 max-w-lg mx-auto mt-3">We have removed friction and built a powerful, responsive, and secure digital vault.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-2xl hover:scale-[1.02] transition-all">
              <div className="h-12 w-12 bg-white/10 border border-white/20 text-emerald-400 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <Gift className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Instant Welcome Bonus</h4>
              <p className="text-blue-200/70 text-sm leading-relaxed">
                Register inside Cashora and claim PKR 150 signup bonus automatically added to your available balance. Test our workflow immediately.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl hover:scale-[1.02] transition-all">
              <div className="h-12 w-12 bg-white/10 border border-white/20 text-blue-400 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <Bolt className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Easypaisa & JazzCash Integrated</h4>
              <p className="text-blue-200/70 text-sm leading-relaxed">
                Deposit and request withdrawals using Pakistan's standard mobile money channels. No credit card required. Payouts complete inside 24 hours.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl hover:scale-[1.02] transition-all">
              <div className="h-12 w-12 bg-white/10 border border-white/20 text-amber-400 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">PDO Security Protections</h4>
              <p className="text-blue-200/70 text-sm leading-relaxed">
                Our InfinityFree-compatible PHP source code uses standard secure PDO prepared statements, hashing, and CSRF filters to enforce database integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Packages Section */}
      <section id="packages" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-extrabold tracking-widest text-blue-400 uppercase">Yield Packages</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">Unlock Your Earning Plan</h2>
            <p className="text-slate-400 max-w-lg mx-auto mt-3">Select a yield contract. Once activated, the package produces fixed daily profits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {packages.map((pkg) => (
              <div 
                key={pkg.id} 
                className="glass-panel p-6 rounded-3xl flex flex-col justify-between hover:scale-[1.02] hover:border-white/35 transition-all shadow-lg"
              >
                <div>
                  <h4 className="text-xl font-bold text-white mb-2 text-center">{pkg.title}</h4>
                  <div className="py-6 border-t border-b border-white/10 text-center my-4">
                    <span className="text-xs text-blue-200/50 block">Purchase Cost</span>
                    <h2 className="text-3xl font-black text-emerald-400 font-mono">PKR {pkg.deposit_amount.toLocaleString()}</h2>
                  </div>
                  <ul className="space-y-3 mb-6 text-sm">
                    <li className="flex justify-between text-blue-100/70">
                      <span>Daily Returns:</span>
                      <strong className="text-emerald-300 font-mono">PKR {pkg.profit_amount.toLocaleString()}</strong>
                    </li>
                    <li className="flex justify-between text-blue-100/70">
                      <span>Plan Validity:</span>
                      <strong className="text-white">Lifetime Earning</strong>
                    </li>
                    <li className="flex justify-between text-blue-100/70">
                      <span>Activation Speed:</span>
                      <strong className="text-white">Instant</strong>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => onNavigate('register')}
                  className="w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl transition shadow-lg shadow-emerald-500/10"
                >
                  Activate Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-950/40 border-t border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-extrabold tracking-widest text-emerald-400 uppercase">Getting Started</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">Passive Earnings In 3 Steps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            <div className="p-6 relative">
              <div className="text-5xl font-black text-slate-800 mb-4 select-none">01</div>
              <h5 className="text-lg font-bold text-white mb-2">Create Free Account</h5>
              <p className="text-slate-400 text-sm leading-relaxed">
                Register on Cashora to get your free account and PKR 150 Signup Bonus instantly credited in your wallet.
              </p>
            </div>

            <div className="p-6 relative">
              <div className="text-5xl font-black text-slate-800 mb-4 select-none">02</div>
              <h5 className="text-lg font-bold text-white mb-2">Deposit Balance</h5>
              <p className="text-slate-400 text-sm leading-relaxed">
                Send deposit to our Easypaisa or JazzCash details, upload screenshot, and wait for instant approval.
              </p>
            </div>

            <div className="p-6 relative">
              <div className="text-5xl font-black text-slate-800 mb-4 select-none">03</div>
              <h5 className="text-lg font-bold text-white mb-2">Activate & Cashout</h5>
              <p className="text-slate-400 text-sm leading-relaxed">
                Pick your preferred package and click Activate. Accumulate daily profit yields and cash out safely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 relative overflow-hidden">
        <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs font-extrabold tracking-widest text-blue-400 uppercase">Support</span>
            <h2 className="text-3xl font-black text-white mt-2">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-panel-light rounded-2xl overflow-hidden hover:bg-white/5 transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-6 text-left font-semibold text-white hover:bg-white/5 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-blue-200/50 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-6 pt-0 text-blue-100/70 border-t border-white/5 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support Form Section */}
      <section id="contact" className="py-20 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-extrabold tracking-widest text-emerald-400 uppercase">Get in Touch</span>
              <h2 className="text-3xl font-black text-white mt-2 mb-6">Contact Support</h2>
              <p className="text-blue-200/60 text-sm leading-relaxed mb-8">
                Do you have questions about payment screenshot approvals, custom packages, or withdrawal validation? Our support team responds inside 12 hours.
              </p>

              <div className="space-y-4 text-sm text-blue-100/80">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/10 border border-white/20 text-emerald-400 rounded-lg">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <span>support@cashora.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/10 border border-white/20 text-blue-400 rounded-lg">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span>+92 300 1234567</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 border border-white/10 text-blue-200/50 rounded-lg">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span>Karachi, Pakistan</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl">
                {submitted && (
                  <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Your support message has been sent successfully. We will reply to your email shortly.</span>
                  </div>
                )}
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-blue-200/80 block mb-2">Your Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-blue-200/80 block mb-2">Your Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                        placeholder="name@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-blue-200/80 block mb-2">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                      placeholder="Inquiry topic"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-blue-200/80 block mb-2">Your Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 focus:bg-white/10 transition-all"
                      placeholder="Type your message here..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl transition shadow-lg shadow-emerald-500/10"
                  >
                    <Send className="h-4 w-4" /> Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/5 py-12 border-t border-white/10 mt-auto text-sm text-blue-200/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/10 border border-white/20 rounded-md">
                <Wallet className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="font-extrabold text-white">Cashora</span>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" class="hover:text-white transition">Terms & Conditions</a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <span>© 2026 Cashora. All Rights Reserved. Fully Compatible with InfinityFree hosting.</span>
            <span>Designed for PHP 8 & MySQL</span>
          </div>
        </div>
      </footer>

      {/* Export Code Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Cashora PHP & MySQL Source Exporter</h3>
              </div>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-blue-200/60 hover:text-white text-sm font-semibold"
              >
                Close
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[450px] overflow-y-auto bg-slate-950/40">
              <p className="text-blue-100/80 text-sm">
                The entire compliant codebase for <strong>Cashora</strong> has been generated in your workspace root directory! You can run, edit, or copy these files directly.
              </p>
              
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                <strong className="text-white text-xs block mb-1">Files Generated & Ready:</strong>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-blue-200/50">
                  <span>📂 /database/schema.sql</span>
                  <span>📂 /config/db.php</span>
                  <span>📂 /classes/User.php</span>
                  <span>📂 /classes/Package.php</span>
                  <span>📂 /classes/Deposit.php</span>
                  <span>📂 /classes/Withdrawal.php</span>
                  <span>📂 /classes/Notification.php</span>
                  <span>📂 /classes/Transaction.php</span>
                  <span>📂 /classes/Settings.php</span>
                  <span>📂 /classes/Contact.php</span>
                  <span>📂 index.php</span>
                  <span>📂 login.php</span>
                  <span>📂 register.php</span>
                  <span>📂 dashboard.php</span>
                  <span>📂 admin.php</span>
                  <span>📂 .htaccess</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-500/15 border border-white/10 text-emerald-300 rounded-2xl">
                <h5 className="font-bold text-sm mb-1">🚀 How to Deploy on InfinityFree:</h5>
                <ol className="list-decimal list-inside space-y-1 text-xs text-blue-100/80">
                  <li>Create a free account on <strong>InfinityFree Hosting</strong>.</li>
                  <li>Create a new MySQL Database from the InfinityFree Control Panel.</li>
                  <li>Open <strong>phpMyAdmin</strong> and import the SQL file: <code>/database/schema.sql</code>.</li>
                  <li>Configure database credentials inside <code>/config/db.php</code>.</li>
                  <li>Upload all files directly to the <code>htdocs/</code> folder using the online File Manager or FTP (FileZilla).</li>
                  <li>That's it! Cashora is 100% live on your custom sub-domain.</li>
                </ol>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <button 
                onClick={() => setShowExportModal(false)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl transition border border-white/10"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
