import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings as SettingsIcon, Shield, CreditCard, Key, Users, Globe, Database, 
  Terminal, ShieldCheck, Moon, Sun, Plus, Trash2, ArrowRight 
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { 
    apiKeys, setApiKeys, theme, setTheme, organizationMembers, inviteMember, currentOrg, setCurrentOrg 
  } = useApp();

  const [tempKeys, setTempKeys] = useState({ ...apiKeys });
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Agent');
  const [brandColor, setBrandColor] = useState('#6366f1');
  const [customDomain, setCustomDomain] = useState('support.acme.com');
  const [generatedApiKey, setGeneratedApiKey] = useState('');

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKeys(tempKeys);
    alert("API Credentials updated and stored securely in browser local storage.");
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    inviteMember(inviteEmail, inviteRole);
    setInviteEmail('');
    alert(`Invitation sent to ${inviteEmail}`);
  };

  const generateNewRESTKey = () => {
    const key = `ant_live_${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
    setGeneratedApiKey(key);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">System Settings</h1>
        <p className="text-xs text-slate-400 font-medium">Configure LLM integrations, organization structure, API keys, and custom domains</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Settings Form Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* LLM Credentials */}
          <form onSubmit={handleSaveKeys} className="glass p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-indigo-400" /> LLM Credentials (LocalStorage)
              </h3>
              <button type="submit" className="py-1.5 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-lg transition-colors">
                Save Credentials
              </button>
            </div>
            
            <p className="text-[10px] text-slate-500 leading-relaxed">
              API Keys are stored client-side in your local storage. If left empty, the chatbot console will automatically fallback to high-fidelity agent routing simulations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase">OpenAI API Key</label>
                <input 
                  type="password" 
                  placeholder="sk-proj-..." 
                  value={tempKeys.openai || ''}
                  onChange={e => setTempKeys({ ...tempKeys, openai: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase">Anthropic Key</label>
                <input 
                  type="password" 
                  placeholder="sk-ant-..." 
                  value={tempKeys.anthropic || ''}
                  onChange={e => setTempKeys({ ...tempKeys, anthropic: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase">Gemini API Key</label>
                <input 
                  type="password" 
                  placeholder="AIzaSy..." 
                  value={tempKeys.gemini || ''}
                  onChange={e => setTempKeys({ ...tempKeys, gemini: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase">DeepSeek API Key</label>
                <input 
                  type="password" 
                  placeholder="ds-key-..." 
                  value={tempKeys.deepseek || ''}
                  onChange={e => setTempKeys({ ...tempKeys, deepseek: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                />
              </div>
            </div>
          </form>

          {/* Org & Invitations */}
          <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" /> Team Invitations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form */}
              <form onSubmit={handleInvite} className="space-y-3.5">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Invite member email</label>
                  <input 
                    type="email" 
                    placeholder="agent@acme.com" 
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Role</label>
                  <select 
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-300"
                  >
                    <option value="Agent">Agent</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition-colors">
                  Send Invitation
                </button>
              </form>

              {/* List */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-slate-500 uppercase block">Active list</span>
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {organizationMembers.map((member, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded-xl bg-white/[0.02] border border-white/5 text-[11px]">
                      <span className="text-slate-300 truncate max-w-[120px]">{member.email}</span>
                      <div className="flex gap-1.5 items-center">
                        <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">{member.role}</span>
                        <span className="text-[8px] text-green-400 bg-green-500/10 px-1 rounded uppercase font-semibold">{member.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Theme & Branding */}
          <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-400" /> Branding & Styling Customization
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Application UI Theme</span>
                  <div className="bg-slate-900 border border-white/10 rounded-xl p-1 flex">
                    <button 
                      onClick={() => setTheme('light')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        theme === 'light' ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        theme === 'dark' ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Brand Color Hex</span>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded border border-white/10" style={{ backgroundColor: brandColor }} />
                    <input 
                      type="text" 
                      value={brandColor}
                      onChange={e => setBrandColor(e.target.value)}
                      className="w-20 bg-slate-900 border border-white/10 rounded px-1.5 py-1 text-center font-mono text-[10px] text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Custom Portal Domain</label>
                  <input 
                    type="text" 
                    value={customDomain}
                    onChange={e => setCustomDomain(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-300 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* REST API & System logs */}
        <div className="space-y-6">
          
          {/* REST API Keys creation */}
          <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-indigo-400" /> REST API Access
            </h3>
            
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Generate credentials to interface with WooCommerce, Shopify, n8n, or Zapier systems.
            </p>

            <button 
              onClick={generateNewRESTKey}
              className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Generate REST Token
            </button>

            {generatedApiKey && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 space-y-1.5">
                <span className="text-[8px] uppercase tracking-wider font-bold text-indigo-400">Bearer Secret Token</span>
                <code className="block font-mono text-[9px] text-slate-300 break-all select-all">{generatedApiKey}</code>
              </div>
            )}
          </div>

          {/* Audit Logs */}
          <div className="glass p-6 rounded-2xl border border-white/5 space-y-4 flex-1">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-indigo-400" /> System Audit Logs
              </h3>
              <span className="w-2 h-2 rounded-full bg-green-400" />
            </div>

            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1 text-[10px] font-mono text-slate-500">
              <div>
                <span className="text-slate-400 block">[2026-07-05 19:22]</span>
                <span>User Sarah Connor logged in magic link</span>
              </div>
              <div>
                <span className="text-slate-400 block">[2026-07-05 18:41]</span>
                <span>Workflow "High Priority Escalation" fired node n2</span>
              </div>
              <div>
                <span className="text-slate-400 block">[2026-07-05 15:30]</span>
                <span>Vector embeddings index KB-103 synchronized</span>
              </div>
              <div>
                <span className="text-slate-400 block">[2026-07-05 11:20]</span>
                <span>HubSpot Sync complete. 42 contacts matching</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
