# Edgelink Technology — SEO Automation Dashboard
> **Role:** AI Developer & Automation Engineer — Technical Assessment  
> **Built with:** Next.js 14 (App Router) + Node.js + BullMQ + Anthropic Claude API (Sonnet 4.6) + Prisma + Tailwind CSS

---

## 📋 Table of Contents
1. [Overview & Architecture](#-overview--architecture)
2. [Dual-Portal Interface](#-dual-portal-interface)
3. [The 7-Step Audit Pipeline Flow](#-the-7-step-audit-pipeline-flow)
4. [Mock Architecture & Zero-Cost Strategy](#-mock-architecture--zero-cost-strategy)
5. [Tech Stack](#-tech-stack)
6. [Folder Structure](#-folder-structure)
7. [Getting Started & Installation](#-getting-started--installation)
8. [Database Schema (Prisma + Supabase / Neon)](#-database-schema)
9. [API Routes Reference](#-api-routes-reference)
10. [End-to-End Video Recording Guide (3–5 min)](#-video-recording-guide)
11. [Submission Details](#-submission-details)

---

## 🌟 Overview & Architecture

The **SEO Automation Dashboard** is an enterprise-grade automated website audit platform designed for Indian local business, healthcare, dental, and real estate sectors.

It automates technical website crawling, performance telemetry extraction, search visibility metrics, and AI analysis using Anthropic Claude to produce **falsifiable, impact-ranked recommendations** and generates executive-ready PDF audit reports delivered via WhatsApp and email.

```
TRIGGER (Manual Admin Click / cron-job.org)
   │
   ▼
BullMQ QUEUE: seo-audit-jobs [Upstash Redis (Serverless) / Local Runner]
   │
   ▼
WORKER RUNNER (Node.js)
   ├── Step 1: Headless Crawl (Fetch + Cheerio DOM parsing)
   ├── Step 2: Google PageSpeed Insights (MOCKED / Real API)
   ├── Step 3: Google Search Console (MOCKED - queries, CTR, pos)
   ├── Step 4: Schema.org Validator (JSON-LD & Microdata entities)
   ├── Step 5: On-Page Analysis (H1 hierarchy, title/meta, alt text)
   ├── Step 6: robots.txt + sitemap.xml check
   └── Step 7: DataForSEO Rankings (MOCKED - SERP competitors)
   │
   ▼
Claude AI Engine (claude-sonnet-4-6 Master Prompt)
   │ ➔ Generates prioritized, falsifiable JSON recommendations
   ▼
Database Persistence (Prisma + Supabase / Neon Postgres)
   │
   ▼
PDF Report Generator (Publication-grade vector PDF report)
   │
   ▼
Twilio WhatsApp Delivery (MOCK console.log & client delivery)
```

---

## 🖥 Dual-Portal Interface

### 1. Internal Admin Portal (`/` with Admin Tab)
* **Real-time BullMQ Pipeline Tracker:** Displays active queue progress (0% to 100%) across all 11 lifecycle stages with animated status pills.
* **Live Worker Execution Stream:** Timestamped streaming terminal logs detailing every crawler step.
* **Trigger New Audit Form:** Configurable target website URL, business sector, location (e.g. Pune, Maharashtra), and client assignment.
* **Preset Benchmarks:** One-click presets for dental clinic and healthcare benchmarks.
* **Audit History:** Sortable, filterable audit records with overall health score badges, quick PDF downloads, and client dashboard view links.

### 2. Client-Facing Dashboard (`/audit/[id]` or Client Tab)
* **Hero Health Score:** Large visual score gauge (0–100) and letter grade rating (Grade A/B/C).
* **5-Pillar Score Breakdown:** Technical SEO, On-Page SEO, Content Depth, Core Web Vitals, and Schema & Local SEO.
* **Executive Summary:** Plain-English, high-impact diagnosis tailored to local search competitiveness.
* **3 Action Priority Cards:** Critical Issues (Red), Important Issues (Amber), and Quick Wins (&le; 2 hours effort).
* **Actionable Recommendations Matrix:** Filterable by category (`CWV`, `Schema`, `OnPage`, `Technical`, `Content`) featuring:
  * Priority (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`)
  * Problem Finding & Step-by-Step Fix
  * Estimated Impact & Effort
  * **Falsifiability Check:** Concrete verification criteria to measure outcome.
* **Integrated Signals Deep-Dive:**
  * Core Web Vitals (LCP 4.2s, CLS 0.08, INP 280ms, 420 KiB unused JS)
  * Google Search Console (4,560 impressions, 167 clicks, queries table)
  * DataForSEO SERP Rankings (Organic rank #4 vs competitors)
  * Schema.org Entity Validator (Dentist, PostalAddress, GeoCoordinates)
* **Actions:** One-click **Download PDF Audit Report** & **Send WhatsApp Notification**.

---

## 🔄 The 7-Step Audit Pipeline Flow

Every triggered audit strictly follows the 7-step sequence defined in **Section 3.2**:

1. **Step 1: Fetch + Cheerio Headless Crawler (`src/crawlers/crawler.js`)**  
   Extracts Title, Meta Description, Canonical, H1–H4 tags, Open Graph metadata, internal/external links, image count & missing alt attributes, and raw body word count.
2. **Step 2: Google PageSpeed Insights (`src/crawlers/pagespeed.js`)**  
   Measures mobile Core Web Vitals: LCP, CLS, INP, render-blocking resources, and unused JavaScript payloads.
3. **Step 3: Google Search Console (`src/crawlers/gsc.js`)**  
   Retrieves search queries, click volume, impressions, CTR percentages, average keyword positions, and index coverage errors.
4. **Step 4: Schema.org Validator (`src/crawlers/schema.js`)**  
   Parses `application/ld+json` scripts, validates required attributes for LocalBusiness / Dentist / Medical entities, and flags missing `geo` coordinates or `openingHours`.
5. **Step 5: On-Page Analysis (`src/crawlers/onpage.js`)**  
   Evaluates title tag length (40–60 chars), meta description length (120–160 chars), heading hierarchy (single H1), image alt coverage, and local keyword presence.
6. **Step 6: robots.txt + sitemap.xml Check (`src/crawlers/robots-sitemap.js`)**  
   Pings `/robots.txt` and `/sitemap.xml`, checks disallow directives, crawl status codes, and XML format validity.
7. **Step 7: DataForSEO Rankings (`src/crawlers/dataforseo.js`)**  
   Extracts organic SERP positions and competitive ranking groups against competitor domains.

---

## 🔑 Mock Architecture & Zero-Cost Strategy

As specified in **Section 2.1 & 2.2**, the application enforces a strict mock toggle switch to enable zero-cost end-to-end evaluation without requiring paid agency keys.

```
src/
└── mocks/
    ├── index.js             # USE_MOCKS toggle switch
    ├── pagespeed.mock.js    # Exact PageSpeed Insights mock data
    ├── gsc.mock.js          # Exact Google Search Console mock data
    ├── dataforseo.mock.js   # Exact DataForSEO rankings mock data
    └── twilio.mock.js       # WhatsApp console.log mock
```

Toggle flag in `.env`:
```env
USE_MOCKS=true
```

When `USE_MOCKS=true`, the system runs completely free of external API fees, logging the simulated WhatsApp dispatch:
```
[MOCK WHATSAPP] → Client: client-1
[MOCK WHATSAPP] → Score:  74/100
[MOCK WHATSAPP] → Report: /reports/Audit-Report-audit_1793192804174.pdf
```

---

## 🛠 Tech Stack

| Layer | Component | Technology |
|---|---|---|
| **Presentation** | Admin Portal | Next.js 14 App Router + Tailwind CSS |
| **Presentation** | Client Dashboard | Next.js 14 App Router + Tailwind CSS |
| **Queue / Workers** | BullMQ Job Queue | BullMQ + Upstash Redis (with async runner fallback) |
| **Crawler** | Headless Crawler | Fetch + Cheerio (Serverless compatible) |
| **AI Engine** | Claude API | Anthropic Claude (`claude-3-5-sonnet-20241022` / mock) |
| **Reporting** | PDF Generator | PDFKit / Puppeteer branded executive report generator |
| **Data Layer** | ORM & Database | Prisma + Supabase / Neon (PostgreSQL) |
| **Notifications** | Report Delivery | Twilio WhatsApp mock |

---

## 📂 Folder Structure

```
edgelink/
├── prisma/
│   └── schema.prisma         # Prisma schema for Client, Audit, Recommendation, Logs
├── public/
│   └── reports/              # Generated PDF audit reports
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── audit/
│   │   │   │   ├── route.ts          # List all audits & stats
│   │   │   │   ├── trigger/route.ts  # POST: Enqueue audit job in BullMQ
│   │   │   │   └── [id]/route.ts     # GET: Audit details & live logs
│   │   │   ├── clients/route.ts      # Client management CRUD
│   │   │   └── cron/audit/route.ts   # Automated recurring cron endpoint
│   │   ├── audit/[id]/page.tsx       # Dedicated client report route
│   │   ├── layout.tsx                # Root layout & styling
│   │   └── page.tsx                  # Main dual-portal switcher
│   ├── components/
│   │   ├── AdminPortal.tsx           # Admin control portal & job tracker
│   │   └── ClientDashboard.tsx       # Client presentation dashboard
│   ├── crawlers/
│   │   ├── crawler.js                # Step 1: Headless Cheerio crawler
│   │   ├── pagespeed.js              # Step 2: PageSpeed Insights
│   │   ├── gsc.js                    # Step 3: Google Search Console
│   │   ├── schema.js                 # Step 4: Schema.org validator
│   │   ├── onpage.js                 # Step 5: On-Page analysis
│   │   ├── robots-sitemap.js         # Step 6: robots.txt & sitemap.xml
│   │   ├── dataforseo.js             # Step 7: DataForSEO SERP rankings
│   │   └── technical.js              # Technical signals aggregator
│   ├── lib/
│   │   ├── queue.js                  # BullMQ queue & worker runner
│   │   └── storage.js                # Dual-mode database storage
│   ├── mocks/
│   │   ├── index.js                  # USE_MOCKS toggle switch
│   │   ├── pagespeed.mock.js         # Exact PageSpeed mock data
│   │   ├── gsc.mock.js               # Exact GSC mock data
│   │   ├── dataforseo.mock.js        # Exact DataForSEO mock data
│   │   └── twilio.mock.js            # Twilio WhatsApp console mock
│   ├── services/
│   │   ├── ai-engine.js              # Claude Sonnet 4.6 Master SEO Prompt
│   │   └── pdf-service.js            # Publication-grade PDF report generator
│   └── workers/
│       └── audit-pipeline.js         # 7-step pipeline executor
├── .env.example                      # Documented environment variables
├── package.json
└── README.md
```

---

## 🚀 Getting Started & Installation

### Prerequisites
* **Node.js:** v18.0.0 or higher (v20+ recommended)
* **npm:** v9+

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd edgelink
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `USE_MOCKS=true` is enabled for zero-cost operation. If you have an Anthropic Claude API key, you can optionally set `ANTHROPIC_API_KEY="sk-ant-..."` and `USE_MOCKS=false`.

### 3. Generate Database Client
```bash
npx prisma generate
```
*(Optional: If connecting live Supabase/Neon PostgreSQL, set `DATABASE_URL` in `.env` and run `npx prisma db push`).*

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄 Database Schema

The Prisma database schema (`prisma/schema.prisma`) implements the relational architecture:

* **`Client`**: Represents business entities (domain, industry sector, city, state, contact).
* **`Audit`**: Stores audit execution runs, overall health score, 5 category scores, issue summaries, and raw signals.
* **`AuditRecommendation`**: Normalized recommendations with priority, category, finding, fix, estimated impact, effort, and falsifiability check.
* **`AuditLog`**: Granular progress events for the BullMQ runner.

---

## 📡 API Routes Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/audit/trigger` | `POST` | Dispatches an audit job into the BullMQ queue |
| `/api/audit` | `GET` | Returns all audits, queue status, and dashboard statistics |
| `/api/audit/[id]` | `GET` | Fetches audit details and streaming execution logs |
| `/api/clients` | `GET / POST` | Enrolls or retrieves clients |
| `/api/cron/audit` | `GET` | External webhook endpoint for `cron-job.org` |

---

## 🎥 Video Recording Guide (3–5 min)

Follow this script to record your submission video (using Loom, OBS, or Zoom):

1. **Introduction (30s):**
   * Introduce yourself and state the position: **AI Developer & Automation Engineer at Edgelink Technology**.
   * Show the application running at `http://localhost:3000` with the **Admin Control Portal**.
2. **Trigger Audit & BullMQ Queue (1m):**
   * Point to the Trigger Form with `https://example-dental-clinic.com` (Dental Clinic, Pune).
   * Click **"Enqueue & Run Audit Pipeline"**.
   * Highlight the **BullMQ Queue visualizer**: show the job moving from `queued` &rarr; `crawling` &rarr; `pagespeed` &rarr; `gsc` &rarr; `schema` &rarr; `onpage` &rarr; `robots` &rarr; `dataforseo`.
3. **Claude AI Intelligence (1m):**
   * Show the terminal / console output where Claude analyzes the consolidated signals using the Master SEO prompt.
   * Point out the structured JSON returned with falsifiability checks.
4. **Database & PDF Generation (1m):**
   * Show the audit record saved in the history table.
   * Click **"Download PDF"** to open the generated PDF report and showcase the Edgelink branding, score breakdown, and recommendations matrix.
5. **Client Dashboard & WhatsApp Notification (30s):**
   * Switch to the **Client Dashboard** tab.
   * Highlight the circular score gauge (74/100), Critical Issues, and interactive Recommendations Matrix.
   * Click **"Send WhatsApp Report"** and show the simulated console output:
     `[MOCK WHATSAPP] → Client: client-1 → Score: 74/100`.

---

## ✉️ Submission Details

* **To:** `hr@edgelinktechnology.com`
* **Subject:** `Technical Assessment — AI Developer — [Your Full Name]`
* **Attachments / Links:**
  1. GitHub Repository Link (add `hr@edgelinktechnology.com` if private)
  2. Video Recording Link (Loom / Google Drive / YouTube unlisted)
  3. PDF Audit Report sample (located at `public/reports/Audit-Report-benchmark.pdf`)

---
*Confidential — Edgelink Technology Assessment Build*
