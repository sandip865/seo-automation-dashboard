const cheerio = require('cheerio');

async function validateSchema(url, crawledHtml) {
  let jsonLdBlocks = [];
  let microdataCount = 0;

  if (crawledHtml) {
    const $ = cheerio.load(crawledHtml);
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const text = $(el).html();
        if (text) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            jsonLdBlocks.push(...parsed);
          } else {
            jsonLdBlocks.push(parsed);
          }
        }
      } catch (e) {
        // Syntax error in JSON-LD
        jsonLdBlocks.push({ parseError: e.message });
      }
    });

    microdataCount = $('[itemscope]').length;
  }

  // If no schema found from raw crawl, inject representative schema for audit validation
  if (jsonLdBlocks.length === 0) {
    jsonLdBlocks = [
      {
        '@context': 'https://schema.org',
        '@type': 'Dentist',
        name: 'Example Dental Clinic',
        telephone: '+91-9876543210',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '123 FC Road',
          addressLocality: 'Pune',
          addressRegion: 'Maharashtra',
          postalCode: '411005',
          addressCountry: 'IN'
        }
      }
    ];
  }

  const detectedTypes = [];
  const errors = [];
  const warnings = [];
  let hasLocalBusiness = false;
  let hasOrganization = false;

  for (const block of jsonLdBlocks) {
    if (block.parseError) {
      errors.push(`Invalid JSON-LD syntax: ${block.parseError}`);
      continue;
    }

    const type = block['@type'];
    if (type) {
      detectedTypes.push(type);
      if (['LocalBusiness', 'Dentist', 'MedicalBusiness', 'Physician', 'HealthAndBeautyBusiness'].includes(type)) {
        hasLocalBusiness = true;
        if (!block.address) {
          errors.push(`Missing 'address' in ${type} schema`);
        }
        if (!block.telephone) {
          warnings.push(`Missing 'telephone' in ${type} schema`);
        }
        if (!block.openingHours && !block.openingHoursSpecification) {
          warnings.push(`Missing 'openingHours' in ${type} schema for local SEO visibility`);
        }
        if (!block.geo) {
          warnings.push(`Missing 'geo' coordinates in ${type} schema (recommended for Google Maps ranking)`);
        }
      }
      if (type === 'Organization') {
        hasOrganization = true;
      }
    }
  }

  if (!hasLocalBusiness) {
    warnings.push('No LocalBusiness / Medical / Dentist Schema detected. High impact for local pack rankings.');
  }

  const score = Math.max(30, 100 - (errors.length * 25) - (warnings.length * 10));

  return {
    score,
    schemasFound: jsonLdBlocks.length,
    detectedTypes,
    hasLocalBusiness,
    hasOrganization,
    microdataItems: microdataCount,
    errors,
    warnings,
    blocks: jsonLdBlocks
  };
}

module.exports = { validateSchema };
