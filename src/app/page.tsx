'use client';

import React, { useState } from 'react';
import AdminPortal from '@/components/AdminPortal';
import ClientDashboard from '@/components/ClientDashboard';
import {
  Activity,
  Layers,
  LayoutDashboard,
  Shield,
  Sparkles,
  Zap,
  Info,
  CheckCircle,
  HelpCircle,
  GitBranch
} from 'lucide-react';

export default function Home() {
  const [activePortal, setActivePortal] = useState<'admin' | 'client'>('admin');
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [showArchModal, setShowArchModal] = useState(false);

  const handleSelectAudit = (id: string) => {
    setSelectedAuditId(id);
    setActivePortal('client');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white font-black text-xl shadow-md shadow-teal-500/20">
              E
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-slate-900 text-lg flex items-center gap-1.5">
                EDGELINK <span className="text-teal-600 font-semibold text-base">TECHNOLOGY</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                SEO AUTOMATION DASHBOARD • ASSESSMENT BUILD
              </p>
            </div>
          </div>

          {/* Dual-Portal Switcher Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActivePortal('admin')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activePortal === 'admin'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Admin Portal
            </button>

            <button
              onClick={() => {
                if (!selectedAuditId) {
                  // Fallback or trigger view
                  setActivePortal('client');
                } else {
                  setActivePortal('client');
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activePortal === 'client'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Client Dashboard
            </button>
          </div>

          {/* Right Architecture & Status Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowArchModal(true)}
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
            >
              <GitBranch className="w-3.5 h-3.5 text-teal-600" />
              Pipeline Architecture
            </button>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activePortal === 'admin' ? (
          <AdminPortal onSelectAudit={handleSelectAudit} />
        ) : (
          <ClientDashboard
            auditId={selectedAuditId || 'latest'}
            onBackToAdmin={() => setActivePortal('admin')}
          />
        )}
      </main>

      {/* Architecture Modal */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-lg text-slate-900">Audit Job Pipeline Flow (Section 3.2)</h3>
              </div>
              <button
                onClick={() => setShowArchModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 font-mono text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4 leading-relaxed">
              <p className="font-bold text-teal-700">TRIGGER: Manual Admin Click / Monthly Cron</p>
              <p>│</p>
              <p className="font-bold text-purple-700">▼ BullMQ QUEUE: seo-audit-jobs [Upstash Redis]</p>
              <p>│</p>
              <p className="font-bold text-slate-900">▼ WORKER picks up job [Node.js Worker Runner]</p>
              <p>│  ├── Step 1: Fetch + Cheerio crawls URL</p>
              <p>│  ├── Step 2: PageSpeed Insights API (MOCKED)</p>
              <p>│  ├── Step 3: Google Search Console (MOCKED)</p>
              <p>│  ├── Step 4: Schema.org validator</p>
              <p>│  ├── Step 5: On-page analysis</p>
              <p>│  ├── Step 6: robots.txt + sitemap.xml check</p>
              <p>│  └── Step 7: DataForSEO rankings (MOCKED)</p>
              <p>│</p>
              <p className="font-bold text-emerald-700">▼ Claude API: analyse all signals -&gt; structured JSON recommendations</p>
              <p>│</p>
              <p className="font-bold text-blue-700">▼ Supabase/Neon (Postgres): store audit result</p>
              <p>│</p>
              <p className="font-bold text-slate-800">▼ PDF Report Generator (Puppeteer / PDFKit)</p>
              <p>│</p>
              <p className="font-bold text-emerald-600">▼ Twilio WhatsApp -&gt; console.log mock & client delivery</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowArchModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Close Diagram
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <p>Edgelink Technology • AI Developer & Automation Engineer Technical Assessment</p>
        <p className="mt-1">Built with Next.js 14 App Router, BullMQ, Claude Sonnet 4.6, Prisma, and Tailwind CSS.</p>
      </footer>
    </div>
  );
}
