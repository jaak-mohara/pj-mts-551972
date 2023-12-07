const moment = require('moment');

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

  return {
    ...metrics,
    iterated_prs: {
      average: metrics.iterated_prs.average / weeks,
    },
    unreviewed_prs: {
      average: metrics.unreviewed_prs.average / weeks,
    },
    thoroughly_reviewed_prs: {
      average: metrics.thoroughly_reviewed_prs.average / weeks,
    },
    pr_count: metrics.pr_count / weeks,
  };
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
 * Returns a list of the collaboration metrics.
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
  if (!endDate) {
    throw new ValidationException('End date is required');
  }

  return pluralsightService
    .getCollaborationMetrics(
      startDate || getWeeksAgoDate(endDate, 1),
      endDate,
      teamId,
    );
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
 * @param { string } comparrisonField
 *
 * @return { CodingMetrics }
 */
exports.compareMetrics = (
  currentMetrics,
  targetMetrics,
  comparrisonField = 'baseline',
) =>
  (Object.keys(currentMetrics))
    /**
     * Map the keys of the coding metrics to an array of comparison objects.
     */
    .map((key) => {
      const current = (currentMetrics[key] || 0).toFixed(1);
      const target = (targetMetrics[key] || 0).toFixed(1);
      const ratio = target ? (current / target).toFixed(1) : 0;

      return { [key]: { current, [comparrisonField]: target, ratio } };
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

/**
 * Compares the team's coding metrics with baselines over the last 4 weeks.
 *
 * @param {string} startDate
 * @param {string} endDate
 * @param {number} teamId
 * @return {Promise<{ComparedCodingMetrics}>}
 */
exports.getComparedCodingMetrics = async (startDate, endDate, teamId) => {
  const currentMetrics = await exports.getCodingMetrics(
    startDate,
    endDate,
    teamId,
  );

  const targetMetrics = await exports.getCodingMetricsBaselines(
    teamId,
  );

  return exports.compareMetrics(currentMetrics, targetMetrics);
};

/**
 * Returns a list of the collaboration metrics compared with the baseline.
 *
 * @param {string} startDate
 * @param {string} endDate
 * @param {number} teamId
 * @return {Promise<CodingMetrics>}
 */
exports.getComparedCollaborationMetrics = async (
  startDate,
  endDate,
  teamId,
) => {
  const upperBound = endDate || getCurrentDate();

  const currentMetrics = this
    .changeToWeekly(await this.getCollaborationMetrics(
      startDate || getWeeksAgoDate(upperBound, 1),
      upperBound,
      teamId,
    ), startDate, endDate);

  const targetMetrics = this.changeToWeekly(
    await this.getCollaborationMetricBaselines(
      teamId,
    ), getWeeksAgoDate(upperBound, 4), upperBound);

  return this.compareMetrics(
    this.getParsedCollaborationMetrics(currentMetrics),
    this.getParsedCollaborationMetrics(targetMetrics),
  );
};

/**
 * Returns the average of the given collaboration metrics on the first level.
 *
 * @param {object} metrics
 * @return {CollaborationMetrics}
 */
exports.getParsedCollaborationMetrics = (metrics) => (Object.keys(metrics))
  .reduce((acc, cur) => {
    acc[cur] = cur === 'pr_count' ?
      metrics[cur] :
      metrics[cur].average;

    return acc;
  }, {});

/**
 * Returns a list of the teams that are registered.
 * 
 * @return {Promise<[Team]>}
 */
exports.getTeams = async () => {
  return pluralsightService.getTeams();
};

/**
 * Get a list of a combination of team id and name.
 *
 * @param {boolean} capitalise whether to change the name to all caps.
 * 
 * @return {Promise<[TeamId]>}
 */
exports.getTeamIds = async (capitalise) => {
  const teams = await this.getTeams();

  return teams.results
    .map(({ id, name }) => ({
      id,
      name: capitalise ? name.toUpperCase() : name
    }));
};
