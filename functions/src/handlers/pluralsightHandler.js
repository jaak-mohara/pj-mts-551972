const { onRequest } = require('firebase-functions/v2/https');
const { firestore } = require('firebase-admin');

const {
  MethodNotAllowedException,
} = require('../exceptions/MethodNotAllowedException');
const {
  getCodeMetrics,
  getCollaborationMetrics,
  refreshTeams,
} = require('../controllers/pluralsightControllers');
const { authenticate } = require('../helpers/auth');
const { AuthException } = require('../exceptions/AuthException');
const {
  getTeamIds,
  getTeamIdByName,
  getPureCollaborationMetrics,
  getPureCodingMetrics,
} = require('../repositories/pluralsightRepository');

/**
 * Handles the metrics section from PluralSight.
 */
exports.comparisons = onRequest(async (request, response) => {
  try {
    const database = firestore();
    if (!await authenticate(request, database)) {
      throw new AuthException();
    }

    if (request.query.teamName) {
      request.query.teamId = await getTeamIdByName(
        request.query.teamName.toUpperCase(),
        database,
      );
    }

    if (
      (new RegExp('^/collaboration$|^/collaboration\\??')).test(request.url)
    ) {
      return response
        .status(200)
        .send(JSON.stringify(await getCollaborationMetrics(request)));
    }

    if (
      (new RegExp('^/code$|^/code\\??')).test(request.url)
    ) {
      return response
        .status(200)
        .send(JSON.stringify(await getCodeMetrics(request)));
    }

    if (
      (new RegExp('^/$|^/\\??')).test(request.url)
    ) {
      return response
        .status(200)
        .send(JSON.stringify({
          ...(await getCollaborationMetrics(request)),
          ...(await getCodeMetrics(request)),
        }));
    }

    return response
      .status(404)
      .send('Route not found.');
  } catch (error) {
    if (
      error instanceof MethodNotAllowedException ||
      error instanceof AuthException
    ) {
      return response.status(error.status).send(error.message);
    }

    return response.status(500).send(error.message);
  }
});

/**
 * Updates the list of teams that we are storing for Pluralsight
 * on the database.
 *
 * @param {*} request
 * @param {*} response
 *
 * @return {Promise<object>}
 */
exports.teams = onRequest(async (request, response) => {
  try {
    const database = firestore();
    if (!await authenticate(request, database)) {
      throw new AuthException();
    }

    if (
      (new RegExp('^/refresh$|^/refresh\\??')).test(request.url)
    ) {
      const teams = await getTeamIds(true);

      await refreshTeams(teams, firestore());

      return response
        .status(200)
        .send(JSON.stringify(teams.map(({ name }) => name)));
    }

    return response
      .status(404)
      .send('Route not found.');
  } catch (error) {
    if (
      error instanceof MethodNotAllowedException ||
      error instanceof AuthException
    ) {
      return response.status(error.status).send(error.message);
    }

    return response.status(500).send(error.message);
  }
});

/**
 * Handles the metrics section from PluralSight.
 */
exports.metrics = onRequest(async (request, response) => {
  try {
    const database = firestore();
    if (!await authenticate(request, database)) {
      throw new AuthException();
    }

    if (request.query.teamName) {
      request.query.teamId = await getTeamIdByName(
        request.query.teamName.toUpperCase(),
        database,
      );
    }

    if (
      (new RegExp('^/collaboration$|^/collaboration\\??')).test(request.url)
    ) {
      return response
        .status(200)
        .send(JSON.stringify(await getPureCollaborationMetrics(request)));
    }

    if (
      (new RegExp('^/code$|^/code\\??')).test(request.url)
    ) {
      return response
        .status(200)
        .send(JSON.stringify(await getPureCodingMetrics(request)));
    }

    if (
      (new RegExp('^/$|^/\\??')).test(request.url)
    ) {
      return response
        .status(200)
        .send(JSON.stringify({
          ...(await getCollaborationMetrics(request)),
          ...(await getCodeMetrics(request)),
        }));
    }

    return response
      .status(404)
      .send('Route not found.');
  } catch (error) {
    if (
      error instanceof MethodNotAllowedException ||
      error instanceof AuthException
    ) {
      return response.status(error.status).send(error.message);
    }

    return response.status(500).send(error.message);
  }
});

exports.weeklyUpdate = onRequest(async (request, response) => {
  const teamIds = await getTeamIds(true);
  console.log('Updating metrics for teamIds: ', teamIds);
  // await updateMetrics(teamIds, new GoogleSheetService());
});
