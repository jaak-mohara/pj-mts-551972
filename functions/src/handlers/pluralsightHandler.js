const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');

const {
  getComparedCodingMetrics, getComparedCollaborationMetrics,
} = require('../repositories/pluralsightRepository');
const { getCurrentDate, getWeeksAgoDate } = require('../helpers/date');

exports.codeMetrics = async (request, response) => {
  logger.info('codeMetrics', request.query);

  if (request.method !== 'GET') {
    response
      .status(405)
      .send('Method Not Allowed');
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

  response
    .status(200)
    .send(JSON.stringify(metrics));
};

exports.collaborationMetrics = async (request, response) => {
  logger.info('collaborationMetrics', request.query);

  if (request.method !== 'GET') {
    response
      .status(405)
      .send('Method Not Allowed');
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

  response
    .status(200)
    .send(JSON.stringify(metrics));
};

exports.metrics = onRequest(async (request, response) => {
  logger.info('metrics', request.query);

  if (request.method !== 'GET') {
    response
      .status(405)
      .send('Method Not Allowed');
  }

  if (request.originalUrl === '/collaboration') {
    return this.collaborationMetrics(request, response);
  }

  if (request.originalUrl === '/code') {
    return this.codeMetrics(request, response);
  }

  const collaboration = await this.collaborationMetrics(request, response);
  const code = await this.codeMetrics(request, response);

  return response.status(200).send(JSON.stringify({
    ...collaboration,
    ...code,
  }));
});
