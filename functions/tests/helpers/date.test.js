
describe('date_helper', () => {
  describe('getWeekAgoDate', () => {
    it('should return a date string in the correct format', () => {
      const { getWeekAgoDate } = require('../../src/helpers/date');
      const response = getWeekAgoDate(new Date('2020-01-01'));

      // Test if the response is in the yyyy-mm-dd format.
      expect(response).toMatch(/\d{4}-\d{2}-\d{2}/);
      expect(response).toBe('2019-12-25');
    });
  });
});