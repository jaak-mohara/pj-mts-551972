const moment = require('moment');

const { get } = require("../../utils/fetch");
const { divideNumbersInObject } = require("../../utils/objects");
const { getDateRange } = require('../../helpers/date');

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
  startDate = null,
  endDate = null,
) => {
  let period = getDateRange(endDate, null, 4)

  return exports.getCollaborationMetrics(
    teamId,
    startDate || period.startDate,
    endDate || period.endDate
  );
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
  const { startDate, endDate } = getDateRange('2023-11-25', 4);
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
  teamId = null,
  startDate = null,
  endDate = null
) => {
  const team = teamId
    ? `&team_id=${teamId}`
    : '';

  let period = getDateRange(endDate, startDate);

  const dateRange = `[${period.startDate}:${period.endDate}]`;

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

