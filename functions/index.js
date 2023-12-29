const admin = require('firebase-admin');

admin.initializeApp();

const {
  comparisons,
  teams,
  metrics,
} = require('./src/handlers/pluralsightHandler');

exports.comparisons = comparisons;
exports.teams = teams;
exports.metrics = metrics;
