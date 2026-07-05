import React, { useState, useEffect, useRef } from 'react';
import { useApp, ChatThread, ChatMessage } from '../context/AppContext';
import { 
  Bot, Send, Mic, MicOff, Volume2, VolumeX, Paperclip, FileText, ArrowRight, Folder, FolderPlus, Tag, Plus, 
  Search, RefreshCw, Copy, Check, CornerDownRight, ShieldAlert, Cpu, Sparkles, X, AlertCircle 
} from 'lucide-react';

export const ChatConsole: React.FC = () => {
  const { 
    chatThreads, setChatThreads, activeThreadId, setActiveThreadId, apiKeys, systemPrompts 
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState('Claude 3.5 Sonnet');
  const [isVoiceInputActive, setIsVoiceInputActive] = useState(false);
  const [isVoiceOutputActive, setIsVoiceOutputActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [agentThinkingStep, setAgentThinkingStep] = useState<'idle' | 'supervisor' | 'agent' | 'generating'>('idle');
  const [thinkingAgentName, setThinkingAgentName] = useState('');
  const [fileAttachment, setFileAttachment] = useState<{ name: string; type: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const activeThread = chatThreads.find(t => t.id === activeThreadId) || chatThreads[0];

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages, agentThinkingStep]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !fileAttachment) return;

    const userMessageContent = inputText;
    const currentAttachment = fileAttachment;
    
    // Clear input
    setInputText('');
    setFileAttachment(null);
    setIsGenerating(true);

    // 1. Add user message
    const userMsg: ChatMessage = {
      id: `M-USER-${Date.now()}`,
      sender: 'user',
      content: userMessageContent + (currentAttachment ? `\n\n*[Uploaded File: ${currentAttachment.name}]*` : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...activeThread.messages, userMsg];
    updateThreadMessages(activeThread.id, updatedMessages);

    // 2. Multi-Agent thinking pipeline simulation
    // Step A: Supervisor Analysis
    setAgentThinkingStep('supervisor');
    
    setTimeout(() => {
      // Determine agent route based on content
      let routedAgent = 'General Support Agent';
      let citation = 'FAQ_Database.txt (Section 1: General Help)';
      let replyContent = "I am routing your request to our general assistance agent.";

      const query = userMessageContent.toLowerCase();
      if (query.includes('cors') || query.includes('api') || query.includes('error') || query.includes('sdk')) {
        routedAgent = 'Technical Support Agent';
        citation = 'API_Integration_Guide.pdf (Page 14: SDK CORS Configuration)';
        replyContent = `Hello! Based on the CORS exception in your JS SDK, this happens because the local origin calling the system is not whitelisted in the dashboard. \n\nHere is how to resolve it:\n1. Open your console settings -> **API Keys**.\n2. Add your host \`http://localhost:3000\` into the **Allowed Origins** field.\n3. Save and refresh your page.\n\n\`\`\`javascript\n// Whitelisted configuration example\nconst supportClient = new AntigravityWidget({\n  apiKey: "ant_live_8392",\n  origin: "https://yourdomain.com"\n});\n\`\`\``;
      } else if (query.includes('refund') || query.includes('return') || query.includes('cancel')) {
        routedAgent = 'Refund Agent';
        citation = 'Billing_and_Refunds_Policy.docx (Section 3: Damaged Goods Returns)';
        replyContent = "I've checked order #SH-8841. Damaged products are eligible for a 100% refund. I have processed a return invoice request on Stripe for $89.00. The funds will reflect in your account within 3 to 5 business days.";
      } else if (query.includes('billing') || query.includes('charge') || query.includes('invoice') || query.includes('price')) {
        routedAgent = 'Billing Agent';
        citation = 'Billing_and_Refunds_Policy.docx (Section 1: Plans and Seats)';
        replyContent = "I have checked subscription profile #SUB-981. Your plan was charged $399 instead of $249 because of a temporary seat overrun. I have applied a credit adjustment of $150 to your account.";
      } else if (query.includes('track') || query.includes('order') || query.includes('shipment') || query.includes('where is')) {
        routedAgent = 'Order Tracking Agent';
        citation = 'Shopify_Sync_Docs.pdf (Page 4: Carrier Trackers)';
        replyContent = "Your package for order #SH-4592 is currently in transit. Carrier: UPS. Tracking ID: `UPS-TRK-74929471`. Current location: Seattle sorting hub. Estimated delivery: July 7, 2026.";
      }

      setThinkingAgentName(routedAgent);
      
      // Step B: Supervisor writes routing message
      const supervisorMsg: ChatMessage = {
        id: `M-SUPER-${Date.now()}`,
        sender: 'supervisor',
        content: `Routing query to **${routedAgent}** based on semantic intent index.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      updateThreadMessages(activeThread.id, [...updatedMessages, supervisorMsg]);

      // Step C: Specialist Agent thinking
      setTimeout(() => {
        setAgentThinkingStep('agent');

        // Step D: Specialist Agent generates response
        setTimeout(() => {
          setAgentThinkingStep('generating');
          
          const agentMsg: ChatMessage = {
            id: `M-AGENT-${Date.now()}`,
            sender: 'agent',
            agentName: routedAgent,
            content: replyContent,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            citations: [citation],
          };

          updateThreadMessages(activeThread.id, [...updatedMessages, supervisorMsg, agentMsg]);
          setIsGenerating(false);
          setAgentThinkingStep('idle');

          // Text-to-Speech simulation if output is active
          if (isVoiceOutputActive) {
            simulateTTS(replyContent);
          }
        }, 1500);
      }, 1000);
    }, 1200);
  };

  const updateThreadMessages = (threadId: string, messages: ChatMessage[]) => {
    setChatThreads(prev => 
      prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            messages,
            lastMessage: messages[messages.length - 1].content.slice(0, 60),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return t;
      })
    );
  };

  const createNewChatThread = () => {
    const newId = `THREAD-${Date.now()}`;
    const newThread: ChatThread = {
      id: newId,
      title: 'New Support Chat',
      lastMessage: 'Ask me anything about your platform...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: false,
      model: selectedModel,
      messages: [
        {
          id: `M-${Date.now()}`,
          sender: 'supervisor',
          content: 'Hello! I am the Supervisor AI. How can I help you support your clients today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]
    };
    setChatThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newId);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileAttachment({
        name: file.name,
        type: file.type || 'document/pdf',
      });
    }
  };

  const simulateTTS = (text: string) => {
    // Basic synthetic speech simulator using HTML5 speech API
    const synth = window.speechSynthesis;
    if (synth) {
      synth.cancel();
      const cleanText = text.replace(/[*`#]/g, ''); // strip markdown
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.voice = synth.getVoices().find(v => v.lang.includes('en')) || null;
      synth.speak(utterance);
    }
  };

  const handleVoiceInputToggle = () => {
    if (!isVoiceInputActive) {
      setIsVoiceInputActive(true);
      // Simulate speech recognition
      setTimeout(() => {
        setInputText("Where is my order #SH-4592?");
        setIsVoiceInputActive(false);
      }, 3000);
    } else {
      setIsVoiceInputActive(false);
    }
  };

  const copyMessageText = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Filter threads by search query
  const filteredThreads = chatThreads.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-140px)] flex border border-white/5 rounded-3xl overflow-hidden glass">
      
      {/* Sidebar List */}
      <div className="w-[300px] border-r border-white/5 flex flex-col bg-slate-950/20">
        
        {/* Search & Actions */}
        <div className="p-4 border-b border-white/5 space-y-3 bg-slate-900/10">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search chat history..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
            />
          </div>
          <button 
            onClick={createNewChatThread}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> New Chat
          </button>
        </div>

        {/* Folders & History */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3.5 mb-1.5 block">Folders</span>
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3.5 py-1.5 rounded-lg text-xs hover:bg-white/5 text-slate-300 cursor-pointer">
                <span className="flex items-center gap-2"><Folder className="w-3.5 h-3.5 text-indigo-400" /> Technical Issues</span>
                <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">1</span>
              </div>
              <div className="flex items-center justify-between px-3.5 py-1.5 rounded-lg text-xs hover:bg-white/5 text-slate-300 cursor-pointer">
                <span className="flex items-center gap-2"><Folder className="w-3.5 h-3.5 text-indigo-400" /> General FAQ</span>
                <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">0</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3.5 mb-1.5 block">Recent Conversations</span>
            <div className="space-y-1.5">
              {filteredThreads.map(thread => (
                <div 
                  key={thread.id} 
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`p-3 rounded-2xl cursor-pointer border transition-all ${
                    thread.id === activeThread.id 
                      ? 'bg-white/5 border-white/10 shadow-lg' 
                      : 'border-transparent hover:bg-white/[0.02] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-semibold text-white truncate max-w-[160px]">{thread.title}</h4>
                    <span className="text-[9px] text-slate-500">{thread.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-1">{thread.lastMessage}</p>
                  <div className="flex gap-1.5 mt-2">
                    <span className="text-[8px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">{thread.model}</span>
                    {thread.tags?.map((tag, i) => (
                      <span key={i} className="text-[8px] bg-indigo-500/10 px-1.5 py-0.5 rounded text-indigo-400">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-950/40">
        
        {/* Chat Header / Model Switcher */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-900/20">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-xs font-semibold text-white">{activeThread.title}</h3>
              <p className="text-[10px] text-slate-500">Supervisor Routes messages to Specialist Models</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Model Switcher */}
            <span className="text-[10px] text-slate-400 font-medium">Model:</span>
            <select 
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
              className="bg-slate-900/50 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-300"
            >
              <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
              <option value="GPT-4o">GPT-4o</option>
              <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
              <option value="DeepSeek V3">DeepSeek V3</option>
              <option value="Llama 3.1 70B">Llama 3.1 70B</option>
            </select>

            {/* Voice toggle */}
            <button 
              onClick={() => setIsVoiceOutputActive(!isVoiceOutputActive)}
              className={`p-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors ${
                isVoiceOutputActive ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'text-slate-400'
              }`}
              title="Voice Readout Toggle"
            >
              {isVoiceOutputActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {activeThread.messages.map((msg) => (
            <div key={msg.id} className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}>
              <div className={`max-w-[75%] space-y-1.5`}>
                <div className={`flex items-center gap-1.5 text-[10px] text-slate-500 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  {msg.sender === 'supervisor' && <Cpu className="w-3.5 h-3.5 text-cyan-400" />}
                  {msg.sender === 'agent' && <Bot className="w-3.5 h-3.5 text-indigo-400" />}
                  <span>{msg.sender === 'user' ? 'You' : msg.agentName || 'Supervisor AI'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className={`rounded-2xl px-4 py-3.5 text-xs leading-relaxed relative group border ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 border-indigo-500/20 text-white rounded-tr-none'
                    : msg.sender === 'supervisor'
                    ? 'bg-cyan-950/20 border-cyan-500/15 text-cyan-200 rounded-tl-none font-medium'
                    : 'bg-white/5 border-white/10 text-slate-200 rounded-tl-none'
                }`}>
                  
                  {/* Message Content with simple markdown support */}
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.content.split('\n').map((line, key) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <strong key={key} className="block text-white mt-1">{line.replace(/\*\*/g, '')}</strong>;
                      }
                      if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')) {
                        return <div key={key} className="pl-3.5 flex gap-1.5"><span>{line.split(' ')[0]}</span><span>{line.split(' ').slice(1).join(' ')}</span></div>;
                      }
                      if (line.includes('`')) {
                        return (
                          <code key={key} className="block bg-slate-950/60 p-2.5 rounded-lg border border-white/5 font-mono text-[11px] text-indigo-300 overflow-x-auto">
                            {line.replace(/`/g, '')}
                          </code>
                        );
                      }
                      return <p key={key}>{line}</p>;
                    })}
                  </div>

                  {/* PDF or Citation Preview */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3.5 pt-3.5 border-t border-white/5 space-y-1.5">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-indigo-400" /> Cited Sources
                      </span>
                      {msg.citations.map((cite, i) => (
                        <div key={i} className="text-[10px] text-slate-400 bg-slate-900/50 py-1.5 px-2.5 rounded-lg border border-white/5">
                          {cite}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Copy Button */}
                  <button 
                    onClick={() => copyMessageText(msg.content, msg.id)}
                    className="absolute top-2 right-2 p-1 rounded bg-slate-900/80 border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  </button>

                </div>
              </div>
            </div>
          ))}

          {/* Thinking Steps Visual Routing Block */}
          {agentThinkingStep !== 'idle' && (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 max-w-[450px] space-y-3 animate-pulse-glow">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" /> Supervisor Routing Pipeline
              </span>
              
              <div className="flex items-center gap-2 text-xs">
                {/* Step 1: User Request */}
                <div className="flex flex-col items-center flex-1 text-center">
                  <span className="w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] text-slate-300">1</span>
                  <span className="text-[9px] text-slate-400 mt-1">User Query</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-700" />

                {/* Step 2: Supervisor Router */}
                <div className={`flex flex-col items-center flex-1 text-center ${
                  agentThinkingStep === 'supervisor' ? 'text-indigo-400' : 'text-slate-500'
                }`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    agentThinkingStep === 'supervisor' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500 border border-white/5'
                  }`}>2</span>
                  <span className="text-[9px] mt-1">Supervisor AI</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-700" />

                {/* Step 3: Specialist Agent */}
                <div className={`flex flex-col items-center flex-1 text-center ${
                  agentThinkingStep === 'agent' || agentThinkingStep === 'generating' ? 'text-indigo-400' : 'text-slate-500'
                }`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    agentThinkingStep === 'agent' || agentThinkingStep === 'generating' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500 border border-white/5'
                  }`}>3</span>
                  <span className="text-[9px] mt-1 truncate max-w-[80px]">
                    {thinkingAgentName || 'Agent'}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-white/5 flex gap-2">
                <AlertCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>
                  {agentThinkingStep === 'supervisor' && 'Supervisor parsing intent vector embeddings and routing...'}
                  {agentThinkingStep === 'agent' && `Supervisor handoff complete. Routing query to ${thinkingAgentName}...`}
                  {agentThinkingStep === 'generating' && `${thinkingAgentName} is streaming response...`}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* File preview alert */}
        {fileAttachment && (
          <div className="mx-6 px-4 py-2 bg-slate-900/90 border border-white/10 rounded-xl flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-400" /> 
              {fileAttachment.name} ({fileAttachment.type})
            </span>
            <button onClick={() => setFileAttachment(null)} className="text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-white/5 bg-slate-900/10">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            
            {/* Attachments */}
            <label className="absolute left-3 cursor-pointer text-slate-500 hover:text-slate-300">
              <Paperclip className="w-4.5 h-4.5" />
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileUpload}
              />
            </label>

            {/* Main Text Input */}
            <input 
              type="text" 
              ref={chatInputRef}
              placeholder={isVoiceInputActive ? "Listening to your voice..." : "Type message, ask to track order, or check CORS SDK..."} 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              disabled={isGenerating || isVoiceInputActive}
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-10 pr-24 py-3.5 text-xs focus:outline-none focus:border-indigo-500 text-white disabled:opacity-50"
            />

            {/* Action Bar */}
            <div className="absolute right-3.5 flex items-center gap-2">
              {/* Mic toggle */}
              <button 
                type="button"
                onClick={handleVoiceInputToggle}
                className={`p-1.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors ${
                  isVoiceInputActive ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'text-slate-400'
                }`}
                title="Voice Input (STT) simulation"
              >
                {isVoiceInputActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Submit button */}
              <button 
                type="submit" 
                disabled={isGenerating}
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </form>
          
          <div className="flex justify-between items-center mt-2 px-1">
            <span className="text-[9px] text-slate-600">Press Enter to send. Supervisor automatically reviews all workflows.</span>
            {isVoiceInputActive && (
              <span className="text-[9px] text-red-400 animate-pulse flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Speech-to-Text Recording simulator active...
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
