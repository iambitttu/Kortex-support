import React, { useState } from 'react';
import { useApp, Ticket } from '../context/AppContext';
import { 
  Ticket as TicketIcon, Clock, User, AlertCircle, MessageSquare, CheckCircle, Search, 
  ArrowRight, ShieldAlert, FileText, Send, Plus, Merge, Split, Trash2, Edit 
} from 'lucide-react';

export const Tickets: React.FC = () => {
  const { tickets, setTickets, customers } = useApp();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('list');
  const [newNote, setNewNote] = useState('');

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);
  const customerProfile = selectedTicket ? customers.find(c => c.email === selectedTicket.customerEmail) : null;

  // Filtered tickets based on search query
  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedTicketId) return;

    setTickets(prev => 
      prev.map(t => {
        if (t.id === selectedTicketId) {
          return {
            ...t,
            internalNotes: [...(t.internalNotes || []), newNote],
          };
        }
        return t;
      })
    );
    setNewNote('');
  };

  const updateTicketStatus = (status: Ticket['status']) => {
    if (!selectedTicketId) return;
    setTickets(prev => 
      prev.map(t => {
        if (t.id === selectedTicketId) {
          return { ...t, status };
        }
        return t;
      })
    );
  };

  const handleMergeTickets = () => {
    alert("Merging logic activated: Tickets can be consolidated under a parent thread inside your CRM dashboard.");
  };

  const handleSplitTicket = () => {
    alert("Splitting logic activated: Separates customer intent topics into distinct, routed tickets.");
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white">Ticketing Helpdesk</h1>
          <p className="text-xs text-slate-400 font-medium">Coordinate SLA resolutions, AI summaries, and human escalation handoffs</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search tickets..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-slate-900/50 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white w-[220px]"
            />
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-xl p-1 flex">
            <button 
              onClick={() => setViewMode('list')}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                viewMode === 'list' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              List
            </button>
            <button 
              onClick={() => setViewMode('kanban')}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                viewMode === 'kanban' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Kanban
            </button>
          </div>
        </div>
      </div>

      {/* List / Kanban Switch */}
      {viewMode === 'list' ? (
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-slate-900/10 grid grid-cols-12 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <div className="col-span-1">ID</div>
            <div className="col-span-4">Topic / Description</div>
            <div className="col-span-2">Customer</div>
            <div className="col-span-1">Priority</div>
            <div className="col-span-2">Assigned Agent</div>
            <div className="col-span-1">SLA Limit</div>
            <div className="col-span-1 text-right">Status</div>
          </div>
          
          <div className="divide-y divide-white/5 text-xs">
            {filteredTickets.map(ticket => (
              <div 
                key={ticket.id} 
                onClick={() => setSelectedTicketId(ticket.id)}
                className={`p-4 grid grid-cols-12 items-center cursor-pointer hover:bg-white/[0.01] transition-colors ${
                  selectedTicketId === ticket.id ? 'bg-white/5' : ''
                }`}
              >
                <div className="col-span-1 font-bold text-slate-400">{ticket.id}</div>
                
                <div className="col-span-4 pr-4">
                  <h4 className="font-semibold text-white truncate">{ticket.title}</h4>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{ticket.description}</p>
                </div>
                
                <div className="col-span-2">
                  <span className="font-medium text-slate-200">{ticket.customerName}</span>
                  <span className="block text-[9px] text-slate-500">{ticket.customerEmail}</span>
                </div>
                
                <div className="col-span-1">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    ticket.priority === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/10' :
                    ticket.priority === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {ticket.priority}
                  </span>
                </div>

                <div className="col-span-2 text-slate-300">{ticket.assignedAgent}</div>

                <div className="col-span-1">
                  <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> {ticket.slaMinutes === 120 ? 'Met' : `${ticket.slaMinutes}m`}
                  </span>
                </div>

                <div className="col-span-1 text-right">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${
                    ticket.status === 'Open' ? 'bg-indigo-500/10 text-indigo-400' :
                    ticket.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-green-500/10 text-green-400'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Kanban Board */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['Open', 'Pending', 'Resolved'] as const).map(columnStatus => {
            const columnTickets = filteredTickets.filter(t => t.status === columnStatus);
            return (
              <div key={columnStatus} className="glass p-4 rounded-2xl border border-white/5 space-y-4 flex flex-col bg-slate-900/10 min-h-[400px]">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{columnStatus} ({columnTickets.length})</span>
                </div>
                
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
                  {columnTickets.map(ticket => (
                    <div 
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 cursor-pointer hover:translate-y-[-1px] transition-all space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-slate-500">{ticket.id}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                          ticket.priority === 'Critical' ? 'bg-red-500/10 text-red-400' :
                          ticket.priority === 'High' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-slate-800 text-slate-400'
                        }`}>{ticket.priority}</span>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-semibold text-white line-clamp-1">{ticket.title}</h4>
                        <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{ticket.description}</p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-400">
                        <span className="truncate max-w-[120px]">{ticket.customerName}</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-500" /> {ticket.slaMinutes}m
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Details Sidebar Drawer overlay */}
      {selectedTicket && (
        <div className="fixed inset-y-0 right-0 w-[550px] bg-slate-950 border-l border-white/10 shadow-2xl z-50 flex flex-col p-6 space-y-6 overflow-y-auto">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-white/5 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">{selectedTicket.id}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  selectedTicket.priority === 'Critical' ? 'bg-red-500/10 text-red-400' : 'bg-slate-800 text-slate-400'
                }`}>{selectedTicket.priority}</span>
              </div>
              <h2 className="text-sm font-bold text-white mt-1.5">{selectedTicket.title}</h2>
            </div>
            <button onClick={() => setSelectedTicketId(null)} className="text-slate-400 hover:text-white text-sm font-semibold">✕</button>
          </div>

          {/* Action Row */}
          <div className="flex gap-2 border-b border-white/5 pb-4">
            <button onClick={handleMergeTickets} className="flex-1 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-white/5 transition-colors">
              <Merge className="w-3.5 h-3.5 text-indigo-400" /> Merge
            </button>
            <button onClick={handleSplitTicket} className="flex-1 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-white/5 transition-colors">
              <Split className="w-3.5 h-3.5 text-indigo-400" /> Split
            </button>
            <button 
              onClick={() => updateTicketStatus('Resolved')}
              className="flex-1 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Resolve
            </button>
          </div>

          {/* Body Content */}
          <div className="space-y-5 flex-1">
            
            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Ticket Description</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.01] border border-white/5 rounded-xl p-3.5">{selectedTicket.description}</p>
            </div>

            {/* AI Summary */}
            {selectedTicket.aiSummary && (
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 text-cyan-400">
                  <FileText className="w-3.5 h-3.5" /> AI Executive Summary
                </h4>
                <p className="text-xs text-cyan-200 bg-cyan-950/15 border border-cyan-500/10 rounded-xl p-3.5">{selectedTicket.aiSummary}</p>
              </div>
            )}

            {/* AI Suggested Response */}
            {selectedTicket.aiSuggestedReply && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 text-indigo-400">
                  <MessageSquare className="w-3.5 h-3.5" /> AI Draft Reply
                </h4>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed italic">"{selectedTicket.aiSuggestedReply}"</p>
                  <button 
                    onClick={() => {
                      alert("Suggested reply copied to support chat draft console.");
                    }}
                    className="py-1.5 px-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-[10px] font-bold flex items-center gap-1.5 hover:bg-indigo-500/20 transition-all"
                  >
                    <Send className="w-3 h-3" /> Apply suggested reply
                  </button>
                </div>
              </div>
            )}

            {/* Shopify Customer Lookup Database */}
            {customerProfile && (
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Customer CRM Profile</h4>
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Plan Tier</span>
                    <span className="font-bold text-white">{customerProfile.plan} Plan</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Shopify Order ID</span>
                    <span className="font-bold text-indigo-400">{customerProfile.orderNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Order Status</span>
                    <span className="font-semibold text-slate-200">{customerProfile.orderStatus}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Refund Eligible</span>
                    <span className={`font-semibold ${customerProfile.refundEligible ? 'text-green-400' : 'text-red-400'}`}>
                      {customerProfile.refundEligible ? 'Eligible' : 'Not Eligible'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Internal Notes Manager */}
            <div className="space-y-3.5 pt-4 border-t border-white/5">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Internal Collaboration Notes</h4>
              
              <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                {selectedTicket.internalNotes?.map((note, index) => (
                  <div key={index} className="p-2.5 rounded-xl bg-slate-900/50 border border-white/5 text-[11px] text-slate-400">
                    {note}
                  </div>
                ))}
              </div>

              <form onSubmit={addInternalNote} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type internal collaboration note..." 
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                />
                <button 
                  type="submit" 
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Note
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
