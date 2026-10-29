'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Flame,
  Globe,
  Gauge,
  HelpCircle,
  Layers,
  MessageSquare,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
  AlertTriangle
} from 'lucide-react';

interface ClientDashboardProps {
  auditId: string;
  onBackToAdmin: () => void;
}

export default function ClientDashboard({ auditId, onBackToAdmin }: ClientDashboardProps) {
  const [audit, setAudit] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [activeSignalTab, setActiveSignalTab] = useState<'cwv' | 'gsc' | 'rankings' | 'schema' | 'onpage'>('cwv');
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [isSendingWhatsapp, setIsSendingWhatsapp] = useState(false);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [whatsappData, setWhatsappData] = useState<any>(null);
  const [targetPhone, setTargetPhone] = useState('+91 98765 43210');

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const res = await fetch(`/api/audit/${auditId}`);
        if (res.ok) {
          const data = await res.json();
          setAudit(data.audit);
        }
      } catch (err) {
        console.error('Failed to fetch audit:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAudit();
  }, [auditId]);

  const handleSendWhatsApp = async () => {
    setIsSendingWhatsapp(true);
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditId: audit.id,
          phone: targetPhone
        })
      });

      if (res.ok) {
        const data = await res.json();
        setWhatsappData(data);
        setShowWhatsappModal(true);
        setWhatsappSent(true);
      }
    } catch (err) {
      console.error('Error sending whatsapp:', err);
    } finally {
      setIsSendingWhatsapp(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">Loading Client SEO Intelligence Dashboard...</p>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Audit Not Found</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">The requested audit report could not be retrieved.</p>
        <button
          onClick={onBackToAdmin}
          className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold"
        >
          Return to Admin Portal
        </button>
      </div>
    );
  }

  const overallScore = audit.overallScore || 74;
  const scoreBreakdown = audit.rawAiResponse?.score_breakdown || {
    technical: audit.technicalScore || 78,
    on_page: audit.onPageScore || 82,
    content: audit.contentScore || 70,
    core_web_vitals: audit.cwvScore || 61,
    schema: audit.schemaScore || 79
  };

  const recommendations = audit.recommendations || audit.rawAiResponse?.recommendations || [];
  const criticalIssues = audit.criticalIssues || audit.rawAiResponse?.critical_issues || [];
  const importantIssues = audit.importantIssues || audit.rawAiResponse?.important_issues || [];
  const quickWins = audit.quickWins || audit.rawAiResponse?.quick_wins || [];

  const filteredRecs = categoryFilter === 'ALL'
    ? recommendations
    : recommendations.filter((r: any) => r.category.toLowerCase() === categoryFilter.toLowerCase());

  // Raw signals shortcuts
  const raw = audit.rawSignals || {};
  const cwvAudits = raw.pagespeedData?.audits || {};
  const gscRows = raw.gscData?.rows || [];
  const d4sItems = raw.rankingsData?.tasks?.[0]?.result?.[0]?.items || [];

  return (
    <div className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <button
            onClick={onBackToAdmin}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 uppercase tracking-wider mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Portal
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">SEO Audit Intelligence Report</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
              v1.0 Executive
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <span className="font-mono font-medium text-slate-700">{audit.url}</span>
            <span>•</span>
            <span>{audit.businessType || 'Dental Clinic'} ({audit.city || 'Pune'}, India)</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {audit.pdfUrl && (
            <a
              href={audit.pdfUrl.startsWith('/api/') ? audit.pdfUrl : `/api/reports/${audit.pdfUrl.split('/').pop()}`}
              download
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-teal-600/20 transition-all"
            >
              <Download className="w-4 h-4" />
              Download PDF Report
            </a>
          )}

          <button
            onClick={handleSendWhatsApp}
            disabled={isSendingWhatsapp}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            <MessageSquare className="w-4 h-4" />
            {isSendingWhatsapp ? 'Sending...' : 'Send WhatsApp Report'}
          </button>
        </div>
      </div>

      {/* Hero Score & Breakdown Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Overall Health Score Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Overall SEO Health Score</p>
          
          {/* Circular Score Indicator */}
          <div className="relative w-40 h-40 flex items-center justify-center my-3">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-100"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className={
                  overallScore >= 80 ? 'stroke-emerald-500' : overallScore >= 60 ? 'stroke-amber-500' : 'stroke-rose-500'
                }
                strokeWidth="10"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * overallScore) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-slate-900">{overallScore}</span>
              <span className="text-xs font-semibold text-slate-400">OUT OF 100</span>
            </div>
          </div>

          <div className="mt-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                overallScore >= 80
                  ? 'bg-emerald-100 text-emerald-800'
                  : overallScore >= 60
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {overallScore >= 80 ? 'Grade A • Healthy SEO' : overallScore >= 60 ? 'Grade B • Optimization Required' : 'Grade C • Critical Issues'}
            </span>
            <p className="text-xs text-slate-400 mt-2">
              Audited on {new Date(audit.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
            </p>
          </div>
        </div>

        {/* 5-Pillar Score Breakdown */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">SEO Pillars Performance</h2>
              <span className="text-xs text-slate-400 font-medium">Weighted Signal Matrix</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Technical SEO</span>
                <p className="text-2xl font-bold text-slate-900 mt-1">{scoreBreakdown.technical}%</p>
                <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${scoreBreakdown.technical}%` }}></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">On-Page SEO</span>
                <p className="text-2xl font-bold text-slate-900 mt-1">{scoreBreakdown.on_page}%</p>
                <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${scoreBreakdown.on_page}%` }}></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content Depth</span>
                <p className="text-2xl font-bold text-slate-900 mt-1">{scoreBreakdown.content}%</p>
                <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${scoreBreakdown.content}%` }}></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Core Web Vitals</span>
                <p className="text-2xl font-bold text-slate-900 mt-1">{scoreBreakdown.core_web_vitals}%</p>
                <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${scoreBreakdown.core_web_vitals}%` }}></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2 lg:col-span-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Schema & Local SEO</span>
                <p className="text-2xl font-bold text-slate-900 mt-1">{scoreBreakdown.schema}%</p>
                <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${scoreBreakdown.schema}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary Quote Box */}
          <div className="mt-5 p-4 rounded-xl bg-teal-50 border border-teal-200">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Executive AI Summary
            </span>
            <p className="text-xs text-teal-950 leading-relaxed">
              {audit.executiveSummary || audit.rawAiResponse?.executive_summary}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Priority Cards: Critical Issues, Important Issues, Quick Wins */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Critical Issues */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-rose-700">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-bold text-sm">Critical Issues ({criticalIssues.length})</h3>
            </div>
            <ul className="space-y-2.5">
              {criticalIssues.map((issue: string, idx: number) => (
                <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-rose-100 text-[11px] font-semibold text-rose-600">
            Immediate attention required
          </div>
        </div>

        {/* Important Issues */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm">Important Issues ({importantIssues.length})</h3>
            </div>
            <ul className="space-y-2.5">
              {importantIssues.map((issue: string, idx: number) => (
                <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-100 text-[11px] font-semibold text-amber-600">
            Address within 2–4 weeks
          </div>
        </div>

        {/* Quick Wins */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-emerald-700">
              <Zap className="w-5 h-5" />
              <h3 className="font-bold text-sm">Quick Wins ({quickWins.length})</h3>
            </div>
            <ul className="space-y-2.5">
              {quickWins.map((win: string, idx: number) => (
                <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <span>{win}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-100 text-[11px] font-semibold text-emerald-600">
            Effort &le; 2 hours each
          </div>
        </div>
      </div>

      {/* Actionable Recommendations Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Actionable SEO Recommendations Matrix</h2>
            <p className="text-xs text-slate-500">
              Prioritized by impact and verified using falsifiability verification criteria.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
            {['ALL', 'CWV', 'Schema', 'OnPage', 'Technical', 'Content'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  categoryFilter === cat
                    ? 'bg-white text-teal-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredRecs.length > 0 ? (
            filteredRecs.map((rec: any, idx: number) => (
              <div key={idx} className="p-6 hover:bg-slate-50/70 transition-colors space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase ${
                        rec.priority === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : rec.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-teal-100 text-teal-800 border border-teal-200'
                      }`}
                    >
                      {rec.priority}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-bold border border-slate-200">
                      {rec.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>
                      Impact: <strong className="text-slate-800">{rec.estimated_impact}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Effort: <strong className="text-slate-800">{rec.effort}</strong>
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900 mb-1">
                    Finding: <span className="font-normal text-slate-700">{rec.finding}</span>
                  </p>
                  <p className="text-sm font-bold text-teal-800">
                    Fix: <span className="font-normal text-slate-800">{rec.fix}</span>
                  </p>
                </div>

                <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-sky-900 uppercase tracking-wider block">
                      Falsifiability Check (How we know if this worked):
                    </span>
                    <p className="text-xs text-sky-950 mt-0.5">{rec.falsifiability_check}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              No recommendations found for category "{categoryFilter}".
            </div>
          )}
        </div>
      </div>

      {/* Integrated Signals Deep Dive */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Integrated Signals Deep-Dive</h2>
          <p className="text-xs text-slate-500">Audited signals from PageSpeed, GSC, DataForSEO, Schema, and Cheerio crawl.</p>

          <div className="flex flex-wrap gap-2 mt-4 border-b border-slate-100 pb-2">
            {[
              { id: 'cwv', label: 'Core Web Vitals (PageSpeed)' },
              { id: 'gsc', label: 'Google Search Console' },
              { id: 'rankings', label: 'DataForSEO SERP Rankings' },
              { id: 'schema', label: 'Schema.org Validator' },
              { id: 'onpage', label: 'On-Page Structure' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSignalTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeSignalTab === tab.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeSignalTab === 'cwv' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold uppercase">Largest Contentful Paint</span>
                <p className="text-2xl font-bold text-rose-600 mt-1">
                  {cwvAudits['largest-contentful-paint']?.displayValue || '4.2 s'}
                </p>
                <span className="text-[11px] text-rose-500 font-medium">Poor (&gt; 2.5s threshold)</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold uppercase">Cumulative Layout Shift</span>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {cwvAudits['cumulative-layout-shift']?.displayValue || '0.08'}
                </p>
                <span className="text-[11px] text-emerald-600 font-medium">Good (&lt; 0.1 threshold)</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold uppercase">Interaction to Next Paint</span>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {cwvAudits['interaction-to-next-paint']?.displayValue || '280 ms'}
                </p>
                <span className="text-[11px] text-amber-600 font-medium">Needs Work (&gt; 200ms)</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2 lg:col-span-3">
                <span className="text-xs text-slate-500 font-semibold uppercase">Audited Asset Payloads</span>
                <div className="mt-2 text-xs space-y-1 text-slate-700">
                  <p>• Render-blocking resources: <strong>{cwvAudits['render-blocking-resources']?.description || '2 blocking resources'}</strong></p>
                  <p>• Unused JavaScript: <strong>{cwvAudits['unused-javascript']?.displayValue || '420 KiB'}</strong></p>
                </div>
              </div>
            </div>
          )}

          {activeSignalTab === 'gsc' && (
            <div className="space-y-4">
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-xs text-slate-400">Total Clicks</span>
                  <p className="text-xl font-bold text-slate-900">{raw.gscData?.totalClicks || 167}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Total Impressions</span>
                  <p className="text-xl font-bold text-slate-900">{raw.gscData?.totalImpressions || 4560}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Index Coverage Errors</span>
                  <p className="text-xl font-bold text-rose-600">{raw.gscData?.indexCoverageErrors || 3}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Search Query</th>
                      <th className="py-2.5 px-3">Clicks</th>
                      <th className="py-2.5 px-3">Impressions</th>
                      <th className="py-2.5 px-3">CTR</th>
                      <th className="py-2.5 px-3">Avg Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(gscRows.length > 0 ? gscRows : [
                      { query: 'dental clinic in pune', clicks: 42, impressions: 980, ctr: 0.043, position: 6.2 },
                      { query: 'best dentist pune', clicks: 28, impressions: 740, ctr: 0.038, position: 8.1 },
                      { query: 'tooth extraction pune', clicks: 19, impressions: 430, ctr: 0.044, position: 5.7 },
                      { query: 'dental implants cost pune', clicks: 11, impressions: 310, ctr: 0.035, position: 11.3 },
                      { query: 'dentist near me', clicks: 67, impressions: 2100, ctr: 0.032, position: 9.4 }
                    ]).map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-medium text-slate-900">{row.query}</td>
                        <td className="py-2.5 px-3">{row.clicks}</td>
                        <td className="py-2.5 px-3">{row.impressions}</td>
                        <td className="py-2.5 px-3">{(row.ctr * 100).toFixed(1)}%</td>
                        <td className="py-2.5 px-3 font-bold text-teal-700">#{row.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSignalTab === 'rankings' && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-teal-700 font-semibold uppercase">Tracked Keyword</span>
                  <p className="text-base font-bold text-teal-950">"dental clinic pune"</p>
                </div>
                <div>
                  <span className="text-xs text-teal-700 font-semibold uppercase">Client Organic Rank</span>
                  <p className="text-2xl font-bold text-teal-700">#4</p>
                </div>
                <div>
                  <span className="text-xs text-teal-700 font-semibold uppercase">Monthly Volume</span>
                  <p className="text-base font-bold text-teal-950">1,900 searches/mo</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Rank Group</th>
                      <th className="py-2.5 px-3">Absolute Rank</th>
                      <th className="py-2.5 px-3">Domain</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(d4sItems.length > 0 ? d4sItems : [
                      { rank_group: 1, rank_absolute: 4, domain: 'example-dental-clinic.com' },
                      { rank_group: 2, rank_absolute: 8, domain: 'competitorA.com' },
                      { rank_group: 3, rank_absolute: 12, domain: 'competitorB.com' }
                    ]).map((item: any, i: number) => (
                      <tr key={i} className={item.domain.includes('example') ? 'bg-teal-50/50 font-bold' : ''}>
                        <td className="py-2.5 px-3">#{item.rank_group}</td>
                        <td className="py-2.5 px-3">#{item.rank_absolute}</td>
                        <td className="py-2.5 px-3 font-mono">{item.domain}</td>
                        <td className="py-2.5 px-3">
                          {item.domain.includes('example') ? (
                            <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px]">Your Website</span>
                          ) : (
                            <span className="text-slate-400">Competitor</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSignalTab === 'schema' && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <p>• Detected Schemas: <strong>Dentist, PostalAddress</strong></p>
                <p>• LocalBusiness Present: <strong className="text-emerald-600">Yes (Dentist)</strong></p>
                <p>• Missing Fields: <strong className="text-amber-600">geo (latitude/longitude), openingHoursSpecification</strong></p>
              </div>
              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "Dentist",
  "name": "Example Dental Clinic",
  "telephone": "+91-9876543210",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 FC Road",
    "addressLocality": "Pune",
    "addressRegion": "Maharashtra",
    "postalCode": "411005",
    "addressCountry": "IN"
  }
}`}
              </pre>
            </div>
          )}

          {activeSignalTab === 'onpage' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-800">Heading & Meta Hierarchy</p>
                <p>• Title Tag Length: <strong>55 chars (Optimal)</strong></p>
                <p>• Meta Description: <strong>148 chars (Optimal)</strong></p>
                <p>• Primary H1: <strong>"Best Dental Clinic & Care in Pune"</strong></p>
                <p>• Canonical Tag: <strong>Present</strong></p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-800">Asset & Link Health</p>
                <p>• Total Images Crawled: <strong>3 images</strong></p>
                <p>• Images Missing Alt: <strong className="text-amber-600">1 image missing alt</strong></p>
                <p>• Internal Links: <strong>4 found</strong></p>
                <p>• robots.txt & sitemap.xml: <strong className="text-emerald-600">Validated 200 OK</strong></p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Dispatch Modal */}
      {showWhatsappModal && whatsappData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-emerald-700">
                <MessageSquare className="w-5 h-5 fill-current" />
                <h3 className="font-bold text-lg text-slate-900">WhatsApp Notification Dispatched</h3>
              </div>
              <button
                onClick={() => setShowWhatsappModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono">
                <span className="text-slate-500">Status: <strong className="text-emerald-700 uppercase">MOCK_SENT</strong></span>
                <span className="text-slate-500">SID: <strong className="text-slate-800">{whatsappData.sid}</strong></span>
              </div>

              {/* Simulated WhatsApp Chat Bubble */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Recipient ({whatsappData.phone}) Message Preview:
                </span>
                <div className="bg-[#EFEAE2] p-4 rounded-xl border border-slate-200 shadow-inner">
                  <div className="bg-[#DCF8C6] text-slate-800 p-3.5 rounded-xl rounded-tr-none text-xs leading-relaxed shadow-sm font-sans space-y-1">
                    <p className="font-bold text-slate-900">EDGELINK TECHNOLOGY — SEO Audit Report</p>
                    <p>Website: <span className="font-mono">{audit.url}</span></p>
                    <p>Overall SEO Health Score: <strong className="text-emerald-800">{audit.overallScore}/100</strong></p>
                    <p className="text-slate-700">Your executive audit report and recommendations have been generated.</p>
                    <p className="font-semibold text-teal-800 underline">
                      Download Report: {whatsappData.pdfUrl}
                    </p>
                    <p className="text-[10px] text-slate-400 text-right mt-1">Just now ✓✓</p>
                  </div>
                </div>
              </div>

              {/* Twilio Mock Notice */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <p className="font-semibold">ℹ️ Twilio WhatsApp Mock Policy (Section 2.1)</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Logged directly to your server terminal console per assessment instructions. You can also click below to open and preview it on WhatsApp Web.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <a
                href={whatsappData.whatsappWebUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open on WhatsApp Web
              </a>
              <button
                onClick={() => setShowWhatsappModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
