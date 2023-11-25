/**
 * Compare the current team's metrics with the average of the past 4 weeks.
 * 
 * @typedef { ComparisonItem } ComparisonItem
 * @property { number } current
 * @property { number } target
 * @property { number } change
 * 
 * @typedef { ComparisonObject } ComparisonObject
 * @property { ComparisonItem } active_days
 * @property { ComparisonItem } commit_count
 * @property { ComparisonItem } total_impact
 * @property { ComparisonItem } total_efficiency
 * 
 * @param { number } teamId
 * @returns { CodingMetrics }
 */
exports.compareWithOwnBaselines = async (teamId) => {
  const { getCodingMetricsBaselines, getWeeklyMetrics } = require('../../services/pluralsight/codingMetricsService');
  const { results: [weeklyResults] = {} } = await getWeeklyMetrics(teamId);
  const { results: [baselineResults] = {} } = await getCodingMetricsBaselines(teamId);

  return exports.compareCodingMetrics(weeklyResults, baselineResults);
};

/**
 * Compare two sets of coding metrics.
 * 
 * @typedef { CodingMetrics } CodingMetrics
 * @property { number } active_days
 * @property { number } commit_count
 * @property { number } total_impact
 * @property { number } total_efficiency
 * 
 * @param { CodingMetrics } currentMetrics 
 * @param { CodingMetrics } targetMetrics 
 * @returns { ComparisonObject }
 */
exports.compareCodingMetrics = (currentMetrics, targetMetrics) =>
  (Object.keys(currentMetrics))
    /**
     * Map the keys of the coding metrics to an array of comparison objects.
     */
    .map(key => {
      const current = currentMetrics[key];
      const target = targetMetrics[key];
      const change = current - target;

      return { [key]: { current, target, change } };
    })
    /**
     * Reduce the array of comparison objects into a single object.
     */
    .reduce((acc, cur) => {
      const key = Object.keys(cur)[0];
      acc[key] = cur[key];

      return {
        ...acc,
        [key]: cur[key],
      };
    }, {});