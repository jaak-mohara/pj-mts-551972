const { get } = require('../../utils/fetch');

/**
 * Retrieves a list of teams for a given team.
 * 
 * @typedef { Team } Team
 * @return {Promise<[Team]>}
 */
exports.getTeams = () => {
  return get('https://flow.pluralsight.com/v3/customer/core/teams/');
}