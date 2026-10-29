const fs = require('fs');
const path = require('path');

const isVercel = Boolean(process.env.VERCEL);
const DB_FILE = isVercel
  ? path.join('/tmp', 'db.json')
  : path.join(process.cwd(), 'src', 'data', 'db.json');

// In-memory fallback in case of serverless filesystem restrictions
if (!global.__mem_db) {
  global.__mem_db = null;
}

const DEFAULT_INITIAL_DATA = {
  clients: [
    {
      id: 'client-1',
      name: 'Apex Dental Care',
      domain: 'https://example-dental-clinic.com',
      businessType: 'Dental Clinic',
      city: 'Pune',
      state: 'Maharashtra',
      contactEmail: 'contact@example-dental-clinic.com',
      contactPhone: '+91 98765 43210',
      createdAt: new Date().toISOString()
    },
    {
      id: 'client-2',
      name: 'Pune Smile Specialists',
      domain: 'https://punesmiles.in',
      businessType: 'Healthcare / Orthodontics',
      city: 'Pune',
      state: 'Maharashtra',
      contactEmail: 'dr.pune@smiles.in',
      contactPhone: '+91 98220 12345',
      createdAt: new Date().toISOString()
    }
  ],
  audits: [
    {
      id: 'audit_benchmark_sample',
      clientId: 'client-1',
      url: 'https://example-dental-clinic.com',
      businessType: 'Dental Clinic',
      city: 'Pune',
      state: 'Maharashtra',
      status: 'completed',
      progress: 100,
      overallScore: 74,
      technicalScore: 78,
      onPageScore: 82,
      contentScore: 70,
      cwvScore: 61,
      schemaScore: 79,
      criticalIssues: [
        "Largest Contentful Paint (LCP) is critically delayed at 4.2 s, exceeding Google CWV threshold.",
        "Missing Google Maps LocalBusiness GeoCoordinates in Schema.org LD+JSON.",
        "High volume of render-blocking stylesheets and 420 KiB unused JavaScript files."
      ],
      importantIssues: [
        "Keyword gap for high-intent query 'dental implants cost pune' dropping to rank position 11.3.",
        "Total of 3 index coverage errors detected in Google Search Console crawl reports.",
        "Missing localized descriptive ALT text on multiple clinic interior images.",
        "Service landing pages lack structured FAQ schema for Rich Results."
      ],
      quickWins: [
        "Add 'geo' (lat/long) and 'openingHours' to Dentist JSON-LD schema (effort: 30 minutes).",
        "Compress hero banner image to modern WebP format (effort: 45 minutes).",
        "Update Homepage H1 to include: 'Dental Clinic in Pune' (effort: 15 minutes).",
        "Defer non-critical JavaScript bundle to eliminate render-blocking penalty (effort: 1 hour)."
      ],
      recommendations: [
        {
          priority: "CRITICAL",
          category: "CWV",
          finding: "LCP is 4.2 s due to unoptimized hero image assets and 420 KiB unused JS delaying the main viewport render.",
          fix: "Convert hero images to WebP/AVIF format with width/height attributes, preload the primary LCP image tag, and defer non-critical third-party analytics scripts.",
          estimated_impact: "High",
          effort: "Hours",
          falsifiability_check: "PageSpeed Insights mobile LCP drops under 2.4s and Core Web Vitals audit badge turns green in Search Console within 14 days."
        },
        {
          priority: "CRITICAL",
          category: "Schema",
          finding: "Dentist Schema is missing geo coordinates (latitude/longitude) and openingHoursSpecification required for the Pune Google 3-Pack.",
          fix: "Update Schema.org script to include 'geo': {'@type': 'GeoCoordinates', 'latitude': '18.5204', 'longitude': '73.8567'} and explicit opening hours.",
          estimated_impact: "High",
          effort: "Hours",
          falsifiability_check: "Rich Results Test verifies 0 warnings on LocalBusiness, and Google Search Console reports valid Merchant/Local Listing schema."
        },
        {
          priority: "HIGH",
          category: "OnPage",
          finding: "High intent commercial keyword 'dental implants cost pune' has low CTR (3.5%) and position 11.3 (Page 2).",
          fix: "Create a dedicated procedural cost guide page for 'Dental Implants Cost in Pune' featuring transparent price ranges, EMI details, and an FAQ section.",
          estimated_impact: "High",
          effort: "Days",
          falsifiability_check: "Google Search Console average position moves from 11.3 to top 5 within 28 days of indexing."
        },
        {
          priority: "HIGH",
          category: "Technical",
          finding: "2 render-blocking resources and 3 index coverage errors detected preventing optimal crawl budget utilization.",
          fix: "Resolve the 3 crawl 404/redirect errors in Search Console and inline critical CSS while deferring secondary font files.",
          estimated_impact: "Medium",
          effort: "Days",
          falsifiability_check: "Index coverage report in GSC shows 0 errors and server response time drops below 300ms."
        },
        {
          priority: "MEDIUM",
          category: "Content",
          finding: "Content depth is relatively thin on individual service offerings compared to competitors.",
          fix: "Expand service pages to minimum 800+ words with localized patient testimonials, doctor credentials, and step-by-step procedure breakdown.",
          estimated_impact: "Medium",
          effort: "Weeks",
          falsifiability_check: "Organic impressions increase by >35% on DataForSEO tracked keywords within 60 days."
        }
      ],
      executiveSummary: "The website exhibits a healthy technical foundation with an overall SEO score of 74/100, but is held back by slow mobile Core Web Vitals (LCP 4.2s) and incomplete local schema markup. Addressing the render-blocking scripts and adding local GeoCoordinates will quickly boost visibility in Pune's competitive dental pack. Implementing the dedicated implant cost landing page will unlock high-intent patient appointments currently captured by competitors.",
      rawSignals: {
        pagespeedData: {
          categories: { performance: { score: 0.61 }, seo: { score: 0.89 }, accessibility: { score: 0.74 } },
          audits: {
            'largest-contentful-paint': { score: 0.4, displayValue: '4.2 s' },
            'cumulative-layout-shift': { score: 0.9, displayValue: '0.08' },
            'interaction-to-next-paint': { score: 0.6, displayValue: '280 ms' },
            'render-blocking-resources': { score: 0.5, description: '2 blocking resources' },
            'unused-javascript': { score: 0.4, displayValue: '420 KiB' }
          }
        },
        gscData: {
          rows: [
            { query: 'dental clinic in pune', clicks: 42, impressions: 980, ctr: 0.043, position: 6.2 },
            { query: 'best dentist pune', clicks: 28, impressions: 740, ctr: 0.038, position: 8.1 },
            { query: 'tooth extraction pune', clicks: 19, impressions: 430, ctr: 0.044, position: 5.7 },
            { query: 'dental implants cost pune', clicks: 11, impressions: 310, ctr: 0.035, position: 11.3 },
            { query: 'dentist near me', clicks: 67, impressions: 2100, ctr: 0.032, position: 9.4 }
          ],
          totalClicks: 167,
          totalImpressions: 4560,
          indexCoverageErrors: 3
        },
        rankingsData: {
          client_rank_position: 4,
          keyword_search_volume: 1900,
          tasks: [{ result: [{ keyword: 'dental clinic pune', items: [
            { type: 'organic', rank_group: 1, rank_absolute: 4, domain: 'example-dental-clinic.com' },
            { type: 'organic', rank_group: 2, rank_absolute: 8, domain: 'competitorA.com' },
            { type: 'organic', rank_group: 3, rank_absolute: 12, domain: 'competitorB.com' }
          ] }] }]
        }
      },
      pdfUrl: '/reports/Audit-Report-benchmark.pdf',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    }
  ],
  logs: []
};

