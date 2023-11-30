describe('date_helper', () => {
  beforeEach(() => {
    jest.mock('moment', () => {
      const moment = jest.requireActual('moment');
      return (suppliedDate = null) => {
        if (suppliedDate !== null) {
          return moment(suppliedDate);
        }
        return moment('2023-11-25T00:00:00.000Z');
      };
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('getWeeksAgoDate', () => {
    it('should return the current date in the correct format', () => {
      const { getCurrentDate } = require('../../../src/helpers/date');
      const response = getCurrentDate();

      // Test if the response is in the yyyy-mm-dd format.
      expect(response).toMatch(/\d{4}-\d{2}-\d{2}/);
      expect(response).toBe('2023-11-25');
    });

    it('should return a date string in the correct format', () => {
      const { getWeeksAgoDate } = require('../../../src/helpers/date');
      const response = getWeeksAgoDate();

      // Test if the response is in the yyyy-mm-dd format.
      expect(response).toMatch(/\d{4}-\d{2}-\d{2}/);
      expect(response).toBe('2023-11-18');
    });

    it('should return a date subtracting the specified amount of weeks', () => {
      const { getWeeksAgoDate } = require('../../../src/helpers/date');
      const response = getWeeksAgoDate('2023-11-25', 4);

      // Test if the response is in the yyyy-mm-dd format.
      expect(response).toMatch(/\d{4}-\d{2}-\d{2}/);
      expect(response).toBe('2023-10-28');
    });

  });

  describe('getDatePeriod', () => {
    it('should return a truty value', () => {
      const { getDateRange } = require('../../../src/helpers/date');
      const response = getDateRange('2023-11-25', 4);

      expect(response).toBeDefined();
    });

    it('should return a startDate and endDate', () => {
      const { getDateRange } = require('../../../src/helpers/date');
      const response = getDateRange('2023-11-25', 4);

      expect(response.startDate).toBeDefined();
      expect(response.endDate).toBeDefined();
    });

    it('should return a startDate and endDate in the correct format', () => {
      const { getDateRange } = require('../../../src/helpers/date');
      const response = getDateRange('2023-11-25', 4);

      expect(response.startDate).toMatch(/\d{4}-\d{2}-\d{2}/);
      expect(response.endDate).toMatch(/\d{4}-\d{2}-\d{2}/);
    });

    it('should return a startDate and endDate for the correct period', () => {
      const { getDateRange } = require('../../../src/helpers/date');
      const response = getDateRange(null, '2023-11-25', 4);

      expect(response.startDate).toBe('2023-10-28');
      expect(response.endDate).toBe('2023-11-25');
    });

  })
});