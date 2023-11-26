const moment = require('moment');

const { get } = require("../../utils/fetch");
const { divideNumbersInObject } = require("../../utils/objects");

/**
 * Returns a list of the collaboration metrics to use as a baseline.
 * 
 * @param {number} teamId 
 * @param {string} startDate 
 * @param {string} endDate
 * 
 * @returns { Promise<CollaborationMetrics> }
 */
exports.getCollaborationMetricBaselines = async (
  teamId = null,
) => {
  const endDate = moment().format('YYYY-MM-DD');
  const startDate = moment().subtract(4, 'weeks').format('YYYY-MM-DD');

  return exports.getCollaborationMetrics(teamId, startDate, endDate);
};

/**
 * Returns a list of the collaboration metrics to use adjusted to a week.
 * 
 * @param {number} teamId 
 * @param {string} startDate 
 * @param {string} endDate
 * 
 * @returns { Promise<CollaborationMetrics> }
 */
exports.getWeeklyCollaborationMetricBaselines = async (
  teamId = null,
) => {
  const response = await exports.getCollaborationMetricBaselines(teamId);

  return exports.getCollaborationMetrics(teamId, startDate, endDate);
};

/**
 * Gets the collaboration averages for the given team and date range. If 
 * no team is specified, the global averages are returned.
 * 
 * @returns { Promise<CollaborationMetrics> }
 */
exports.getCollaborationMetrics = (
  teamId,
  startDate,
  endDate
) => {
  const team = teamId !== null
    ? `&team_id=${teamId}`
    : '';

  if (!startDate || !endDate) {
    throw new Error('Start and end dates are required');
  }

  const dateRange = `[${startDate}:${endDate}]`;

  return get(`https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=${dateRange}&fields=average${team}`);
}

/**
 * Divides the collaboration metrics by the number of weeks in the 
 * period.
 * 
 * @param {object} metrics 
 * @param {string} startDate 
 * @param {string} endDate
 * 
 * @return {object}
 */
exports.changeToWeekly = (metrics, startDate, endDate) => {
  const weeks = moment(endDate).diff(startDate, 'weeks');

  return divideNumbersInObject(metrics, weeks);
};

