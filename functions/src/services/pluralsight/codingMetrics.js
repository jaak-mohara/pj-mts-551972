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
  return get(`https://flow.pluralsight.com/v3/customer/metrics/code_fundamentals/period_metrics/?start_date=2021-06-01&end_date=2021-06-30&team_id=12345&include_nested_teams=true&resolution=week`);
};
