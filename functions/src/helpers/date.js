/**
 * Get the date from a week ago in the format yyyy-mm-dd.
 * @return {string}
 */
exports.getWeekAgoDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().split('T')[0];
};
