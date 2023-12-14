const fetch = require('node-fetch');

/**
 * Function that accepts a URL and returns a promise that
 * resolves to the response.
 *
 * @param {string} url
 * @return {Promise<object>}
 */
exports.get = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.PLURALSIGHT_API_KEY}`,
    },
  });
  return response && response.json();
};
