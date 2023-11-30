const { get } = require('../utils/fetch');

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
};

/**
 * Gets the collaboration averages for the given team and date range. If
 * no team is specified, the global averages are returned.
 *
 * @param {string} startDate
 * @param {string} endDate
 * @param {number} teamId
 *
 * @return { Promise<CollaborationMetrics> }
 */
exports.getCollaborationMetrics = (
  startDate,
  endDate,
  teamId = null,
) => {
  teamId = teamId ? `&team_id=${teamId}` : '';
  const dateRange = `[${startDate}:${endDate}]`;

  return get(`https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=${dateRange}&fields=average${teamId}`);
};

/**
 * Fetches the summary of the coding metrics for the team as a single
 * list for the period.
 *
 * @param {string} startDate
 * @param {string} endDate
 * @param {string} teamId
 *
 * @return {Promise<[{count: number, results: object[]}]>}
 */
exports.getCodingMetricsForPeriod = (startDate, endDate, teamId = null) => {
  startDate = startDate ? `start_date=${startDate}` : '';
  endDate = endDate ? `&end_date=${endDate}` : '';
  teamId = teamId ? `&team_id=${teamId}` : '';

  return get(
    'https://flow.pluralsight.com/v3/customer/metrics/code_fundamentals/period_metrics/' +
    `?${startDate}${endDate}${teamId}` +
    '&include_nested_teams=true&resolution=period',
  );
};
