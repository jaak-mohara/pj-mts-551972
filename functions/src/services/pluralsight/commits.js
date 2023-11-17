const { get } = require('../../utils/fetch');

/**
 * Retrieves a list of commits for a given team.
 * @return {Promise<[{id: string, message: string, timestamp: string, url: string}]>}
 */
exports.getCommits = async () => {
  return get('https://flow.pluralsight.com/v3/customer/core/commits/');
}