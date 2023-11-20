const { getWeekAgoDate } = require('../../helpers/date');
const { get } = require('../../utils/fetch');

/**
 * Returns a summarised list of coding metrics in the week for the given team.
 * @param {string} teamId
 * @return {Promise<[{count: number, next?: number, previous?: number, results: object[]}]>}
 */
exports.getWeeklyMetrics = async (
  teamId,
  startDate = null,
  endDate = null,
) => {
  const start = `start_date=${startDate || getWeekAgoDate()}`;
  const end = endDate ? `&end_date=${endDate}` : '';

  return get(`https://flow.pluralsight.com/v3/customer/metrics/code_fundamentals/period_metrics/?${start}${end}&team_id=${teamId}&include_nested_teams=true&resolution=week`);
};

/**
 * Returns an averaged list of coding metrics for the team over the last 4 weeks.
 * @param {string} teamId
 * @return {Promise<[{count: number, results: object[]}]>}
 */
exports.getCodingMetricsBaselines = async (teamId) => {
  return get()
};
