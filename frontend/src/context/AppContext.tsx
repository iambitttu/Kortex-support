import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface User {
  email: string;
  name: string;
  avatarUrl: string;
  organization: string;
  role: 'Admin' | 'Agent' | 'Supervisor';
}

export interface Ticket {
  id: string;
  title: string;
  customerName: string;
  customerEmail: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'Pending' | 'Waiting' | 'Resolved' | 'Closed';
  assignedAgent: string;
  createdAt: string;
  slaMinutes: number;
  messagesCount: number;
  description: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  aiSummary?: string;
  aiSuggestedReply?: string;
  internalNotes?: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: 'Starter' | 'Growth' | 'Enterprise';
  language: string;
  priority: boolean;
  orderNumber: string;
  orderStatus: string;
  orderTotal: string;
  shipmentTracker?: string;
  refundEligible: boolean;
}

export interface KnowledgeDoc {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'TXT' | 'CSV' | 'URL';
  size: string;
  uploadedAt: string;
  chunkCount: number;
  status: 'Indexed' | 'Processing';
  source?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'supervisor' | 'system';
  agentName?: string;
  content: string;
  timestamp: string;
  citations?: string[];
}

export interface ChatThread {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  messages: ChatMessage[];
  model: string;
  agentName?: string;
  tags?: string[];
  folder?: string;
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action';
  label: string;
  description: string;
  x: number;
  y: number;
}

export interface WorkflowConnection {
  fromId: string;
  toId: string;
}

export interface Workflow {
  id: string;
  name: string;
  active: boolean;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
}

