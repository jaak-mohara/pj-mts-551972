const { getWeeksAgoDate, getCurrentDate } = require('../../helpers/date');
const { get } = require('../../utils/fetch');

/**
 * Returns a summarised list of coding metrics in the week for the given team.
 * @param {string} teamId
 * @return {Promise<[{count: number, next?: number, previous?: number, results: object[]}]>}
 */
exports.getWeeklyMetrics = (
  teamId,
  startDate = null,
  endDate = null,
) => {
  return exports.getCodingMetricsForPeriod(
    teamId,
    `start_date=${startDate || getWeeksAgoDate()}`,
    endDate ? `&end_date=${endDate}` : ''
  );
};

/**
 * Returns an averaged list of coding metrics for the team over the last 4 weeks.
 * @param {string} teamId
 * @param {number}  weeksAgo
 * @return {Promise<[{count: number, results: object[]}]>}
 */
exports.getCodingMetricsBaselines = (teamId, weeksAgo = 4) => {
  return exports.getCodingMetricsForPeriod(
    teamId,
    `start_date=${getWeeksAgoDate(null, weeksAgo)}`,
    `&endDate=${getCurrentDate()}`
  );
};

/**
 * Fetches the summary of the coding metrics for the team as a single list for the period.
 * @param {string} teamId 
 * @param {string} startDate 
 * @param {string} endDate 
 * @return {Promise<[{count: number, results: object[]}]>}
 */
exports.getCodingMetricsForPeriod = (teamId, startDate, endDate) => {
  const team = teamId ? `&team_id=${teamId}` : '';
  return get(
    'https://flow.pluralsight.com/v3/customer/metrics/code_fundamentals/period_metrics/' +
    `?${startDate}${endDate}${team}&include_nested_teams=true&resolution=period`
  );
}
