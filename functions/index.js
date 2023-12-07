const admin = require('firebase-admin');

admin.initializeApp();

const {
  codeMetrics,
  collaborationMetrics,
  metrics,
  teams,
} = require('./src/handlers/pluralsightHandler');

exports.codeMetrics = codeMetrics;
exports.collaborationMetrics = collaborationMetrics;
exports.metrics = metrics;
exports.teams = teams;
