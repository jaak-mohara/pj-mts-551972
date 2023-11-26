const moment = require('moment');

/**
 * Get the date from a week ago in the format yyyy-mm-dd.
 * @param {Date} date
 * @param {number} weekAgo
 * @return {string}
 */
exports.getWeeksAgoDate = (requestDate = null, weekAgo = 1) => {
  const date = moment(requestDate || new Date());
  const response = date.subtract(weekAgo, 'week');
  return response.format('YYYY-MM-DD');
};

/**
 * Get the current date in the correct format to use in the requests.
 * @param {Date} requestDate 
 * @return {string}
 */
exports.getCurrentDate = (requestDate = null) => {
  const date = moment(requestDate || new Date());
  return date.format('YYYY-MM-DD');
};

/**
 * Gets the date range for the request.
 * 
 * @param {string} requestDate 
 * @param {number} weekAgo 
 * @returns {{startDate: string, endDate: string}}
 */
exports.getDateRange = (endDate = null, weekAgo = 1) => {
  const lowerLimit = moment(endDate).subtract(weekAgo, 'week');
  const upperLimit = (endDate && moment(endDate)) || moment();

  return {
    startDate: lowerLimit.format('YYYY-MM-DD'),
    endDate: upperLimit.format('YYYY-MM-DD'),
  };
};
