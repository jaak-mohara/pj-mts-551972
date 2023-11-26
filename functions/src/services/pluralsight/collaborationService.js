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
  startDate = null,
  endDate = null
) => {
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

  return get(`https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=${dateRange}&fields=average${team}`);
}