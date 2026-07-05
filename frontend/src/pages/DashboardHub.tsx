import React from 'react';
import { useApp } from '../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend } from 'recharts';
import { MessageSquare, Ticket, Clock, CheckCircle2, Award, Users, AlertTriangle, Smile, ShieldAlert } from 'lucide-react';

const volumeData = [
  { name: '08:00', chats: 24, tickets: 3 },
  { name: '10:00', chats: 45, tickets: 8 },
  { name: '12:00', chats: 78, tickets: 12 },
  { name: '14:00', chats: 95, tickets: 18 },
  { name: '16:00', chats: 62, tickets: 14 },
  { name: '18:00', chats: 35, tickets: 5 },
  { name: '20:00', chats: 18, tickets: 2 },
];

const sentimentData = [
  { name: 'Positive', value: 68, color: '#10b981' },
  { name: 'Neutral', value: 22, color: '#64748b' },
  { name: 'Negative', value: 10, color: '#f43f5e' },
];

export const DashboardHub: React.FC = () => {
  const { tickets, customers } = useApp();

  const totalOpenTickets = tickets.filter(t => t.status === 'Open' || t.status === 'Pending').length;
  const totalResolvedTickets = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard Overview</h1>
          <p className="text-xs text-slate-400">Real-time metrics console for automated customer operations</p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" /> Real-time Sync Active
          </span>
        </div>
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Today's Chats</span>
            <MessageSquare className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">357</span>
            <span className="text-xs text-green-400 font-semibold">+18% vs yesterday</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Open Tickets</span>
            <Ticket className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalOpenTickets}</span>
            <span className="text-xs text-slate-500 font-semibold">Avg SLA: 26 mins</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Resolved Tickets</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalResolvedTickets}</span>
            <span className="text-xs text-green-400 font-semibold">92.4% resolution rate</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">AI Accuracy</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">88.5%</span>
            <span className="text-xs text-cyan-400 font-semibold">+1.2% this week</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Volume Trend */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl border border-white/5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Conversation Volume Trend</h3>
            <p className="text-[11px] text-slate-500">Hourly logs of automated AI chats vs escalated tickets</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorChats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="chats" stroke="#6366f1" fillOpacity={1} fill="url(#colorChats)" name="AI Chats" strokeWidth={2} />
                <Area type="monotone" dataKey="tickets" stroke="#f59e0b" fillOpacity={1} fill="url(#colorTickets)" name="Escalated Tickets" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Sentiment Analysis */}
        <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Sentiment Analysis</h3>
            <p className="text-[11px] text-slate-500">Real-time NLP sentiment detection scores</p>
          </div>
          <div className="h-[200px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sentimentData} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="value" name="Percentage %" radius={[0, 4, 4, 0]} barSize={20}>
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400">
            <div className="flex flex-col items-center">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 mb-1" />
              <span>Positive (68%)</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-2.5 h-2.5 rounded bg-slate-500 mb-1" />
              <span>Neutral (22%)</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-2.5 h-2.5 rounded bg-rose-500 mb-1" />
              <span>Negative (10%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Support Widgets & Active Team */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Database Snippet */}
        <div className="glass p-6 rounded-2xl border border-white/5 space-y-4 lg:col-span-2">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white">Active High-Priority Customers</h3>
              <p className="text-[11px] text-slate-500">Live priority sync with CRM database status</p>
            </div>
          </div>
          <div className="space-y-3">
            {customers.map((cust, i) => (
              <div key={i} className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                    {cust.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{cust.name}</h4>
                    <span className="text-[10px] text-slate-500">{cust.company} • {cust.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    cust.plan === 'Enterprise' ? 'bg-indigo-500/10 text-indigo-400 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {cust.plan}
                  </span>
                  <span className="text-xs font-medium text-slate-300">{cust.orderTotal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live System Logs & Health */}
        <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Platform Health</h3>
            <p className="text-[11px] text-slate-500">Global API and agent response latency logs</p>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Supervisor Router API</span>
              <span className="text-green-400 font-medium">99.98% (42ms)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Pinecone Vector Index</span>
              <span className="text-green-400 font-medium">Synced (12ms)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Shopify Gateway</span>
              <span className="text-green-400 font-medium">Connected (85ms)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">HubSpot Contacts sync</span>
              <span className="text-amber-400 font-medium">Lagging 2m</span>
            </div>
            <div className="pt-3.5 border-t border-white/5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Live Agent Staff load</span>
              <div className="flex gap-2">
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[45%]" />
                </div>
                <span className="text-[9px] text-slate-400">45% capacity</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
