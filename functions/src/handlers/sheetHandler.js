// The Cloud Functions for Firebase SDK to set up triggers and logging.
const functions = require('firebase-functions');

const { updateMetrics } = require('../controllers/googleSheets');
const { getTeamIds } = require('../repositories/pluralsightRepository');
const { GoogleSheetService } = require('../services/googleSheets');

exports.weeklyCount = functions
  .region('europe-west2')
  .pubsub.schedule('0 0 * * *')
  .onRun(async (event) => {
    const teamIds = await getTeamIds(true);
    console.log('Updating metrics for teamIds: ', teamIds);
    await updateMetrics(teamIds, new GoogleSheetService());
  });
