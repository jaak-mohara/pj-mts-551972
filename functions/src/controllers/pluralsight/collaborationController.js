const { } = require('../../services/pluralsight/collaborationService');

/**
 * Compare the current team's collaboration with the average of the past 4 weeks.
 * 
 * @typedef { ComparisonItem } ComparisonItem 
 * @typedef { ComparisonObject } ComparisonObject
 * 
 * @param { number } teamId
 * @returns { CodingMetrics }
 */
exports.compareWithOwnBaselines = async (teamId) => {
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