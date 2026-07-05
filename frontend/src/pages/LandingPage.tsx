import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bot, Search, Shield, Zap, RefreshCw, MessageSquare, Volume2, Users, FileText, ArrowRight, Star, CheckCircle, Globe, Play } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentPage, setTheme } = useApp();
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'Hi! I am your AI assistant. Ask me anything about our product pricing, return policy, or features!' },
  ]);

  const handleDemoChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let reply = "That sounds interesting! Our platform automates over 80% of support tickets, syncs with Shopify/Salesforce in 1 click, and triggers human escalation if customers show frustration. Would you like to set up a live demo?";
      if (userMsg.toLowerCase().includes('price') || userMsg.toLowerCase().includes('cost')) {
        reply = "We offer three plans: Starter ($49/mo), Growth ($149/mo), and Enterprise (Custom). You can view the pricing table below or click 'Get Started' to sign up for a free 14-day trial!";
      } else if (userMsg.toLowerCase().includes('refund') || userMsg.toLowerCase().includes('return')) {
        reply = "Our Refund Agent checks order histories automatically on WooCommerce and Stripe, verifies return eligibility, and files Stripe credits in seconds. No manual work required!";
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[150px] pointer-events-none" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Kortex <span className="text-indigo-400 font-medium">Support</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">Documentation</a>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentPage('auth')} 
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2"
          >
            Sign In
          </button>
          <button 
            onClick={() => setCurrentPage('auth')} 
            className="text-sm font-semibold bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
            <Zap className="w-3.5 h-3.5 animate-pulse" /> Supercharging Customer Support
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
            AI Customer Support <br />
            <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
              that Never Sleeps
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0">
            Resolve customer issues instantly using intelligent AI agents powered by leading LLMs. Automatically sync workflows, answer knowledge queries, and build agent workflows.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={() => setCurrentPage('auth')} 
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
            <a 
              href="#pricing"
              className="px-8 py-4 rounded-xl glass border border-white/10 hover:bg-white/5 font-semibold flex items-center justify-center gap-2 transition-all"
            >
              Book Demo <Play className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
            </a>
          </div>

          {/* Social Proof */}
          <div className="pt-8 border-t border-white/5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Trusted by modern sales teams worldwide</p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 grayscale opacity-50">
              <span className="font-bold text-lg text-slate-300">Vercel</span>
              <span className="font-bold text-lg text-slate-300">HubSpot</span>
              <span className="font-bold text-lg text-slate-300">Stripe</span>
              <span className="font-bold text-lg text-slate-300">Linear</span>
            </div>
          </div>
        </div>

        {/* Floating Chatbot Demo Illustration */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="w-full max-w-[420px] h-[500px] glass rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-float">
            {/* Chat header */}
            <div className="p-4 border-b border-white/10 bg-slate-900/50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Customer Copilot</h3>
                <span className="text-[10px] text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" /> Online (Supervisor AI)
                </span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleDemoChatSubmit} className="p-3 border-t border-white/10 bg-slate-900/50 flex gap-2">
              <input 
                type="text" 
                placeholder="Ask about pricing or refund eligibility..." 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-100"
              />
              <button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Metrics Counter Section */}
      <section className="py-16 bg-slate-900/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <h3 className="text-4xl md:text-5xl font-black text-indigo-400">99.9%</h3>
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">Uptime SLA guaranteed</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl md:text-5xl font-black text-indigo-400">80%+</h3>
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">Tickets Automated</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl md:text-5xl font-black text-indigo-400">24 / 7</h3>
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">Support Availability</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl md:text-5xl font-black text-indigo-400">50+</h3>
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">CRM & App Integrations</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6 md:px-12 space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Full Suite Support Engine</h2>
          <p className="text-slate-400">Everything you need to automate conversations, synchronize tickets, trigger workflows, and satisfy customers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Multi-Agent Chat Console</h3>
            <p className="text-sm text-slate-400">Supervisor routing automatically schedules queries to specialist agents: Billing, Tech support, Refunds, or tracking.</p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Search className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Vector RAG Semantic Search</h3>
            <p className="text-sm text-slate-400">Upload docx, pdfs, web sitemaps, and retrieve automated answers cited directly with sources.</p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white">CRM & Shop Integration</h3>
            <p className="text-sm text-slate-400">Automate CRM sync (HubSpot, Pipedrive) and pull live tracking data from WooCommerce and Shopify stores.</p>
          </div>

          {/* Feature 4 */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Voice & Speech Assistant</h3>
            <p className="text-sm text-slate-400">Convert voice logs to ticket text with speech-to-text, and read replies out loud using real-time cloned voice output.</p>
          </div>

          {/* Feature 5 */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Visual Drag-and-Drop Workflows</h3>
            <p className="text-sm text-slate-400">Design triggers (e.g. refund requests) and actions (e.g. notify manager via email, query custom API webhooks).</p>
          </div>

          {/* Feature 6 */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Seamless Human Handoff</h3>
            <p className="text-sm text-slate-400">Automatic sentiment detectors flag customer anger and transfer details to Slack or your live helpdesk.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-slate-900/20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Loved by Operations Leaders</h2>
            <p className="text-slate-400">Hear from our clients who automated their support loops in under a week.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400" />)}
              </div>
              <p className="text-slate-300 italic text-sm">
                "Antigravity resolved 84% of our ticket volume inside the first month. Our technical team no longer answers tedious setup questions, and our developers can focus on building features."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800" />
                <div>
                  <h4 className="font-semibold text-sm text-white">John Connor</h4>
                  <p className="text-xs text-slate-500">VP Operations, TechCorp</p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400" />)}
              </div>
              <p className="text-slate-300 italic text-sm">
                "The workflow builder tool is incredibly intuitive. We mapped custom trigger logic to webhook calls, and automated our refund systems. Integrates beautifully with Shopify."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800" />
                <div>
                  <h4 className="font-semibold text-sm text-white">Elena Fisher</h4>
                  <p className="text-xs text-slate-500">Director of CX, RetailExpress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-6 md:px-12 space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Flexible Pricing Plans</h2>
          <p className="text-slate-400">Find the tier that fits your support volume. Try free for 14 days.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan 1 */}
          <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01] flex flex-col justify-between h-[500px]">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Starter</h3>
                <p className="text-xs text-slate-500 mt-1">Perfect for small startups</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$49</span>
                <span className="text-sm text-slate-500">/month</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4.5 h-4.5 text-indigo-400" /> Up to 500 AI chats/mo</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4.5 h-4.5 text-indigo-400" /> 1 Knowledge Base Doc</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4.5 h-4.5 text-indigo-400" /> Shopify Integration</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4.5 h-4.5 text-indigo-400" /> Standard Email support</li>
              </ul>
            </div>
            <button 
              onClick={() => setCurrentPage('auth')} 
              className="w-full py-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-sm font-semibold transition-colors mt-8"
            >
              Get Started
            </button>
          </div>

          {/* Plan 2 */}
          <div className="glass-panel p-8 rounded-3xl border-2 border-indigo-500 bg-indigo-950/10 flex flex-col justify-between h-[520px] relative scale-105 shadow-2xl shadow-indigo-500/5">
            <div className="absolute top-0 right-6 translate-y-[-50%] bg-indigo-500 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
              Most Popular
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Growth</h3>
                <p className="text-xs text-slate-400 mt-1">For expanding teams</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">$149</span>
                <span className="text-sm text-slate-400">/month</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4.5 h-4.5 text-indigo-400" /> Up to 5,000 AI chats/mo</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4.5 h-4.5 text-indigo-400" /> Unlimited Docs & URLs</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4.5 h-4.5 text-indigo-400" /> Shopify, CRM & Slack Integration</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4.5 h-4.5 text-indigo-400" /> Dynamic Workflow Builder</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4.5 h-4.5 text-indigo-400" /> Human Agent Handoff triggers</li>
              </ul>
            </div>
            <button 
              onClick={() => setCurrentPage('auth')} 
              className="w-full py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all mt-8"
            >
              Get Started
            </button>
          </div>

          {/* Plan 3 */}
          <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01] flex flex-col justify-between h-[500px]">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Enterprise</h3>
                <p className="text-xs text-slate-500 mt-1">For custom requirements</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">Custom</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4.5 h-4.5 text-indigo-400" /> Unlimited AI chats</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4.5 h-4.5 text-indigo-400" /> Dedicated database & hosting</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4.5 h-4.5 text-indigo-400" /> Voice cloning & Live Phone calls</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4.5 h-4.5 text-indigo-400" /> SOC2, GDPR compliant logs</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4.5 h-4.5 text-indigo-400" /> Dedicated success manager</li>
              </ul>
            </div>
            <button 
              onClick={() => setCurrentPage('auth')} 
              className="w-full py-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-sm font-semibold transition-colors mt-8"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 md:px-12 bg-slate-950 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-sm">Kortex Support</span>
        </div>

        <div className="flex gap-8">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Security Audit</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Contact Support</a>
        </div>

        <div>
          © 2026 Kortex Support. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
