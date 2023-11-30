const moment = require('moment');

const { divideNumbersInObject } = require('../utils/objects');
const {
  getWeeksAgoDate,
  getCurrentDate,
} = require('../helpers/date');
const pluralsightService = require('../services/pluralsightService');

/**
 * Divides the collaboration metrics by the number of weeks in the
 * period.
 *
 * @param {object} metrics
 * @param {string} startDate
 * @param {string} endDate
 *
 * @return {object}
 */
exports.changeToWeekly = (metrics, startDate, endDate) => {
  const weeks = moment(endDate).diff(startDate, 'weeks');

  return divideNumbersInObject(metrics, weeks);
};

/**
 * Returns an averaged list of coding metrics for the team over the last 4
 * weeks.
 * @param {string} teamId
 * @param {number}  weeksAgo
 * @return {Promise<[{count: number, results: object[]}]>}
 */
exports.getCodingMetricsBaselines = (teamId, weeksAgo = 4) => {
  return pluralsightService.getCodingMetricsForPeriod(
    getWeeksAgoDate(null, weeksAgo),
    getCurrentDate(),
    teamId,
  );
};

/**
 * Returns a list of the collaboration metrics to use as a baseline.
 *
 * @param {number} teamId
 * @param {number} weeksAgo
 *
 * @return { Promise<CollaborationMetrics> }
 */
exports.getCollaborationMetricBaselines = async (
  teamId = null,
  weeksAgo = 4,
) => {
  return pluralsightService
    .getCollaborationMetrics(
      getWeeksAgoDate(null, weeksAgo),
      getCurrentDate(),
      teamId,
    );
};

/**
 * Returns a list of the collaboration metrics to use adjusted to a week.
 *
 * @param {number} teamId
 * @param {number} weeksAgo
 *
 * @return { Promise<CollaborationMetrics> }
 */
exports.getWeeklyCollaborationMetricBaselines = async (
  teamId = null,
  weeksAgo = 4,
) => {
  const metrics = exports.getCollaborationMetricBaselines(
    teamId,
  );

  const weekAdjustedMetrics = exports
    .changeToWeekly(
      metrics,
      getWeeksAgoDate(null, weeksAgo),
      getCurrentDate(),
    );

  return weekAdjustedMetrics;
};

/**
 * Compare two sets of coding metrics.
 *
 * @typedef {{
 *  active_days: number,
 *  commit_count: number,
 *  total_impact: number,
 *  total_efficiency: number,
 * }} CodingMetrics
 *
 * @param { CodingMetrics } currentMetrics
 * @param { CodingMetrics } targetMetrics
 *
 * @return { CodingMetrics }
 */
exports.compareCodingMetrics = (currentMetrics, targetMetrics) =>
  (Object.keys(currentMetrics))
    /**
     * Map the keys of the coding metrics to an array of comparison objects.
     */
    .map((key) => {
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
