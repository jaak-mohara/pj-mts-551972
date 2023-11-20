const moment = require('moment');

/**
 * Get the date from a week ago in the format yyyy-mm-dd.
 * @param {Date} date
 * @return {string}
 */
exports.getWeekAgoDate = (requestDate = null) => {
  const date = moment(requestDate || new Date());
  const response = date.subtract(1, 'week');
  return response.format('YYYY-MM-DD');
};
