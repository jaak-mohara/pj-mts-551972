const { onRequest } = require('firebase-functions/v2/https');

const {
  MethodNotAllowedException,
} = require('../exceptions/MethodNotAllowedException');
const {
  getCodeMetrics,
  getCollaborationMetrics,
} = require('../controllers/pluralsightControllers');

/**
 * Handles the metrics section from PluralSight.
 */
exports.metrics = onRequest(async (request, response) => {
  try {
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
    if (error instanceof MethodNotAllowedException) {
      return response.status(error.status).send(error.message);
    }

    return response.status(500).send(error.message);
  }
});
