const moment = require('moment');

const { get } = require("../../utils/fetch");

/**
 * Returns a list of the collaboration metrics to use as a baseline.
 * 
 * @param {number} teamId 
 * @param {string} startDate 
 * @param {string} endDate
 * 
 * @returns { Promise<CollaborationMetrics> }
 */
exports.getCollaborationMetricsBaselines = async (
  teamId = null,
) => {
  const endDate = moment().format('YYYY-MM-DD');
  const startDate = moment().subtract(4, 'weeks').format('YYYY-MM-DD');

  return exports.getCollaborationMetrics(teamId, startDate, endDate);
};

/**
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

  const response = get(`https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=${dateRange}&fields=average${team}`);

  return response;
}

/**
 * Divides the collaboration metrics by the number of weeks in the 
 * period.
 * 
 * @param {object} metrics 
 * @param {string} startDate 
 * @param {string} endDate 
 */
exports.changeToWeekly = (metrics, startDate, endDate) => {
  const weeks = moment(endDate).diff(startDate, 'weeks');

};