function ensureDbFile() {
  if (global.__mem_db) return;

  const dir = path.dirname(DB_FILE);
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch {}

  // If on Vercel, try reading initial template from bundled src/data/db.json
  const templatePath = path.join(process.cwd(), 'src', 'data', 'db.json');
  if (!fs.existsSync(DB_FILE)) {
    let dataToInit = DEFAULT_INITIAL_DATA;
    try {
      if (fs.existsSync(templatePath)) {
        const rawTpl = fs.readFileSync(templatePath, 'utf-8');
        dataToInit = JSON.parse(rawTpl);
      }
    } catch {}

    global.__mem_db = JSON.parse(JSON.stringify(dataToInit));

    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToInit, null, 2), 'utf-8');
    } catch (e) {
      // In case of read-only disk, global.__mem_db is already primed!
    }
  }
}

function readDb() {
  ensureDbFile();

  // Try file read first
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      global.__mem_db = parsed;
      return parsed;
    }
  } catch {}

  // Fallback to memory
  if (global.__mem_db) {
    return global.__mem_db;
  }

  return DEFAULT_INITIAL_DATA;
}

function writeDb(data) {
  global.__mem_db = data;
  try {
    ensureDbFile();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    // Silently proceed with global.__mem_db so serverless never throws EROFS error
  }
}

// Storage Interface
const storage = {
  // Clients
  async getClients() {
    const db = readDb();
    return db.clients || [];
  },

  async getClientById(id) {
    const db = readDb();
    return db.clients.find(c => c.id === id) || null;
  },

  async createClient(data) {
    const db = readDb();
    const newClient = {
      id: `client_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...data
    };
    db.clients.push(newClient);
    writeDb(db);
    return newClient;
  },

  // Audits
  async getAudits() {
    const db = readDb();
    return (db.audits || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getAuditById(id) {
    const db = readDb();
    return db.audits.find(a => a.id === id) || null;
  },

  async createAudit(data) {
    const db = readDb();
    const newAudit = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      status: 'queued',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    db.audits.unshift(newAudit);
    writeDb(db);
    return newAudit;
  },

  async updateAudit(id, patch) {
    const db = readDb();
    const idx = db.audits.findIndex(a => a.id === id);
    if (idx === -1) return null;
    db.audits[idx] = {
      ...db.audits[idx],
      ...patch,
      updatedAt: new Date().toISOString()
    };
    writeDb(db);
    return db.audits[idx];
  },

  // Audit Logs
  async addLog(auditId, step, status, message) {
    const db = readDb();
    const log = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      auditId,
      step,
      status,
      message,
      timestamp: new Date().toISOString()
    };
    if (!db.logs) db.logs = [];
    db.logs.push(log);
    writeDb(db);
    return log;
  },

  async getLogsByAuditId(auditId) {
    const db = readDb();
    return (db.logs || []).filter(l => l.auditId === auditId);
  }
};

module.exports = { storage };
