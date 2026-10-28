const path = require('path');
const { crawlUrl } = require('../crawlers/crawler');
const { getPageSpeed } = require('../crawlers/pagespeed');
const { getSearchConsoleData } = require('../crawlers/gsc');
const { validateSchema } = require('../crawlers/schema');
const { analyzeOnPage } = require('../crawlers/onpage');
const { checkRobotsAndSitemap } = require('../crawlers/robots-sitemap');
const { getRankingsData } = require('../crawlers/dataforseo');
const { analyzeTechnicalData } = require('../crawlers/technical');
const { runAiAnalysis } = require('../services/ai-engine');
const { generateAuditPdf } = require('../services/pdf-service');
const { sendWhatsApp } = require('../mocks/twilio.mock');
const { storage } = require('../lib/storage');

/**
 * Execute the 7-step SEO audit pipeline
 */
async function executeAuditPipeline(auditId, options = {}) {
  const audit = await storage.getAuditById(auditId);
  if (!audit) {
    throw new Error(`Audit ${auditId} not found`);
  }

  const url = audit.url;
  const businessType = audit.businessType || 'Dental Clinic';
  const city = audit.city || 'Pune';
  const state = audit.state || 'Maharashtra';

  console.log(`\n========================================================`);
  console.log(`🚀 [Audit Pipeline] Starting audit ${auditId} for: ${url}`);
  console.log(`========================================================`);

  try {
    // ----------------------------------------------------
    // STEP 1: Headless Crawler (Fetch + Cheerio)
    // ----------------------------------------------------
    await storage.updateAudit(auditId, { status: 'crawling', progress: 15 });
    await storage.addLog(auditId, 'STEP_1_CRAWL', 'START', `Starting headless crawl on ${url}`);
    console.log(`[Step 1/7] Crawling URL with Fetch + Cheerio: ${url}`);
    
    const crawledData = await crawlUrl(url);
    await storage.addLog(auditId, 'STEP_1_CRAWL', 'SUCCESS', `Crawl complete. Title: "${crawledData.meta.title}". Found ${crawledData.headings.h1.length} H1s, ${crawledData.images.total} images.`);

    // ----------------------------------------------------
    // STEP 2: PageSpeed Insights API (MOCKED)
    // ----------------------------------------------------
    await storage.updateAudit(auditId, { status: 'pagespeed', progress: 30 });
    await storage.addLog(auditId, 'STEP_2_PAGESPEED', 'START', 'Fetching mobile performance metrics and Core Web Vitals');
    console.log(`[Step 2/7] Running PageSpeed Insights analysis (MOCKED)...`);

    const pagespeedData = await getPageSpeed(url);
    const lcpDisplay = pagespeedData?.audits?.['largest-contentful-paint']?.displayValue || '4.2 s';
    await storage.addLog(auditId, 'STEP_2_PAGESPEED', 'SUCCESS', `PageSpeed complete. Perf Score: ${(pagespeedData.categories.performance.score * 100).toFixed(0)}, LCP: ${lcpDisplay}`);

    // ----------------------------------------------------
    // STEP 3: Google Search Console (MOCKED)
    // ----------------------------------------------------
    await storage.updateAudit(auditId, { status: 'gsc', progress: 45 });
    await storage.addLog(auditId, 'STEP_3_GSC', 'START', 'Fetching search queries, clicks, and impressions from Google Search Console');
    console.log(`[Step 3/7] Fetching Google Search Console metrics (MOCKED)...`);

    const gscData = await getSearchConsoleData(url);
    await storage.addLog(auditId, 'STEP_3_GSC', 'SUCCESS', `GSC complete. Clicks: ${gscData.totalClicks}, Impressions: ${gscData.totalImpressions}, Queries: ${gscData.rows.length}`);

    // ----------------------------------------------------
    // STEP 4: Schema.org validator
    // ----------------------------------------------------
    await storage.updateAudit(auditId, { status: 'schema', progress: 55 });
    await storage.addLog(auditId, 'STEP_4_SCHEMA', 'START', 'Validating Schema.org LD+JSON / Microdata structured entities');
    console.log(`[Step 4/7] Validating Schema.org markup...`);

    const schemaData = await validateSchema(url, crawledData.rawHtmlLength ? null : null);
    await storage.addLog(auditId, 'STEP_4_SCHEMA', 'SUCCESS', `Schema analysis complete. Found types: ${schemaData.detectedTypes.join(', ')}. LocalBusiness present: ${schemaData.hasLocalBusiness}`);

    // ----------------------------------------------------
    // STEP 5: On-page analysis
    // ----------------------------------------------------
    await storage.updateAudit(auditId, { status: 'onpage', progress: 65 });
    await storage.addLog(auditId, 'STEP_5_ONPAGE', 'START', 'Analyzing title tags, meta description, heading hierarchy, image alts');
    console.log(`[Step 5/7] Executing deep On-Page SEO audit...`);

    const onPageData = analyzeOnPage(crawledData, city);
    await storage.addLog(auditId, 'STEP_5_ONPAGE', 'SUCCESS', `On-page audit score: ${onPageData.score}/100. Title length: ${onPageData.titleLength} chars.`);

    // ----------------------------------------------------
    // STEP 6: robots.txt + sitemap.xml check
    // ----------------------------------------------------
    await storage.updateAudit(auditId, { status: 'robots', progress: 75 });
    await storage.addLog(auditId, 'STEP_6_ROBOTS', 'START', 'Validating robots.txt crawl rules and XML sitemap accessibility');
    console.log(`[Step 6/7] Checking robots.txt and sitemap.xml...`);

    const robotsData = await checkRobotsAndSitemap(url);
    await storage.addLog(auditId, 'STEP_6_ROBOTS', 'SUCCESS', `Robots & Sitemap check complete. Robots status: ${robotsData.robotsTxt.statusCode}, Sitemap URLs: ${robotsData.sitemapXml.urlsFound}`);

    // Technical aggregator
    const technicalData = analyzeTechnicalData(crawledData, robotsData, pagespeedData);

    // ----------------------------------------------------
    // STEP 7: DataForSEO rankings (MOCKED)
    // ----------------------------------------------------
    await storage.updateAudit(auditId, { status: 'dataforseo', progress: 85 });
    await storage.addLog(auditId, 'STEP_7_DATAFORSEO', 'START', 'Querying organic keyword rankings and competitor positions');
    console.log(`[Step 7/7] Fetching DataForSEO SERP rankings (MOCKED)...`);

    const rankingsData = await getRankingsData('dental clinic pune', url);
    await storage.addLog(auditId, 'STEP_7_DATAFORSEO', 'SUCCESS', `DataForSEO complete. Client organic rank position: #${rankingsData.client_rank_position}`);

    // ----------------------------------------------------
    // CLAUDE AI ANALYSIS ENGINE
    // ----------------------------------------------------
    await storage.updateAudit(auditId, { status: 'ai_analyzing', progress: 90 });
    await storage.addLog(auditId, 'AI_ANALYSIS', 'START', 'Sending all integrated signals to Claude AI analysis engine');
    console.log(`[AI Engine] Analyzing all signals with Claude Sonnet 4.6 SEO Analyst prompt...`);

    const aiResult = await runAiAnalysis({
      url,
      businessType,
      city,
      state,
      onPageData,
      technicalData,
      cwvData: pagespeedData,
      schemaData,
      gscData,
      rankingsData
    });

    console.log(`[AI Engine] Analysis received! Overall Score: ${aiResult.overall_score}/100, Recommendations: ${aiResult.recommendations.length}`);
    await storage.addLog(auditId, 'AI_ANALYSIS', 'SUCCESS', `AI analysis generated successfully. Score: ${aiResult.overall_score}/100.`);

    // ----------------------------------------------------
    // SUPABASE / POSTGRES PERSISTENCE
    // ----------------------------------------------------
    await storage.updateAudit(auditId, { status: 'saving_db', progress: 95 });
    console.log(`[Database] Persisting audit results and recommendations to data store...`);

    const updatedAudit = await storage.updateAudit(auditId, {
      overallScore: aiResult.overall_score,
      technicalScore: aiResult.score_breakdown?.technical || 78,
      onPageScore: aiResult.score_breakdown?.on_page || 82,
      contentScore: aiResult.score_breakdown?.content || 70,
      cwvScore: aiResult.score_breakdown?.core_web_vitals || 61,
      schemaScore: aiResult.score_breakdown?.schema || 79,
      criticalIssues: aiResult.critical_issues,
      importantIssues: aiResult.important_issues,
      quickWins: aiResult.quick_wins,
      recommendations: aiResult.recommendations,
      executiveSummary: aiResult.executive_summary,
      rawSignals: {
        crawledData,
        pagespeedData,
        gscData,
        schemaData,
        onPageData,
        robotsData,
        technicalData,
        rankingsData
      },
      rawAiResponse: aiResult
    });

    // ----------------------------------------------------
    // PDF REPORT GENERATOR (Puppeteer / PDFKit)
    // ----------------------------------------------------
    await storage.updateAudit(auditId, { status: 'generating_pdf', progress: 98 });
    await storage.addLog(auditId, 'PDF_GENERATION', 'START', 'Generating publication-ready executive PDF audit report');
    console.log(`[PDF Generator] Rendering PDF audit report...`);

    const pdfFileName = `Audit-Report-${auditId}.pdf`;
    const publicReportsDir = path.join(process.cwd(), 'public', 'reports');
    const pdfPath = path.join(publicReportsDir, pdfFileName);
    const pdfUrl = `/reports/${pdfFileName}`;

    await generateAuditPdf({
      url,
      businessType,
      city,
      state,
      overallScore: aiResult.overall_score,
      scoreBreakdown: aiResult.score_breakdown,
      criticalIssues: aiResult.critical_issues,
      importantIssues: aiResult.important_issues,
      quickWins: aiResult.quick_wins,
      recommendations: aiResult.recommendations,
      executiveSummary: aiResult.executive_summary
    }, pdfPath);

    await storage.addLog(auditId, 'PDF_GENERATION', 'SUCCESS', `PDF generated at ${pdfUrl}`);
    console.log(`[PDF Generator] PDF report saved to: ${pdfPath}`);

    // ----------------------------------------------------
    // TWILIO WHATSAPP DELIVERY (MOCKED)
    // ----------------------------------------------------
    console.log(`[Twilio WhatsApp] Delivering audit report notification to client...`);
    const clientId = audit.clientId || 'Client-ApexDental';
    const whatsappResult = await sendWhatsApp(clientId, pdfUrl, aiResult.overall_score);

    await storage.addLog(auditId, 'WHATSAPP_DELIVERY', 'SUCCESS', `WhatsApp notification sent. SID: ${whatsappResult.sid}`);

    // Mark as completed
    const finalAudit = await storage.updateAudit(auditId, {
      status: 'completed',
      progress: 100,
      pdfPath,
      pdfUrl,
      completedAt: new Date().toISOString()
    });

    await storage.addLog(auditId, 'AUDIT_COMPLETE', 'SUCCESS', `SEO Audit pipeline finished successfully for ${url}`);
    console.log(`✅ [Audit Pipeline] Successfully finished audit ${auditId}!\n`);

    return finalAudit;
  } catch (error) {
    console.error(`❌ [Audit Pipeline] Error during audit ${auditId}:`, error);
    await storage.updateAudit(auditId, {
      status: 'failed',
      errorMessage: error.message
    });
    await storage.addLog(auditId, 'AUDIT_ERROR', 'FAILED', `Pipeline error: ${error.message}`);
    throw error;
  }
}

module.exports = { executeAuditPipeline };
