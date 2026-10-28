'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Layers,
  Play,
  RefreshCw,
  Search,
  Server,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  AlertTriangle
} from 'lucide-react';

interface AdminPortalProps {
  onSelectAudit: (auditId: string) => void;
}

export default function AdminPortal({ onSelectAudit }: AdminPortalProps) {
  const [audits, setAudits] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalAudits: 0,
    completedCount: 0,
    averageScore: 0,
    activeRunning: 0,
    isRedisConnected: false,
    useMocks: true
  });
  const [loading, setLoading] = useState(true);
  const [isTriggering, setIsTriggering] = useState(false);

  // Form State
  const [targetUrl, setTargetUrl] = useState('https://example-dental-clinic.com');
  const [businessType, setBusinessType] = useState('Dental Clinic');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [selectedClientId, setSelectedClientId] = useState('');

  // Active Job Tracking
  const [activeAuditId, setActiveAuditId] = useState<string | null>(null);
  const [activeAudit, setActiveAudit] = useState<any | null>(null);
  const [activeLogs, setActiveLogs] = useState<any[]>([]);

  // Fetch audits and stats
  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/audit');
      if (res.ok) {
        const data = await res.json();
        setAudits(data.audits || []);
        setClients(data.clients || []);
        setStats(data.stats || {});

        // Check if there is an active running audit
        const running = (data.audits || []).find((a: any) => !['completed', 'failed'].includes(a.status));
        if (running && !activeAuditId) {
          setActiveAuditId(running.id);
        }
      }
    } catch (err) {
      console.error('Failed to load audits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 4000);
    return () => clearInterval(interval);
  }, []);

  // Poll active audit if running
  useEffect(() => {
    if (!activeAuditId) return;

    const pollActiveJob = async () => {
      try {
        const res = await fetch(`/api/audit/${activeAuditId}`);
        if (res.ok) {
          const data = await res.json();
          setActiveAudit(data.audit);
          setActiveLogs(data.logs || []);

          if (['completed', 'failed'].includes(data.audit.status)) {
            fetchDashboardData();
          }
        }
      } catch (err) {
        console.error('Failed to poll active audit:', err);
      }
    };

    pollActiveJob();
    const jobInterval = setInterval(pollActiveJob, 1500);
    return () => clearInterval(jobInterval);
  }, [activeAuditId]);

  // Trigger Audit Handler
  const handleTriggerAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl) return;

    setIsTriggering(true);
    try {
      const res = await fetch('/api/audit/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          businessType,
          city,
          state,
          clientId: selectedClientId || undefined
        })
      });

      if (res.ok) {
        const data = await res.json();
        setActiveAuditId(data.auditId);
        setActiveAudit(data.audit);
        fetchDashboardData();
      } else {
        alert('Failed to trigger audit. Please check server logs.');
      }
    } catch (err) {
      alert('Network error while triggering audit');
    } finally {
      setIsTriggering(false);
    }
  };

  // Pipeline step status helpers
  const pipelineSteps = [
    { key: 'crawling', label: '1. Fetch + Cheerio Crawl' },
    { key: 'pagespeed', label: '2. PageSpeed Insights' },
    { key: 'gsc', label: '3. Google Search Console' },
    { key: 'schema', label: '4. Schema.org Validator' },
    { key: 'onpage', label: '5. On-Page Analysis' },
    { key: 'robots', label: '6. robots & sitemap Check' },
    { key: 'dataforseo', label: '7. DataForSEO Rankings' },
    { key: 'ai_analyzing', label: 'Claude AI Engine' },
    { key: 'saving_db', label: 'Database Persistence' },
    { key: 'generating_pdf', label: 'PDF Report Generation' },
    { key: 'completed', label: 'Twilio WhatsApp & Done' }
  ];

  const getStepStatus = (stepKey: string, currentStatus: string, progress: number) => {
    const stepOrder = pipelineSteps.map(s => s.key);
    const currentIndex = stepOrder.indexOf(currentStatus);
    const stepIndex = stepOrder.indexOf(stepKey);

    if (currentStatus === 'completed') return 'completed';
    if (currentStatus === 'failed') return 'failed';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Admin Control Portal</h1>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800 border border-teal-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              BullMQ Pipeline Active
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              USE_MOCKS=true (Zero API Cost)
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Orchestrating 7-stage SEO crawlers, BullMQ queue worker runner, Anthropic Claude analysis engine, and automated PDF delivery.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
          Refresh
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Audits</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalAudits}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg SEO Score</p>
            <p className="text-2xl font-bold text-slate-900">{stats.averageScore ? `${stats.averageScore}/100` : '--'}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Queue Engine</p>
            <p className="text-sm font-bold text-slate-800">
              {stats.isRedisConnected ? 'Upstash Redis' : 'BullMQ Runner'}
            </p>
            <span className="text-xs text-slate-500">seo-audit-jobs</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Intelligence</p>
            <p className="text-sm font-bold text-slate-800">Claude Sonnet 4.6</p>
            <span className="text-xs text-emerald-600">Master Prompt Active</span>
          </div>
        </div>
      </div>

      {/* Main Trigger & Active Job Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Trigger Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">Trigger New SEO Audit</h2>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            Dispatch an audit job into the BullMQ queue. The worker executes the full 7-step pipeline, calls Claude API, and generates a PDF report.
          </p>

          <form onSubmit={handleTriggerAudit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Website URL
              </label>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example-dental-clinic.com"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Business Sector
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                >
                  <option value="Dental Clinic">Dental Clinic</option>
                  <option value="Healthcare / Multispeciality">Healthcare</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Local Service">Local Business</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Pune"
                  required
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Client Association (Optional)
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              >
                <option value="">-- Standalone Audit --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.domain})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isTriggering}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-md shadow-teal-600/20 transition-all disabled:opacity-50"
              >
                {isTriggering ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Enqueuing in BullMQ...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    Enqueue & Run Audit Pipeline
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick presets */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Preset Benchmark URLs</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setTargetUrl('https://example-dental-clinic.com');
                  setBusinessType('Dental Clinic');
                  setCity('Pune');
                }}
                className="text-xs bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors"
              >
                🦷 Dental Clinic (Pune)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTargetUrl('https://punesmiles.in');
                  setBusinessType('Healthcare / Orthodontics');
                  setCity('Pune');
                }}
                className="text-xs bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors"
              >
                🏥 Pune Smiles Ortho
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Pipeline Progress & Job Visualizer */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-bold text-slate-900">BullMQ Pipeline Runner</h2>
              </div>
              {activeAudit && (
                <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded-md text-slate-600 border border-slate-200">
                  ID: {activeAudit.id.slice(0, 16)}...
                </span>
              )}
            </div>

            {activeAudit ? (
              <div className="space-y-5">
                {/* Progress Bar & Status */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current Pipeline Stage</span>
                      <p className="text-sm font-bold text-slate-900 capitalize flex items-center gap-2 mt-0.5">
                        {activeAudit.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {activeAudit.status === 'failed' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                        {!['completed', 'failed'].includes(activeAudit.status) && (
                          <RefreshCw className="w-4 h-4 text-teal-600 animate-spin" />
                        )}
                        {activeAudit.status.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Progress</span>
                      <p className="text-base font-bold text-teal-600">{activeAudit.progress}%</p>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500 rounded-full"
                      style={{ width: `${activeAudit.progress || 5}%` }}
                    ></div>
                  </div>
                </div>

                {/* Pipeline Flow Steps Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {pipelineSteps.map((step) => {
                    const status = getStepStatus(step.key, activeAudit.status, activeAudit.progress);
                    return (
                      <div
                        key={step.key}
                        className={`p-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                          status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : status === 'active'
                            ? 'bg-teal-50 text-teal-700 border-teal-300 ring-2 ring-teal-500/20 font-bold'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        {status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        {status === 'active' && <RefreshCw className="w-3.5 h-3.5 text-teal-600 animate-spin shrink-0" />}
                        {status === 'pending' && <Clock className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                        <span className="truncate">{step.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Live Console Output */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Worker Execution Stream</span>
                    <span className="text-[10px] text-slate-400">Auto-scrolling stream</span>
                  </div>
                  <div className="bg-slate-950 text-emerald-400 p-3.5 rounded-xl font-mono text-xs max-h-48 overflow-y-auto space-y-1.5 border border-slate-800 shadow-inner">
                    {activeLogs.length > 0 ? (
                      activeLogs.map((log) => (
                        <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                          <span className="text-slate-500 shrink-0">
                            [{new Date(log.timestamp).toLocaleTimeString()}]
                          </span>
                          <span
                            className={
                              log.status === 'SUCCESS'
                                ? 'text-emerald-400'
                                : log.status === 'FAILED'
                                ? 'text-rose-400'
                                : 'text-teal-300'
                            }
                          >
                            {log.message}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500">Worker listening for job execution signals...</p>
                    )}
                  </div>
                </div>

                {/* Audit Completed Action Banner */}
                {activeAudit.status === 'completed' && (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-emerald-900">Audit Completed Successfully!</p>
                      <p className="text-xs text-emerald-700">
                        Overall Score: <span className="font-bold">{activeAudit.overallScore}/100</span> • PDF Generated
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onSelectAudit(activeAudit.id)}
                        className="px-3.5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Client Report
                      </button>
                      {activeAudit.pdfUrl && (
                        <a
                          href={activeAudit.pdfUrl}
                          download
                          className="px-3 py-2 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-500" />
                          PDF
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                <Play className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-600">No Active Audit Running</p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Trigger an audit from the left panel to watch the 7-step crawler pipeline execute in real time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audits History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Audit Job History & Reports</h2>
            <p className="text-xs text-slate-500">Persistent storage of audit results, AI recommendations, and generated PDFs.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
            {audits.length} Audits Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Target Website & Sector</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {audits.length > 0 ? (
                audits.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 font-mono text-xs">{item.url}</div>
                      <div className="text-xs text-slate-400">{item.businessType || 'Dental Clinic'}</div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {item.city || 'Pune'}, {item.state || 'MH'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-full capitalize ${
                          item.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'failed'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-teal-100 text-teal-800 animate-pulse'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.overallScore ? (
                        <span
                          className={`font-bold text-sm px-2.5 py-1 rounded-lg ${
                            item.overallScore >= 80
                              ? 'bg-emerald-50 text-emerald-700'
                              : item.overallScore >= 60
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {item.overallScore}/100
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => onSelectAudit(item.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                      >
                        View Dashboard
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      {item.pdfUrl && (
                        <a
                          href={item.pdfUrl}
                          download
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          PDF
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    No audits found. Click "Enqueue & Run Audit Pipeline" above to run your first audit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
