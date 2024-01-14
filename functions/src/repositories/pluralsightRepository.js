const moment = require('moment');

const {
  getWeeksAgoDate,
  getCurrentDate,
} = require('../helpers/date');
const pluralsightService = require('../services/pluralsight');
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
    iterated_prs: typeof metrics.iterated_prs === 'object' ?
      {
        average: metrics.iterated_prs.average / weeks,
      } :
      metrics.iterated_prs / weeks,
    unreviewed_prs: typeof metrics.unreviewed_prs === 'object' ?
      {
        average: metrics.unreviewed_prs.average / weeks,
      } :
      metrics.unreviewed_prs / weeks,
    thoroughly_reviewed_prs: typeof metrics
      .thoroughly_reviewed_prs === 'object' ?
      {
        average: metrics.thoroughly_reviewed_prs.average / weeks,
      } :
      metrics.thoroughly_reviewed_prs / weeks,
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
    );
};

/**
 * Returns a list of the collaboration metrics.
 *
 * @param {string} startDate
 * @param {string} endDate
 * @param {number} teamId
 * @param {boolean} extractAverage
 *
 * @return { Promise<CollaborationMetrics> }
 */
exports.getCollaborationMetrics = async (
  startDate,
  endDate,
  teamId = null,
  extractAverage = false,
) => {
  if (!endDate) {
    throw new ValidationException('End date is required');
  }

  const metrics = await pluralsightService
    .getCollaborationMetrics(
      startDate || getWeeksAgoDate(endDate, 1),
      endDate,
      teamId,
    );

  if (!extractAverage) {
    return metrics;
  }

  const response = {};

  Object
    .keys(metrics)
    .forEach((key) => {
      if (typeof metrics[key] === 'object') {
        response[key] = metrics[key].average;
        return;
      }

      response[key] = metrics[key];
    });

  return response;
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
 * Gets the team's pure coding metrics over the last 4 weeks.
 *
 * @param {string} startDate
 * @param {string} endDate
 * @param {number} teamId
 * @return {Promise<{ComparedCodingMetrics}>}
 */
exports.getPureCodingMetrics = (startDate, endDate, teamId) => {
  return exports.getCodingMetrics(
    startDate,
    endDate,
    teamId,
  );
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

  return this
    .compareMetrics(
      this.getParsedCollaborationMetrics(currentMetrics),
      this.getParsedCollaborationMetrics(targetMetrics),
    );
};

/**
 * Returns a list of the pure collaboration metrics.
 *
 * @param {string} startDate
 * @param {string} endDate
 * @param {number} teamId
 *
 * @return {Promise<T>}
 */
exports.getPureCollaborationMetrics = async (
  startDate,
  endDate,
  teamId,
) => {
  const upperBound = endDate || getCurrentDate();

  return this
    .changeToWeekly(
      await this.getCollaborationMetrics(
        startDate || getWeeksAgoDate(upperBound, 1),
        upperBound,
        teamId,
        true,
      ),
      startDate,
      endDate,
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
      name: capitalise ? name.toUpperCase() : name,
    }));
};

/**
 * Queries the database to see if the team exists and returns the ID
 * of that team on Pluralsight.
 *
 * @param {string} name
 * @param {*} database
 * @return {Promise<number>}
 */
exports.getTeamIdByName = async (name, database) => {
  const snapshot = await database
    .collection('teams')
    .where('name', '==', name)
    .get();

  if (snapshot.empty) {
    return 0;
  }

  return snapshot.docs[0].data().id;
};
