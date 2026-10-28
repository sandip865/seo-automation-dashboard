const { USE_MOCKS } = require('../mocks');
const mockData = require('../mocks/gsc.mock');

async function getSearchConsoleData(url) {
  if (USE_MOCKS) {
    return mockData;
  }

  // Real Google Search Console API call would require OAuth2 + domain verification
  // Per Section 2.1: GSC is completely mocked
  return mockData;
}

module.exports = { getSearchConsoleData };
