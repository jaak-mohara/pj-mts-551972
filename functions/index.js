const admin = require('firebase-admin');

admin.initializeApp();

const { weeklyCount } = require('./src/handlers/sheetHandler');
const { weeklyUpdate } = require('./src/handlers/pluralsightHandler');

exports.weeklyCount = weeklyCount;
exports.weeklyUpdate = weeklyUpdate;