interface AppContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  currentOrg: string;
  setCurrentOrg: (org: string) => void;
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  customers: Customer[];
  knowledgeDocs: KnowledgeDoc[];
  setKnowledgeDocs: React.Dispatch<React.SetStateAction<KnowledgeDoc[]>>;
  chatThreads: ChatThread[];
  setChatThreads: React.Dispatch<React.SetStateAction<ChatThread[]>>;
  activeThreadId: string;
  setActiveThreadId: (id: string) => void;
  workflows: Workflow[];
  setWorkflows: React.Dispatch<React.SetStateAction<Workflow[]>>;
  apiKeys: { [key: string]: string };
  setApiKeys: (keys: { [key: string]: string }) => void;
  systemPrompts: { [key: string]: string };
  setSystemPrompts: (prompts: { [key: string]: string }) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  organizationMembers: { email: string; role: string; status: 'active' | 'invited' }[];
  inviteMember: (email: string, role: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>({
    email: 'admin@acme.com',
    name: 'Sarah Connor',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    organization: 'Acme Corp',
    role: 'Admin',
  });
  const [currentOrg, setCurrentOrg] = useState<string>('Acme Corp');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load API Keys from LocalStorage
  const [apiKeys, setApiKeysState] = useState<{ [key: string]: string }>(() => {
    const savedKeys = localStorage.getItem('antigravity_api_keys');
    return savedKeys ? JSON.parse(savedKeys) : { openai: '', anthropic: '', gemini: '', deepseek: '' };
  });

  const setApiKeys = (keys: { [key: string]: string }) => {
    setApiKeysState(keys);
    localStorage.setItem('antigravity_api_keys', JSON.stringify(keys));
  };

  // Prompts config
  const [systemPrompts, setSystemPromptsState] = useState<{ [key: string]: string }>({
    supervisor: 'You are the Support Supervisor Agent. Analyze the user query, retrieve relevant info, and route the customer to Billing, Technical, Refund, Sales, or Order Tracking Agent depending on intent.',
    billing: 'You are the Billing Support Agent. Assist customers with invoice queries, subscriptions, and billing problems.',
    technical: 'You are the Technical Expert. Troubleshoot API keys, system crashes, and SDK integration issues.',
    refund: 'You are the Refund Assistant. Process refunds in accordance with the 30-day money-back guarantee policy.',
    tracking: 'You are the Order Tracking Assistant. Check delivery status, shipment numbers, and Shopify sync details.',
  });

  const setSystemPrompts = (prompts: { [key: string]: string }) => {
    setSystemPromptsState(prompts);
  };

  // Mock Customers
  const [customers] = useState<Customer[]>([
    {
      id: 'CUST-1001',
      name: 'John Miller',
      email: 'john@cyberdyne.com',
      company: 'Cyberdyne Systems',
      plan: 'Enterprise',
      language: 'English',
      priority: true,
      orderNumber: '#SH-4592',
      orderStatus: 'In Transit',
      orderTotal: '$1,299.00',
      shipmentTracker: 'UPS-TRK-74929471',
      refundEligible: true,
    },
    {
      id: 'CUST-1002',
      name: 'Elena Rostova',
      email: 'elena@novacorp.io',
      company: 'Novacorp',
      plan: 'Growth',
      language: 'Spanish',
      priority: false,
      orderNumber: '#SH-1023',
      orderStatus: 'Delivered',
      orderTotal: '$249.50',
      shipmentTracker: 'FEDEX-TRK-98104231',
      refundEligible: false,
    },
    {
      id: 'CUST-1003',
      name: 'Marcus Wright',
      email: 'marcus@projectangel.org',
      company: 'Project Angel',
      plan: 'Starter',
      language: 'English',
      priority: false,
      orderNumber: '#SH-8841',
      orderStatus: 'Processing',
      orderTotal: '$89.00',
      shipmentTracker: undefined,
      refundEligible: true,
    },
  ]);

  // Mock Organization Members
  const [organizationMembers, setOrganizationMembers] = useState<{ email: string; role: string; status: 'active' | 'invited' }[]>([
    { email: 'admin@acme.com', role: 'Admin', status: 'active' },
    { email: 'john.support@acme.com', role: 'Agent', status: 'active' },
    { email: 'supervisor@acme.com', role: 'Supervisor', status: 'active' },
  ]);

  const inviteMember = (email: string, role: string) => {
    setOrganizationMembers(prev => [...prev, { email, role, status: 'invited' }]);
  };

  // Mock Tickets
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TK-301',
      title: 'Web SDK throwing CORS exception on production environment',
      customerName: 'John Miller',
      customerEmail: 'john@cyberdyne.com',
      priority: 'Critical',
      status: 'Open',
      assignedAgent: 'Technical Support Agent',
      createdAt: '2026-07-05T15:30:00Z',
      slaMinutes: 15,
      messagesCount: 4,
      sentiment: 'Negative',
      description: 'We integrated the chat widget into our react platform today. When users hit the trigger script, a CORS exception blocks the socket handoff. Need immediate help.',
      aiSummary: 'Customer experiencing production-blocking CORS issues on Web SDK load.',
      aiSuggestedReply: 'Hello John, this is the Escalation Supervisor. I have reviewed the CORS policy details. Please whitelist the domain "https://cyberdyne.com" under Settings -> API Keys -> Allowed Origins inside your dashboard, then restart your application container. Let me know if the socket resolves.',
      internalNotes: ['SLA breach threat. Agent Sarah assigned. CORS issue suspected.'],
    },
    {
      id: 'TK-302',
      title: 'Incorrect charge on June subscription invoice',
      customerName: 'Elena Rostova',
      customerEmail: 'elena@novacorp.io',
      priority: 'High',
      status: 'Pending',
      assignedAgent: 'Billing Agent',
      createdAt: '2026-07-05T11:20:00Z',
      slaMinutes: 45,
      messagesCount: 2,
      sentiment: 'Neutral',
      description: 'My subscription is $249/mo, but I was charged $399 on the invoice generated on June 30th. I did not purchase any additional agent seats or active user volume. Please adjust this.',
      aiSummary: 'Subscription billing discrepancy ($399 charged instead of $249).',
      aiSuggestedReply: 'Hello Elena, let me review your subscription contract. It appears the charge includes a retroactive seat add-on. I will process a credit adjust request of $150 to your stripe account immediately.',
      internalNotes: ['Review invoice #INV-7482. Credit note ready.'],
    },
    {
      id: 'TK-303',
      title: 'Request refund for order #SH-8841',
      customerName: 'Marcus Wright',
      customerEmail: 'marcus@projectangel.org',
      priority: 'Medium',
      status: 'Resolved',
      assignedAgent: 'Refund Agent',
      createdAt: '2026-07-04T09:00:00Z',
      slaMinutes: 120,
      messagesCount: 3,
      sentiment: 'Positive',
      description: 'The hardware casing received is slightly cracked. I would like a refund or replacement for order #SH-8841 as it arrived defective.',
      aiSummary: 'Refund request for damaged shipment #SH-8841.',
      aiSuggestedReply: 'A refund of $89.00 has been successfully processed to your card ending in 4242. Standard bank processing times are 3-5 business days.',
      internalNotes: ['Automatic refund approved by Refund Assistant workflow.'],
    },
  ]);

  // Mock Knowledge Base Docs
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDoc[]>([
    {
      id: 'KB-101',
      name: 'API_Integration_Guide.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadedAt: '2026-06-15',
      chunkCount: 145,
      status: 'Indexed',
      source: 'Internal Drive',
    },
    {
      id: 'KB-102',
      name: 'Billing_and_Refunds_Policy.docx',
      type: 'DOCX',
      size: '420 KB',
      uploadedAt: '2026-06-20',
      chunkCount: 22,
      status: 'Indexed',
      source: 'Confluence Sync',
    },
    {
      id: 'KB-103',
      name: 'https://docs.acmesupport.com/faq',
      type: 'URL',
      size: '12 KB',
      uploadedAt: '2026-07-01',
      chunkCount: 54,
      status: 'Indexed',
      source: 'Sitemap Scraper',
    },
  ]);

  // Mock Chat Threads (ChatGPT Console)
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([
    {
      id: 'THREAD-1',
      title: 'CORS policy issue in JS SDK',
      lastMessage: 'Let me test updating the CORS origins list.',
      timestamp: '2:15 PM',
      unread: true,
      model: 'Claude 3.5 Sonnet',
      agentName: 'Technical Support Agent',
      tags: ['CORS', 'SDK', 'Urgent'],
      folder: 'Technical Issues',
      messages: [
        {
          id: 'M1',
          sender: 'user',
          content: 'Hello, our web app is throwing a CORS error when attempting to fetch workspace details via your SDK.',
          timestamp: '2:10 PM',
        },
        {
          id: 'M2',
          sender: 'supervisor',
          content: 'Routing this conversation to the Technical Support Agent based on technical keyword context.',
          timestamp: '2:11 PM',
        },
        {
          id: 'M3',
          sender: 'agent',
          agentName: 'Technical Support Agent',
          content: 'Hello! This usually happens if the hostname calling the SDK is not whitelisted. Please go to Settings -> Developer -> Authorized Domains and add your origin `http://localhost:3000` (or production host).',
          timestamp: '2:13 PM',
          citations: ['API_Integration_Guide.pdf (Page 14: Origin Authorization)'],
        },
      ],
    },
    {
      id: 'THREAD-2',
      title: 'Refund Status - Order #SH-8841',
      lastMessage: 'Refund of $89.00 processed successfully.',
      timestamp: 'Yesterday',
      unread: false,
      model: 'GPT-4o',
      agentName: 'Refund Agent',
      tags: ['Billing', 'Refunds'],
      messages: [
        {
          id: 'M4',
          sender: 'user',
          content: 'Can I get a refund for order #SH-8841? It was damaged.',
          timestamp: 'Yesterday 10:00 AM',
        },
        {
          id: 'M5',
          sender: 'agent',
          agentName: 'Refund Agent',
          content: 'Based on our Billing and Refund Policy, damaged shipments are eligible for 100% refund or free replacement within 30 days of delivery. Since your delivery was 4 days ago, you are fully eligible. I will draft the refund request.',
          timestamp: 'Yesterday 10:02 AM',
          citations: ['Billing_and_Refunds_Policy.docx (Section 3: Damaged Goods)'],
        },
      ],
    },
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string>('THREAD-1');

  // Mock Workflows
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: 'WF-1',
      name: 'High Priority Escalation',
      active: true,
      nodes: [
        { id: 'n1', type: 'trigger', label: 'New Message', description: 'When a new message is received', x: 50, y: 150 },
        { id: 'n2', type: 'condition', label: 'Sentiment Negative', description: 'If message sentiment is detected as negative', x: 250, y: 150 },
        { id: 'n3', type: 'action', label: 'Human Handoff', description: 'Escalate to human agent and send Slack alert', x: 450, y: 150 },
      ],
      connections: [
        { fromId: 'n1', toId: 'n2' },
        { fromId: 'n2', toId: 'n3' },
      ],
    },
    {
      id: 'WF-2',
      name: 'Auto Refund Approval',
      active: false,
      nodes: [
        { id: 'w1', type: 'trigger', label: 'Refund Requested', description: 'When refund request is generated', x: 50, y: 100 },
        { id: 'w2', type: 'condition', label: 'Eligible Order', description: 'Check if purchase < 30 days and item is damaged', x: 250, y: 100 },
        { id: 'w3', type: 'action', label: 'Auto-approve Stripe', description: 'Refund order via Stripe API and notify customer', x: 450, y: 100 },
      ],
      connections: [
        { fromId: 'w1', toId: 'w2' },
        { fromId: 'w2', toId: 'w3' },
      ],
    },
  ]);

  // Synchronize CSS Class for Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        currentUser,
        setCurrentUser,
        currentOrg,
        setCurrentOrg,
        tickets,
        setTickets,
        customers,
        knowledgeDocs,
        setKnowledgeDocs,
        chatThreads,
        setChatThreads,
        activeThreadId,
        setActiveThreadId,
        workflows,
        setWorkflows,
        apiKeys,
        setApiKeys,
        systemPrompts,
        setSystemPrompts,
        theme,
        setTheme,
        organizationMembers,
        inviteMember,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
