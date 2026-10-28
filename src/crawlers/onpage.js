function analyzeOnPage(crawledData, location = 'Pune') {
  const { meta, headings, images, links, content } = crawledData;

  const checks = [];
  let score = 100;

  // 1. Title tag analysis
  const titleLen = meta?.titleLength || 0;
  if (!meta?.title) {
    checks.push({
      item: 'Title Tag',
      status: 'FAILED',
      message: 'Title tag is missing.',
      impact: 'HIGH'
    });
    score -= 20;
  } else if (titleLen < 30 || titleLen > 65) {
    checks.push({
      item: 'Title Tag Length',
      status: 'WARNING',
      message: `Title length is ${titleLen} characters (recommended 45-60 characters).`,
      impact: 'MEDIUM'
    });
    score -= 8;
  } else {
    checks.push({
      item: 'Title Tag Length',
      status: 'PASSED',
      message: `Title length is optimal (${titleLen} characters).`,
      impact: 'LOW'
    });
  }

  // Check location in title
  const hasLocationInTitle = meta?.title?.toLowerCase().includes(location.toLowerCase());
  if (!hasLocationInTitle) {
    checks.push({
      item: 'Title Geo-Targeting',
      status: 'WARNING',
      message: `Target location (${location}) is missing from title tag. Crucial for Google local search rankings.`,
      impact: 'HIGH'
    });
    score -= 10;
  } else {
    checks.push({
      item: 'Title Geo-Targeting',
      status: 'PASSED',
      message: `Target location (${location}) present in title tag.`,
      impact: 'LOW'
    });
  }

  // 2. Meta description analysis
  const descLen = meta?.metaDescriptionLength || 0;
  if (!meta?.metaDescription) {
    checks.push({
      item: 'Meta Description',
      status: 'FAILED',
      message: 'Meta description is missing.',
      impact: 'HIGH'
    });
    score -= 15;
  } else if (descLen < 110 || descLen > 165) {
    checks.push({
      item: 'Meta Description Length',
      status: 'WARNING',
      message: `Meta description is ${descLen} characters (recommended 120-160 characters).`,
      impact: 'MEDIUM'
    });
    score -= 6;
  } else {
    checks.push({
      item: 'Meta Description Length',
      status: 'PASSED',
      message: `Meta description length is optimal (${descLen} characters).`,
      impact: 'LOW'
    });
  }

  // 3. Heading hierarchy
  const h1Count = headings?.h1?.length || 0;
  if (h1Count === 0) {
    checks.push({
      item: 'H1 Heading',
      status: 'FAILED',
      message: 'No H1 heading found on page.',
      impact: 'HIGH'
    });
    score -= 15;
  } else if (h1Count > 1) {
    checks.push({
      item: 'Multiple H1 Headings',
      status: 'WARNING',
      message: `Found ${h1Count} H1 tags. Best practice is exactly 1 primary H1 per page.`,
      impact: 'MEDIUM'
    });
    score -= 5;
  } else {
    checks.push({
      item: 'H1 Heading Structure',
      status: 'PASSED',
      message: `Single, focused H1 found: "${headings.h1[0]}"`,
      impact: 'LOW'
    });
  }

  // 4. Image Alt text
  if (images?.total > 0 && images?.missingAlt > 0) {
    checks.push({
      item: 'Image Alt Tags',
      status: 'WARNING',
      message: `${images.missingAlt} of ${images.total} images are missing alt attributes.`,
      impact: 'MEDIUM'
    });
    score -= Math.min(15, images.missingAlt * 5);
  } else if (images?.total > 0) {
    checks.push({
      item: 'Image Alt Tags',
      status: 'PASSED',
      message: 'All images have alt tags.',
      impact: 'LOW'
    });
  }

  // 5. Content depth / Word count
  const wordCount = content?.wordCount || 0;
  if (wordCount < 250) {
    checks.push({
      item: 'Thin Content',
      status: 'WARNING',
      message: `Low text content (${wordCount} words). Recommended minimum 500+ words for local service landing pages.`,
      impact: 'HIGH'
    });
    score -= 12;
  } else {
    checks.push({
      item: 'Content Depth',
      status: 'PASSED',
      message: `Healthy word count (${wordCount} words).`,
      impact: 'LOW'
    });
  }

  // 6. Canonical & Viewport
  if (!meta?.canonical) {
    checks.push({
      item: 'Canonical Tag',
      status: 'WARNING',
      message: 'Canonical URL tag is missing.',
      impact: 'MEDIUM'
    });
    score -= 5;
  }

  return {
    score: Math.max(20, Math.min(100, score)),
    title: meta?.title,
    titleLength: titleLen,
    metaDescription: meta?.metaDescription,
    metaDescriptionLength: descLen,
    wordCount,
    headingSummary: {
      h1Count,
      h2Count: headings?.h2?.length || 0,
      h3Count: headings?.h3?.length || 0,
      primaryH1: headings?.h1?.[0] || null
    },
    imageSummary: {
      total: images?.total || 0,
      missingAlt: images?.missingAlt || 0
    },
    internalLinksCount: links?.internalCount || 0,
    externalLinksCount: links?.externalCount || 0,
    checks
  };
}

module.exports = { analyzeOnPage };
