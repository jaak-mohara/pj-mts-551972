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
}
