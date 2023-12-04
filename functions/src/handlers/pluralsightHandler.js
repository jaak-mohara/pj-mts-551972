const { onRequest } = require('firebase-functions/v2/https');

const {
  MethodNotAllowedException,
} = require('../exceptions/MethodNotAllowedException');
const {
  getCodeMetrics,
  getCollaborationMetrics,
} = require('../controllers/pluralsightControllers');

exports.metrics = onRequest(async (request, response) => {
  try {
    if (request.originalUrl === '/collaboration') {
      return response
        .status(200)
        .send(JSON.stringify(await getCollaborationMetrics(request)));
    }

    if (request.originalUrl === '/code') {
      return response
        .status(200)
        .send(JSON.stringify(await getCodeMetrics(request)));
    }

    return response
      .status(200)
      .send(JSON.stringify({
        ...(await getCollaborationMetrics(request)),
        ...(await getCodeMetrics(request)),
      }));
  } catch (error) {
    if (error instanceof MethodNotAllowedException) {
      return response.status(error.status).send(error.message);
    }

    return response.status(500).send(error.message);
  }
});
