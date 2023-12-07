const admin = require('firebase-admin');

admin.initializeApp();

const {
  codeMetrics,
  collaborationMetrics,
  metrics,
} = require('./src/handlers/pluralsightHandler');

exports.codeMetrics = codeMetrics;
exports.collaborationMetrics = collaborationMetrics;
exports.metrics = metrics;
