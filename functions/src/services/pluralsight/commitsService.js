const { get } = require('../../utils/fetch');

/**
 * Retrieves a list of commits for a given team.
 * 
 * @typedef { Commit } Commit
 * @property { string } id
 * @property { string } message
 * @property { string } timestamp
 * @property { string } url
 * 
 * @return {Promise<[Commit]>}
 */
exports.getCommits = async () => {
  return get('https://flow.pluralsight.com/v3/customer/core/commits/');
}