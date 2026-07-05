import React, { useState } from 'react';
import { useApp, KnowledgeDoc } from '../context/AppContext';
import { Upload, FileText, Globe, Search, RefreshCw, Plus, CheckCircle, Database, Server, Link, DatabaseZap } from 'lucide-react';

export const KnowledgeBase: React.FC = () => {
  const { knowledgeDocs, setKnowledgeDocs } = useApp();
  const [urlInput, setUrlInput] = useState('');
  const [searchSandboxInput, setSearchSandboxInput] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ chunk: string; source: string; score: number }>>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUrlScrape = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;

    setIsScraping(true);
    
    // Simulate scraping sitemap
    setTimeout(() => {
      const newDoc: KnowledgeDoc = {
        id: `KB-${Date.now()}`,
        name: urlInput.replace(/https?:\/\//, ''),
        type: 'URL',
        size: '18 KB',
        uploadedAt: new Date().toISOString().split('T')[0],
        chunkCount: 38,
        status: 'Indexed',
        source: 'Sitemap Scraper',
      };
      setKnowledgeDocs(prev => [newDoc, ...prev]);
      setUrlInput('');
      setIsScraping(false);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    
    // Simulate progression bar
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          
          setTimeout(() => {
            const newDoc: KnowledgeDoc = {
              id: `KB-${Date.now()}`,
              name: file.name,
              type: file.name.split('.').pop()?.toUpperCase() as any || 'TXT',
              size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
              uploadedAt: new Date().toISOString().split('T')[0],
              chunkCount: Math.floor(Math.random() * 80) + 12,
              status: 'Indexed',
              source: 'Upload Console',
            };
            setKnowledgeDocs(prevDocs => [newDoc, ...prevDocs]);
            setIsUploading(false);
            setUploadProgress(0);
          }, 500);
          
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const handleSandboxSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchSandboxInput.trim()) return;

    // Mock search responses
    const query = searchSandboxInput.toLowerCase();
    let results = [
      {
        chunk: "...In case of damaged goods, customers are entitled to a full replacement or 100% refund, provided the issue is reported within 30 days of the shipping date...",
        source: "Billing_and_Refunds_Policy.docx",
        score: 0.94,
      },
      {
        chunk: "...To avoid API CORS problems, developers should configure allowed domains inside settings. The client instance will reject socket connections from domains that are not whitelisted...",
        source: "API_Integration_Guide.pdf",
        score: 0.82,
      }
    ];

    if (query.includes('cors') || query.includes('api') || query.includes('sdk')) {
      results = [results[1]];
    } else if (query.includes('refund') || query.includes('return')) {
      results = [results[0]];
    }

    setSearchResults(results);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Knowledge Base & RAG Index</h1>
        <p className="text-xs text-slate-400 font-medium">Upload company documents, map public sitemaps, and check vector semantic citations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Document ingest controllers */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* File drag upload & URL scraper */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* File upload container */}
            <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-indigo-400" /> Ingest Documents
              </h3>
              <label className="border-2 border-dashed border-white/10 hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-900/10">
                <FileText className="w-8 h-8 text-slate-500 mb-2" />
                <span className="text-xs text-slate-300 font-semibold text-center">Drag files here or click to browse</span>
                <span className="text-[10px] text-slate-500 text-center mt-1">PDF, DOCX, TXT, CSV, XLS (Max 10MB)</span>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                  disabled={isUploading}
                />
              </label>

              {isUploading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">Uploading and chunking document...</span>
                    <span className="text-indigo-400 font-bold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Sitemap web scraper */}
            <div className="glass p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-indigo-400" /> Scrape Sitemap URL
                </h3>
                <p className="text-[10px] text-slate-500">Provide a documentation URL to crawl sitemaps and recursively chunk page trees.</p>
              </div>

              <form onSubmit={handleUrlScrape} className="space-y-3.5 mt-4">
                <div className="relative">
                  <Link className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input 
                    type="url" 
                    placeholder="https://docs.acme.com/sitemap.xml" 
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isScraping}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/10 transition-colors disabled:opacity-50"
                >
                  {isScraping ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />} 
                  {isScraping ? 'Crawl & Indexing...' : 'Sync Site Map'}
                </button>
              </form>
            </div>

          </div>

          {/* Documents Table */}
          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-slate-900/10 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Indexed Sources ({knowledgeDocs.length})</h3>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                <Database className="w-3 h-3" /> Vector DB synced
              </span>
            </div>
            
            <div className="divide-y divide-white/5">
              {knowledgeDocs.map((doc) => (
                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5">
                      <FileText className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{doc.name}</h4>
                      <p className="text-[10px] text-slate-500">Source: {doc.source} • Chunk count: {doc.chunkCount}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-slate-500">{doc.size}</span>
                    <span className="text-[9px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-semibold border border-green-500/10 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Semantic Search Citations Sandbox */}
        <div className="glass p-6 rounded-2xl border border-white/5 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <DatabaseZap className="w-4 h-4 text-indigo-400" /> RAG Citations Sandbox
            </h3>
            <p className="text-[10px] text-slate-500">Test semantic indexing queries. Type questions below to verify what embeddings resolve and view citation blocks.</p>

            <form onSubmit={handleSandboxSearch} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ask about refund eligibility or CORS..." 
                value={searchSandboxInput}
                onChange={e => setSearchSandboxInput(e.target.value)}
                className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
              />
              <button 
                type="submit" 
                className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-xl text-xs font-semibold transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Results list */}
          <div className="flex-1 overflow-y-auto max-h-[300px] mt-6 space-y-3.5">
            {searchResults.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center py-10 space-y-2">
                <Search className="w-8 h-8 text-slate-600" />
                <p className="text-[10px]">Enter query to execute cosine-similarity lookup.</p>
              </div>
            ) : (
              searchResults.map((res, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="font-bold text-indigo-400 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {res.source}
                    </span>
                    <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-semibold">
                      Cosine: {(res.score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{res.chunk}</p>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-white/5 text-[9px] text-slate-500 flex justify-between items-center">
            <span>Vector space: cosine distance</span>
            <span>Index ID: index_rag_db_acme</span>
          </div>
        </div>

      </div>
    </div>
  );
};
