const moment = require('moment');

const { getWeeksAgoDate, getCurrentDate } = require('../helpers/date');
const {
  getPureCodingMetrics,
  getPureCollaborationMetrics,
} = require('../repositories/pluralsightRepository');

/**
 * Update the team tabs in the Google Sheet.
 *
 * @param {[{ id: number, name: string }]} teamIds
 * @param {GoogleSheetService} googleSheetsService
 * @return {Promise<void>}
 */
exports.updateTeamTabs = async (
  teamIds = [],
  googleSheetsService = null,
) => {
  if (googleSheetsService === null) {
    console.error('Google Sheets Service not provided.');
    return;
  }

  return Promise.all(teamIds.map(async ({ id, name }) => {
    const response = googleSheetsService.createTab(name);
    try {
      return await response;
    } catch (error) {
      console.error(error.message);
    }
  }));
};

/**
 * Update the metrics for the list of teams on Google Sheets.
 *
 * @param {[{ id: number, name: string }]} teamIds
 * @param {*} googleSheetsService
 *
 * @return {Promise<void>}
 */
exports.updateMetrics = async (
  teamIds = [],
  googleSheetsService = null,
) => {
  const startDate = getWeeksAgoDate(null, 1);
  const endDate = getCurrentDate();

  return Promise.all(teamIds.map(async ({ id, name }) => {
    const metrics = {
      ...await getPureCodingMetrics(
        startDate,
        endDate,
        id,
      ),
      ...await getPureCollaborationMetrics(
        startDate,
        endDate,
        id,
      ),
    };

    // Sort the keys in the metrics object alphabetically.
    const sortedMetrics = Object.keys(metrics)
      .sort()
      .reduce((accumulator, key) => ({
        ...accumulator,
        [key]: metrics[key],
      }), {});

    const response = googleSheetsService
      .appendRow(
        name,
        [
          moment().format('DD/MM/YYYY'),
          ...Object.values(sortedMetrics),
        ],
      );

    try {
      await response;
      return {
        name,
        success: true,
      };
    } catch (error) {
      console.error(error.message);
      return {
        name,
        success: false,
      };
    }
  }));
};
