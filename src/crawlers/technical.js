function analyzeTechnicalData(crawledData, robotsData, pagespeedData) {
  const url = crawledData.url || 'https://example-dental-clinic.com';
  const isHttps = url.startsWith('https://');

  const issues = [];
  let score = 100;

  if (!isHttps) {
    issues.push('Site is not using HTTPS encryption.');
    score -= 30;
  }

  const audits = pagespeedData?.audits || {};
  const renderBlocking = audits['render-blocking-resources'];
  const unusedJs = audits['unused-javascript'];

  if (renderBlocking && renderBlocking.score < 0.8) {
    issues.push(`Render-blocking resources detected (${renderBlocking.description || 'Impacts FCP and LCP'})`);
    score -= 10;
  }

  if (unusedJs && unusedJs.score < 0.8) {
    issues.push(`High unused JavaScript payload (${unusedJs.displayValue || 'Optimize bundle chunking'})`);
    score -= 10;
  }

  return {
    url,
    isHttps,
    httpStatusCode: crawledData.status || 200,
    server: crawledData.headers?.server || 'nginx',
    contentType: crawledData.headers?.['content-type'] || 'text/html; charset=UTF-8',
    robotsTxtPresent: robotsData?.robotsTxt?.found ?? true,
    sitemapXmlPresent: robotsData?.sitemapXml?.found ?? true,
    canonicalDefined: Boolean(crawledData.meta?.canonical),
    mobileViewport: Boolean(crawledData.meta?.viewport),
    score: Math.max(30, score),
    issues
  };
}

module.exports = { analyzeTechnicalData };
