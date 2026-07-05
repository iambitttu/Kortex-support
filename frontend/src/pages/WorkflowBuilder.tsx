import React, { useState } from 'react';
import { useApp, WorkflowNode, Workflow } from '../context/AppContext';
import { Play, ToggleLeft, ToggleRight, Plus, Trash2, ArrowRight, Zap, Settings, HelpCircle, Code, MessageSquare, AlertCircle } from 'lucide-react';

export const WorkflowBuilder: React.FC = () => {
  const { workflows, setWorkflows } = useApp();
  const [activeWfId, setActiveWfId] = useState<string>('WF-1');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const activeWorkflow = workflows.find(w => w.id === activeWfId) || workflows[0];

  const handleToggleWorkflow = (id: string) => {
    setWorkflows(prev => 
      prev.map(w => {
        if (w.id === id) {
          return { ...w, active: !w.active };
        }
        return w;
      })
    );
  };

  const addWorkflowNode = (type: 'trigger' | 'condition' | 'action', label: string, desc: string) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type,
      label,
      description: desc,
      x: 100 + Math.random() * 50,
      y: 100 + Math.random() * 200,
    };

    setWorkflows(prev => 
      prev.map(w => {
        if (w.id === activeWfId) {
          // Auto connect to the last node if exists
          const lastNode = w.nodes[w.nodes.length - 1];
          const newConnections = lastNode 
            ? [...w.connections, { fromId: lastNode.id, toId: newNode.id }]
            : w.connections;

          return {
            ...w,
            nodes: [...w.nodes, newNode],
            connections: newConnections,
          };
        }
        return w;
      })
    );
  };

  const removeNode = (nodeId: string) => {
    setWorkflows(prev => 
      prev.map(w => {
        if (w.id === activeWfId) {
          return {
            ...w,
            nodes: w.nodes.filter(n => n.id !== nodeId),
            connections: w.connections.filter(c => c.fromId !== nodeId && c.toId !== nodeId),
          };
        }
        return w;
      })
    );
    setSelectedNodeId(null);
  };

  const selectedNode = activeWorkflow.nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="space-y-8 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white">Visual Workflow Builder</h1>
          <p className="text-xs text-slate-400 font-medium">Design automated customer triggers, conditional routers, and webhook actions</p>
        </div>

        {/* Workflow Switcher */}
        <div className="flex items-center gap-4">
          <select 
            value={activeWfId} 
            onChange={e => setActiveWfId(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-200"
          >
            {workflows.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>

          <button 
            onClick={() => handleToggleWorkflow(activeWorkflow.id)}
            className="flex items-center gap-2 cursor-pointer"
          >
            {activeWorkflow.active ? (
              <span className="text-xs text-green-400 font-semibold flex items-center gap-1.5">
                Active <ToggleRight className="w-6 h-6 text-green-400" />
              </span>
            ) : (
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                Paused <ToggleLeft className="w-6 h-6 text-slate-600" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Builder Main Work area */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Node Sidebar Palette */}
        <div className="w-[280px] glass p-5 rounded-2xl border border-white/5 space-y-6 flex flex-col justify-between overflow-y-auto">
          
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Triggers</h3>
              <p className="text-[10px] text-slate-500 mb-2">Starts the workflow canvas</p>
              <div className="space-y-1.5">
                <button 
                  onClick={() => addWorkflowNode('trigger', 'New Message', 'When a new message arrives')}
                  className="w-full text-left p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/10 hover:border-indigo-500/40 text-[11px] font-semibold text-indigo-400 flex items-center gap-2 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" /> On New Message
                </button>
                <button 
                  onClick={() => addWorkflowNode('trigger', 'Payment Failed', 'When Stripe transaction fails')}
                  className="w-full text-left p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/10 hover:border-indigo-500/40 text-[11px] font-semibold text-indigo-400 flex items-center gap-2 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" /> Payment Fail
                </button>
                <button 
                  onClick={() => addWorkflowNode('trigger', 'Refund Request', 'Customer creates a refund ticket')}
                  className="w-full text-left p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/10 hover:border-indigo-500/40 text-[11px] font-semibold text-indigo-400 flex items-center gap-2 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" /> Refund Request
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Conditions</h3>
              <p className="text-[10px] text-slate-500 mb-2">Branches logic routing rules</p>
              <div className="space-y-1.5">
                <button 
                  onClick={() => addWorkflowNode('condition', 'Plan == Enterprise', 'Check customer plan tier')}
                  className="w-full text-left p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/10 hover:border-amber-500/40 text-[11px] font-semibold text-amber-400 flex items-center gap-2 transition-all"
                >
                  <Settings className="w-3.5 h-3.5" /> Plan is Enterprise
                </button>
                <button 
                  onClick={() => addWorkflowNode('condition', 'Sentiment Negative', 'Detect customer text sentiment')}
                  className="w-full text-left p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/10 hover:border-amber-500/40 text-[11px] font-semibold text-amber-400 flex items-center gap-2 transition-all"
                >
                  <Settings className="w-3.5 h-3.5" /> Sentiment Negative
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Actions</h3>
              <p className="text-[10px] text-slate-500 mb-2">Automated system responses</p>
              <div className="space-y-1.5">
                <button 
                  onClick={() => addWorkflowNode('action', 'Escalate Ticket', 'Handoff to human agent')}
                  className="w-full text-left p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/40 text-[11px] font-semibold text-emerald-400 flex items-center gap-2 transition-all"
                >
                  <Play className="w-3.5 h-3.5" /> Human Handoff
                </button>
                <button 
                  onClick={() => addWorkflowNode('action', 'Webhook CRM update', 'Sync contacts details to HubSpot')}
                  className="w-full text-left p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/40 text-[11px] font-semibold text-emerald-400 flex items-center gap-2 transition-all"
                >
                  <Code className="w-3.5 h-3.5" /> CRM HubSpot Sync
                </button>
                <button 
                  onClick={() => addWorkflowNode('action', 'Send Slack alert', 'Ping operational Slack channel')}
                  className="w-full text-left p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/40 text-[11px] font-semibold text-emerald-400 flex items-center gap-2 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Slack Notification
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-[9px] text-slate-500 flex gap-2">
            <HelpCircle className="w-4 h-4" />
            <span>Click any node in the list to place it directly on the canvas graph below.</span>
          </div>

        </div>

        {/* Graph Dot-Grid Canvas */}
        <div className="flex-1 glass rounded-3xl border border-white/5 relative workflow-grid flex overflow-hidden">
          
          <div className="absolute inset-0 p-6 flex flex-wrap gap-8 items-center justify-center">
            {activeWorkflow.nodes.map((node, i) => (
              <React.Fragment key={node.id}>
                {i > 0 && <ArrowRight className="w-5 h-5 text-slate-700" />}
                
                <div 
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`w-[180px] p-4 rounded-2xl border cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all relative ${
                    selectedNodeId === node.id 
                      ? 'bg-indigo-500/10 border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900 border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
                      node.type === 'trigger' ? 'bg-indigo-500/15 text-indigo-400' :
                      node.type === 'condition' ? 'bg-amber-500/15 text-amber-400' :
                      'bg-emerald-500/15 text-emerald-400'
                    }`}>
                      {node.type}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{node.label}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{node.description}</p>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 text-[10px] text-slate-500 font-mono">
            Canvas coordinate system: grid layout synced
          </div>

        </div>

        {/* Selected Node Editor Settings Drawer */}
        {selectedNode && (
          <div className="w-[280px] glass p-5 rounded-2xl border border-white/5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h3 className="text-xs font-bold text-white uppercase">Node Parameters</h3>
                <button onClick={() => setSelectedNodeId(null)} className="text-slate-500 hover:text-white text-xs">✕</button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Label</label>
                  <input 
                    type="text" 
                    value={selectedNode.label}
                    readOnly
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-400"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Description</label>
                  <textarea 
                    value={selectedNode.description}
                    readOnly
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-400 h-20"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={() => removeNode(selectedNode.id)}
              className="w-full py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-red-500/20 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove Node
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
