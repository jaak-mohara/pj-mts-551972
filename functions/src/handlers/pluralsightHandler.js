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
const { getTeamIds } = require('../repositories/pluralsightRepository');

/**
 * Handles the metrics section from PluralSight.
 */
exports.metrics = onRequest(async (request, response) => {
  try {
    if (!await authenticate(request, firestore())) {
      throw new AuthException();
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
  if (!await authenticate(request, firestore())) {
    throw new AuthException();
  }

  const teams = await getTeamIds(true);

  return response
    .status(200)
    .send(JSON.stringify(refreshTeams(teams, firestore())));
});
