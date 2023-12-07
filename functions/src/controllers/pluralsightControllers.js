const logger = require('firebase-functions/logger');

const {
  getComparedCodingMetrics,
  getComparedCollaborationMetrics,
} = require('../repositories/pluralsightRepository');
const {
  getCurrentDate,
  getWeeksAgoDate,
} = require('../helpers/date');
const {
  MethodNotAllowedException,
} = require('../exceptions/MethodNotAllowedException');

/**
 * Fetches a list of coding metrics for an optional team.
 *
 * @param {*} request
 * @return {Promise<object>}
 */
exports.getCodeMetrics = async (request) => {
  logger.info('codeMetrics', request.query);

  if (request.method !== 'GET') {
    throw new MethodNotAllowedException();
  }

  const {
    endDate = getCurrentDate(),
    startDate = null,
    teamId = null,
  } = request.query;

  const metrics = await getComparedCodingMetrics(
    startDate,
    endDate,
    teamId,
  );

  return metrics;
};

/**
 * Fetches a list of collaboration metrics for an optional team.
 * @param {*} request
 * @return {Promise<object>}
 */
exports.getCollaborationMetrics = async (request) => {
  logger.info('collaborationMetrics', request.query);

  if (request.method !== 'GET') {
    throw new MethodNotAllowedException();
  }

  const {
    endDate = getCurrentDate(),
    startDate = getWeeksAgoDate(getCurrentDate(), 1),
    teamId = null,
  } = request.query;

  const metrics = await getComparedCollaborationMetrics(
    startDate,
    endDate,
    teamId,
  );

  return metrics;
};

/**
 * Syncs the records of the database with the teams from PluralSight.
 *
 * @param {object} teams
 * @param {*} database
 * @return {Promise<*[]>}
 */
exports.refreshTeams = async (teams, database) => {
  return Promise.allSettled(teams.map(async ({ id, name }) => {
    const snapshot = await database
      .collection('teams')
      .where('name', '==', name)
      .get();

    if (snapshot.empty) {
      await database.collection('teams').add({
        id,
        name,
      });
    }

    return database.set({ id, name }, { merge: true });
  }));
};
