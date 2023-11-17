
describe('date_helper', () => {
  describe('getWeekAgoDate', () => {
    it('should return a date string in the correct format', () => {
      const { getWeekAgoDate } = require('../../src/helpers/date');
      this.response = getWeekAgoDate();

      // Test if the response is in the yyyy-mm-dd format.
      expect(this.response).toMatch(/\d{4}-\d{2}-\d{2}/);
    });
  });
});