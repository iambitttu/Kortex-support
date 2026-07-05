import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bot, Mail, Lock, Shield, Key, User, Plus, Check } from 'lucide-react';

export const Auth: React.FC = () => {
  const { setCurrentPage, currentUser, setCurrentUser, currentOrg, setCurrentOrg, organizationMembers, inviteMember } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('admin@acme.com');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Sarah Connor');
  const [orgName, setOrgName] = useState(currentOrg);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Agent');
  const [step, setStep] = useState<'form' | 'otp' | 'profile'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Simulate direct entry
      setCurrentUser({
        email,
        name: email === 'admin@acme.com' ? 'Sarah Connor' : 'New Agent',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        organization: orgName,
        role: 'Admin',
      });
      setCurrentOrg(orgName);
      setCurrentPage('dashboard');
    } else {
      // Go to OTP step for signup verification
      setStep('otp');
    }
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length === 6) {
      setCurrentUser({
        email,
        name,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        organization: orgName,
        role: 'Admin',
      });
      setCurrentOrg(orgName);
      setStep('profile');
    }
  };

  const handleMagicLink = () => {
    setMagicLinkSent(true);
    setTimeout(() => {
      setMagicLinkSent(false);
      setCurrentUser({
        email,
        name: 'Sarah Connor',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        organization: orgName,
        role: 'Admin',
      });
      setCurrentPage('dashboard');
    }, 2000);
  };

  const handleSocialLogin = (provider: string) => {
    // Mock login redirect
    setCurrentUser({
      email: `user@${provider.toLowerCase()}.com`,
      name: `${provider} Integrator`,
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      organization: 'Global Team',
      role: 'Supervisor',
    });
    setCurrentOrg('Global Team');
    setCurrentPage('dashboard');
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    inviteMember(inviteEmail, inviteRole);
    setInviteEmail('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center py-12 px-6 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Brand logo header */}
      <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => setCurrentPage('landing')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Kortex <span className="text-indigo-400 font-medium">Support</span>
        </span>
      </div>

      {step === 'form' && (
        <div className="w-full max-w-[440px] glass rounded-3xl border border-white/10 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-white">
              {isLogin ? 'Welcome Back' : 'Create Organization'}
            </h2>
            <p className="text-xs text-slate-400">
              {isLogin ? 'Sign in to access your platform console' : 'Start your 14-day free support trial'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Sarah Connor" 
                      value={name} 
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Organization Name</label>
                  <div className="relative">
                    <Shield className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Acme Corp" 
                      value={orgName} 
                      onChange={e => setOrgName(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  placeholder="admin@acme.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Password</label>
                  <a href="#" className="text-[10px] text-indigo-400 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                    required
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:shadow-lg hover:shadow-indigo-500/20 text-white font-semibold rounded-xl text-sm transition-all hover:scale-[1.01] mt-4"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          {/* Magic Link */}
          {isLogin && (
            <button
              onClick={handleMagicLink}
              disabled={magicLinkSent}
              className={`w-full py-2.5 rounded-xl border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors ${
                magicLinkSent ? 'text-green-400 border-green-500/30 bg-green-500/5' : 'text-slate-300'
              }`}
            >
              <Key className="w-4 h-4" /> 
              {magicLinkSent ? 'Magic link sent! Redirecting...' : 'Send Magic Sign-In Link'}
            </button>
          )}

          {/* Social Logins */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-[10px] uppercase font-bold tracking-widest text-slate-500">Or continue with</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => handleSocialLogin('Google')}
              className="py-2 px-4 glass border border-white/10 rounded-xl flex justify-center hover:bg-white/5 transition-colors text-[10px] font-bold text-red-400"
            >
              Google
            </button>
            <button 
              onClick={() => handleSocialLogin('GitHub')}
              className="py-2 px-4 glass border border-white/10 rounded-xl flex justify-center hover:bg-white/5 transition-colors text-[10px] font-bold text-slate-100"
            >
              GitHub
            </button>
            <button 
              onClick={() => handleSocialLogin('Microsoft')}
              className="py-2 px-4 glass border border-white/10 rounded-xl flex justify-center hover:bg-white/5 transition-colors text-[10px] font-bold text-blue-400"
            >
              Microsoft
            </button>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button onClick={() => setIsLogin(false)} className="text-indigo-400 hover:underline font-semibold">
                  Create one now
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setIsLogin(true)} className="text-indigo-400 hover:underline font-semibold">
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {step === 'otp' && (
        <div className="w-full max-w-[440px] glass rounded-3xl border border-white/10 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Enter OTP Code</h2>
            <p className="text-xs text-slate-400">
              We sent a 6-digit verification code to <span className="text-white font-medium">{email}</span>.
            </p>
          </div>

          <form onSubmit={handleOtpVerify} className="space-y-4">
            <div className="space-y-2">
              <input 
                type="text" 
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 text-center text-xl font-bold tracking-widest focus:outline-none focus:border-indigo-500 text-white"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl text-sm transition-all"
            >
              Verify & Proceed
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Didn't receive the code?{' '}
            <button onClick={() => setOtpCode('')} className="text-indigo-400 hover:underline font-semibold">
              Resend OTP
            </button>
          </div>
        </div>
      )}

      {step === 'profile' && (
        <div className="w-full max-w-[500px] glass rounded-3xl border border-white/10 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Organization Settings & Invitations</h2>
            <p className="text-xs text-slate-400">Invite agents to your Acme dashboard</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Team Invitations</h3>
              <form onSubmit={handleInviteSubmit} className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="agent@acme.com" 
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                />
                <select 
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  className="bg-slate-900/50 border border-white/10 rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-300"
                >
                  <option value="Agent">Agent</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
                <button 
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Invite
                </button>
              </form>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Current Members</h4>
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {organizationMembers.map((member, i) => (
                  <div key={i} className="flex justify-between items-center p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs">
                    <span className="text-slate-300">{member.email}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-400">{member.role}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        member.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setCurrentPage('dashboard')} 
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
