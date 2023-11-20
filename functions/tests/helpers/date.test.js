
describe('date_helper', () => {
  describe('getWeeksAgoDate', () => {
    it('should return the current date in the correct format', () => {
      const { getCurrentDate } = require('../../src/helpers/date');
      const response = getCurrentDate(new Date('2020-01-01'));

      // Test if the response is in the yyyy-mm-dd format.
      expect(response).toMatch(/\d{4}-\d{2}-\d{2}/);
      expect(response).toBe('2020-01-01');
    });

    it('should return a date string in the correct format', () => {
      const { getWeeksAgoDate } = require('../../src/helpers/date');
      const response = getWeeksAgoDate(new Date('2020-01-01'));

      // Test if the response is in the yyyy-mm-dd format.
      expect(response).toMatch(/\d{4}-\d{2}-\d{2}/);
      expect(response).toBe('2019-12-25');
    });

    it('should return a date subtracting the specified amount of weeks', () => {
      const { getWeeksAgoDate } = require('../../src/helpers/date');
      const response = getWeeksAgoDate(new Date('2020-01-01'), 4);

      // Test if the response is in the yyyy-mm-dd format.
      expect(response).toMatch(/\d{4}-\d{2}-\d{2}/);
      expect(response).toBe('2019-12-04');
    });

  });
});