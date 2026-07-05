import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, Award, CheckCircle, XCircle, Edit3, MessageSquare, AlertCircle, Plus, 
  Trash2, RefreshCw, Sliders, Play, Settings 
} from 'lucide-react';

export const TrainingCenter: React.FC = () => {
  const { systemPrompts, setSystemPrompts } = useApp();
  const [faqs, setFaqs] = useState([
    { q: "What is your refund policy?", a: "We offer a 30-day money-back guarantee for all subscription plans." },
    { q: "How do I whitelist CORS hosts?", a: "Go to settings -> Developer -> Authorized Domains and input your URL." }
  ]);
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');
  const [currentTab, setCurrentTab] = useState<'review' | 'prompts' | 'faqs'>('review');
  
  // Prompt values state
  const [tempPrompts, setTempPrompts] = useState({ ...systemPrompts });

  const handleSavePrompts = (e: React.FormEvent) => {
    e.preventDefault();
    setSystemPrompts(tempPrompts);
    alert("System Prompts updated and synced to supervisor router models successfully.");
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQ || !newA) return;
    setFaqs(prev => [...prev, { q: newQ, a: newA }]);
    setNewQ('');
    setNewA('');
  };

  const handleDeleteFaq = (index: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">AI Training Center</h1>
        <p className="text-xs text-slate-400 font-medium">Fine-tune system prompts, evaluate routing accuracy, and configure Q&A sets</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-6 text-xs font-semibold">
        <button 
          onClick={() => setCurrentTab('review')}
          className={`pb-3 transition-colors cursor-pointer ${
            currentTab === 'review' ? 'border-b-2 border-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Review Conversations
        </button>
        <button 
          onClick={() => setCurrentTab('prompts')}
          className={`pb-3 transition-colors cursor-pointer ${
            currentTab === 'prompts' ? 'border-b-2 border-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Prompt System Editor
        </button>
        <button 
          onClick={() => setCurrentTab('faqs')}
          className={`pb-3 transition-colors cursor-pointer ${
            currentTab === 'faqs' ? 'border-b-2 border-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          FAQ Database ({faqs.length})
        </button>
      </div>

      {/* Review Conversations Tab */}
      {currentTab === 'review' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Logs */}
          <div className="lg:col-span-2 glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-slate-900/10 flex justify-between items-center text-xs">
              <h3 className="font-bold text-slate-400 uppercase">Evaluation Queue</h3>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-bold">Needs Review (2)</span>
            </div>

            <div className="divide-y divide-white/5 text-xs">
              <div className="p-4 space-y-3.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-mono text-slate-500">Log: #LOG-8842 • Route: Technical Agent</span>
                  <span className="text-slate-400 font-semibold">User: John Miller</span>
                </div>
                <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.01] border border-white/5">
                  <p className="text-slate-400"><strong className="text-slate-200">Q:</strong> Web SDK throwing CORS exception on production...</p>
                  <p className="text-slate-400"><strong className="text-slate-200">A:</strong> whitelist your host under Settings &rarr; API Keys...</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => alert("Marked as Approved. Vector accuracy scores updated.")}
                      className="py-1 px-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/10 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve Answer
                    </button>
                    <button 
                      onClick={() => alert("Flagged as incorrect. Prompt model notified.")}
                      className="py-1 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject & Fine-tune
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500">Confidence: 94%</span>
                </div>
              </div>

              <div className="p-4 space-y-3.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-mono text-slate-500">Log: #LOG-8843 • Route: Billing Agent</span>
                  <span className="text-slate-400 font-semibold">User: Elena Rostova</span>
                </div>
                <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.01] border border-white/5">
                  <p className="text-slate-400"><strong className="text-slate-200">Q:</strong> Incorrect charge on June subscription invoice...</p>
                  <p className="text-slate-400"><strong className="text-slate-200">A:</strong> applied a credit adjustment of $150 to your account...</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => alert("Marked as Approved.")}
                      className="py-1 px-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/10 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve Answer
                    </button>
                    <button 
                      onClick={() => alert("Flagged.")}
                      className="py-1 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject & Fine-tune
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500">Confidence: 89%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Accuracy KPIs */}
          <div className="glass p-6 rounded-2xl border border-white/5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-400" /> Accuracy Metrics
              </h3>
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase block">Supervisor Route hit-rate</span>
                  <span className="text-xl font-bold text-white">96.8%</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase block">Average evaluation score</span>
                  <span className="text-xl font-bold text-indigo-400">4.8 / 5.0</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase block">Active Training Checkpoints</span>
                  <span className="text-xl font-bold text-emerald-400">14 Active</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => alert("Fine-tuning pipeline initiated asynchronously.")}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Run fine-tune script
            </button>
          </div>
        </div>
      )}

      {/* Prompts Tab */}
      {currentTab === 'prompts' && (
        <form onSubmit={handleSavePrompts} className="glass p-6 rounded-2xl border border-white/5 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-400" /> Prompts configuration settings
            </h3>
            <button type="submit" className="py-2 px-5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-lg transition-colors">
              Save prompts
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">Supervisor Agent System prompt</label>
              <textarea 
                value={tempPrompts.supervisor}
                onChange={e => setTempPrompts({ ...tempPrompts, supervisor: e.target.value })}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500 text-slate-300 h-20"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">Technical Agent System prompt</label>
              <textarea 
                value={tempPrompts.technical}
                onChange={e => setTempPrompts({ ...tempPrompts, technical: e.target.value })}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500 text-slate-300 h-20"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">Billing Agent System prompt</label>
              <textarea 
                value={tempPrompts.billing}
                onChange={e => setTempPrompts({ ...tempPrompts, billing: e.target.value })}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500 text-slate-300 h-20"
              />
            </div>
          </div>
        </form>
      )}

      {/* FAQ Tab */}
      {currentTab === 'faqs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-2 glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-slate-900/10 text-xs font-bold text-slate-400 uppercase">
              Q&A list
            </div>

            <div className="divide-y divide-white/5 text-xs">
              {faqs.map((faq, i) => (
                <div key={i} className="p-4 flex justify-between items-start hover:bg-white/[0.01] transition-colors">
                  <div className="space-y-1.5 flex-1 pr-6">
                    <h4 className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> {faq.q}
                    </h4>
                    <p className="text-slate-400 leading-relaxed pl-3">{faq.a}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteFaq(i)}
                    className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAddFaq} className="glass p-6 rounded-2xl border border-white/5 space-y-4 h-fit">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-400" /> Create FAQ Entry
            </h3>
            
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Question</label>
                <input 
                  type="text" 
                  placeholder="How do I cancel?" 
                  value={newQ}
                  onChange={e => setNewQ(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Answer</label>
                <textarea 
                  placeholder="You can cancel anytime in the Billing panel." 
                  value={newA}
                  onChange={e => setNewA(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white h-24"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              Add FAQ to index
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
