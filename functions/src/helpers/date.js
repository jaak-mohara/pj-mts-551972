const moment = require('moment');

/**
 * Get the date from a week ago in the format yyyy-mm-dd.
 * @param {string} requestDate
 * @param {number} weekAgo
 * @return {string}
 */
exports.getWeeksAgoDate = (requestDate = null, weekAgo = 1) => {
  const date = requestDate ? moment(requestDate) : moment();
  const response = date.subtract(weekAgo, 'week');
  return response.format('YYYY-MM-DD');
};

/**
 * Get the current date in the correct format to use in the requests.
 * @param {string} requestDate
 * @return {string}
 */
exports.getCurrentDate = (requestDate = null) => {
  const date = requestDate ? moment(requestDate) : moment();
  return date.format('YYYY-MM-DD');
};

/**
 * Gets the date range for the request.
 *
 * @param {string} startDate
 * @param {string} endDate
 * @param {number} weeksAgo
 *
 * @return {{startDate: string, endDate: string}}
 */
exports.getDateRange = (startDate = null, endDate, weeksAgo = 1) => {
  const upperLimit = endDate ? moment(endDate) : moment();

  let lowerLimit = null;
  if (startDate) {
    lowerLimit = moment(startDate);
  } else {
    lowerLimit = moment(upperLimit).subtract(weeksAgo, 'week');
  }

  return {
    startDate: lowerLimit.format('YYYY-MM-DD'),
    endDate: upperLimit.format('YYYY-MM-DD'),
  };
};
