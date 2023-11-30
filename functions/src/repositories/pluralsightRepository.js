const moment = require('moment');

const { divideNumbersInObject } = require('../utils/objects');
const {
  getWeeksAgoDate,
  getCurrentDate,
} = require('../helpers/date');
const pluralsightService = require('../services/pluralsightService');
const { ValidationException } = require('../exceptions/ValidationException');

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
exports.getCodingMetricsBaselines = async (teamId, weeksAgo = 4) => {
  const response = await pluralsightService.getCodingMetricsForPeriod(
    getWeeksAgoDate(null, weeksAgo),
    getCurrentDate(),
    teamId,
  );

  if (response && response.results) {
    return response.results[0];
  }

  return {
    active_days: 0,
    commit_count: 0,
    total_impact: 0,
    total_efficiency: 0,
  };
};

/**
 * Returns an averaged list of coding metrics for the given team over the
 * given period.
 *
 * @param {string} startDate
 * @param {string} endDate
 * @param {number} teamId
 *
 * @return {Promise<{
 *   active_days: number,
 *   commit_count: number,
 *   total_impact: number,
 *   total_efficiency: number,
 * }>}
 */
exports.getCodingMetrics = async (startDate, endDate, teamId = null) => {
  if (!endDate) {
    throw new ValidationException('End date is required');
  }

  const response = await pluralsightService
    .getCodingMetricsForPeriod(
      startDate || getWeeksAgoDate(endDate, 1),
      endDate,
      teamId,
    );

  if (response && response.results) {
    return response.results[0];
  }

  return {
    active_days: 0,
    commit_count: 0,
    total_impact: 0,
    total_efficiency: 0,
  };
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
      const ratio = target ? current / target : 0;

      return { [key]: { current, target, ratio } };
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
