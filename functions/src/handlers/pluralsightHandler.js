const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');

const {
  getComparedCodingMetrics,
} = require('../repositories/pluralsightRepository');
const { getCurrentDate } = require('../helpers/date');

exports.codeMetrics = onRequest(async (request, response) => {
  logger.info('codeMetrics', request.query);

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

  response
    .status(200)
    .send(JSON.stringify(metrics));
});

exports.collaborationMetrics = onRequest(async (request, response) => {
  logger.info('collaborationMetrics', request.query);

  const {
    endDate = getCurrentDate(),
    startDate = null,
    teamId = null,
  } = request.query;

  const metrics = await getComparedCollaborationMetrics(
    startDate,
    endDate,
    teamId,
  );

  response
    .status(200)
    .send(JSON.stringify(metrics));
});