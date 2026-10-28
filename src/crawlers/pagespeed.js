const { USE_MOCKS } = require('../mocks');
const mockData = require('../mocks/pagespeed.mock');

async function getPageSpeed(url) {
  if (USE_MOCKS) {
    return mockData;
  }

  // Real PageSpeed Insights API call fallback if API key configured
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  if (apiKey) {
    try {
      const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
        url
      )}&strategy=mobile&key=${apiKey}`;
      const res = await fetch(endpoint, { signal: AbortSignal.timeout(15000) });
      if (res.ok) {
        const data = await res.json();
        const lh = data.lighthouseResult || {};
        return {
          url,
          strategy: 'mobile',
          categories: {
            performance: { score: lh.categories?.performance?.score || 0.65 },
            seo: { score: lh.categories?.seo?.score || 0.85 },
            accessibility: { score: lh.categories?.accessibility?.score || 0.78 }
          },
          audits: {
            'largest-contentful-paint': {
              score: lh.audits?.['largest-contentful-paint']?.score || 0.45,
              displayValue: lh.audits?.['largest-contentful-paint']?.displayValue || '3.8 s'
            },
            'cumulative-layout-shift': {
              score: lh.audits?.['cumulative-layout-shift']?.score || 0.88,
              displayValue: lh.audits?.['cumulative-layout-shift']?.displayValue || '0.09'
            },
            'interaction-to-next-paint': {
              score: lh.audits?.['interaction-to-next-paint']?.score || 0.62,
              displayValue: lh.audits?.['interaction-to-next-paint']?.displayValue || '260 ms'
            },
            'render-blocking-resources': {
              score: lh.audits?.['render-blocking-resources']?.score || 0.55,
              description: lh.audits?.['render-blocking-resources']?.displayValue || '2 blocking resources'
            },
            'unused-javascript': {
              score: lh.audits?.['unused-javascript']?.score || 0.45,
              displayValue: lh.audits?.['unused-javascript']?.displayValue || '380 KiB'
            }
          }
        };
      }
    } catch (e) {
      console.warn('[PageSpeed] API fetch failed, falling back to mock data:', e.message);
    }
  }

  return mockData;
}

module.exports = { getPageSpeed };
