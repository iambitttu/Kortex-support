import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { Auth } from './pages/Auth';
import { DashboardHub } from './pages/DashboardHub';
import { ChatConsole } from './pages/ChatConsole';
import { Tickets } from './pages/Tickets';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { WorkflowBuilder } from './pages/WorkflowBuilder';
import { TrainingCenter } from './pages/TrainingCenter';
import { Settings } from './pages/Settings';
import { 
  Bot, LayoutDashboard, MessageSquare, Ticket, Database, Zap, Sparkles, Settings as SettingsIcon,
  LogOut, Sun, Moon, Bell, ChevronDown, Shield, Users 
} from 'lucide-react';

function App() {
  const { currentPage, setCurrentPage, currentUser, setCurrentUser, currentOrg, setCurrentOrg, theme, setTheme } = useApp();
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // If user is on landing or auth page, render separately without the sidebar
  if (currentPage === 'landing') {
    return <LandingPage />;
  }

  if (currentPage === 'auth' || !currentUser) {
    return <Auth />;
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Chat Console', icon: MessageSquare },
    { id: 'tickets', label: 'Ticketing Board', icon: Ticket },
    { id: 'knowledge', label: 'Knowledge Base', icon: Database },
    { id: 'workflows', label: 'Workflow Builder', icon: Zap },
    { id: 'training', label: 'AI Training Center', icon: Sparkles },
    { id: 'settings', label: 'Settings & Admin', icon: SettingsIcon },
  ];

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar */}
      <aside className="w-[260px] border-r border-white/5 flex flex-col justify-between p-6 glass select-none">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('landing')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Kortex <span className="text-indigo-400 font-medium">Support</span>
            </span>
          </div>

          {/* Org Selector */}
          <div className="relative">
            <button 
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-left font-semibold text-slate-300 hover:bg-white/10 transition-colors"
            >
              <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-indigo-400" /> {currentOrg}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showOrgDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-1 z-50 text-xs text-slate-300">
                <div 
                  onClick={() => { setCurrentOrg('Acme Corp'); setShowOrgDropdown(false); }}
                  className="p-2 rounded-lg hover:bg-white/5 cursor-pointer font-medium"
                >
                  Acme Corp
                </div>
                <div 
                  onClick={() => { setCurrentOrg('Global Team'); setShowOrgDropdown(false); }}
                  className="p-2 rounded-lg hover:bg-white/5 cursor-pointer font-medium"
                >
                  Global Team
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer profile info & logout */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={currentUser.avatarUrl} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 object-cover" 
              />
              <div>
                <h4 className="text-xs font-bold text-white truncate max-w-[100px]">{currentUser.name}</h4>
                <span className="text-[10px] text-slate-500">{currentUser.role}</span>
              </div>
            </div>
            
            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-slate-400 text-xs font-bold transition-all"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header bar */}
        <header className="h-[70px] border-b border-white/5 flex justify-between items-center px-8 bg-slate-950/20 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{currentOrg} Workspace</span>
            <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-bold uppercase">PRO</span>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Notification alert bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-[320px] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-4 z-50 text-xs text-slate-300 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="font-bold">Notifications</span>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-500">Close</button>
                  </div>
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-white">SLA Breach Warning</p>
                        <p className="text-[10px] text-slate-400">Ticket #TK-301 has 15 minutes remaining before SLA breach.</p>
                      </div>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-white">Stripe Refund Successful</p>
                        <p className="text-[10px] text-slate-400">Refund request of $89.00 processed for order #SH-8841.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile widget */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-300">{currentUser.name}</span>
              <img 
                src={currentUser.avatarUrl} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full bg-slate-800 object-cover" 
              />
            </div>
          </div>
        </header>

        {/* Viewport content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          
          {currentPage === 'dashboard' && <DashboardHub />}
          {currentPage === 'chat' && <ChatConsole />}
          {currentPage === 'tickets' && <Tickets />}
          {currentPage === 'knowledge' && <KnowledgeBase />}
          {currentPage === 'workflows' && <WorkflowBuilder />}
          {currentPage === 'training' && <TrainingCenter />}
          {currentPage === 'settings' && <Settings />}

        </main>
      </div>

    </div>
  );
}

export default App;
