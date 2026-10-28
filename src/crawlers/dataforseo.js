const { USE_MOCKS } = require('../mocks');
const mockData = require('../mocks/dataforseo.mock');

async function getRankingsData(keyword, domain) {
  if (USE_MOCKS) {
    return mockData;
  }

  // Real DataForSEO call if credentials available
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (login && password) {
    try {
      const auth = Buffer.from(`${login}:${password}`).toString('base64');
      const response = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/advanced', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          {
            language_code: 'en',
            location_code: 2356, // India
            keyword: keyword || 'dental clinic pune'
          }
        ]),
        signal: AbortSignal.timeout(15000)
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (e) {
      console.warn('[DataForSEO] API failed, falling back to mock data:', e.message);
    }
  }

  return mockData;
}

module.exports = { getRankingsData };
