const mockGet = jest.fn();

const { getDateRange } = require('../../../src/helpers/date');
const { no_team_period, team_period, compared_period_metrics } = require('../../mockObjects/codingMetrics')
const { singleTeam } = require('../../mockObjects/teams');

jest.mock('../../../src/utils/fetch', () => ({
  get: mockGet,
}));

jest.mock('moment', () => {
  const moment = jest.requireActual('moment');
  return (suppliedDate = null) => {
    if (suppliedDate !== null) {
      return moment(suppliedDate);
    }
    return moment('2023-11-25T00:00:00.000Z');
  };
});

describe('codingMetrics', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('getCodingMetrics', () => {
    it('should return a list of no-team coding metrics', async () => {
      mockGet.mockResolvedValueOnce(no_team_period);

      const { getCodingMetrics, getCodingMetricsBaselines, compareCodingMetrics } = require('../../../src/repositories/pluralsightRepository');
      const metrics = await getCodingMetrics(
        '2023-11-18',
        '2023-11-25',
      );

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('https://flow.pluralsight.com/v3/customer/metrics/code_fundamentals/period_metrics/?start_date=2023-11-18&end_date=2023-11-25&include_nested_teams=true&resolution=period');
      expect(metrics).toBeTruthy();
    });

    it('should return a list of no-team coding metrics', async () => {
      mockGet.mockResolvedValueOnce(no_team_period);

      const { getCodingMetrics } = require('../../../src/repositories/pluralsightRepository');

      try {
        const metrics = await getCodingMetrics(
          '2023-11-18',
          null,
        );
      } catch (error) {
        expect(error.message).toEqual('End date is required');
        expect(error.name).toEqual('ValidationException');
      }

      expect(mockGet).toHaveBeenCalledTimes(0);
    });

    it('should default to a week before the endDate if no startDate was given', async () => {
      mockGet.mockResolvedValueOnce(no_team_period);

      const { getCodingMetrics } = require('../../../src/repositories/pluralsightRepository');
      const metrics = await getCodingMetrics(
        null,
        '2023-11-25',
      );

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('https://flow.pluralsight.com/v3/customer/metrics/code_fundamentals/period_metrics/?start_date=2023-11-18&end_date=2023-11-25&include_nested_teams=true&resolution=period');
      expect(metrics).toBeTruthy();
    });

    it('should use the provided date range if one is given', async () => {
      mockGet.mockResolvedValueOnce(no_team_period);

      const { getCodingMetrics } = require('../../../src/repositories/pluralsightRepository');
      const metrics = await getCodingMetrics(
        '2000-01-01',
        '2023-11-25',
      );

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('https://flow.pluralsight.com/v3/customer/metrics/code_fundamentals/period_metrics/?start_date=2000-01-01&end_date=2023-11-25&include_nested_teams=true&resolution=period');
      expect(metrics).toBeTruthy();
    });

    it('should return an object with a list of the compared fields', async () => {
      mockGet
        .mockResolvedValueOnce(team_period)
        .mockResolvedValueOnce(no_team_period);

      const {
        getCodingMetrics,
        getCodingMetricsBaselines,
        compareCodingMetrics
      } = require('../../../src/repositories/pluralsightRepository');

      const teamMetrics = await getCodingMetrics(
        '2023-11-18',
        '2023-11-25',
      );

      const baselineMetrics = await getCodingMetricsBaselines();

      const comparedMetrics = compareCodingMetrics(teamMetrics, baselineMetrics);

      expect(mockGet).toHaveBeenCalledTimes(2);
      expect(mockGet).toHaveBeenCalledWith('https://flow.pluralsight.com/v3/customer/metrics/code_fundamentals/period_metrics/?start_date=2023-11-18&end_date=2023-11-25&include_nested_teams=true&resolution=period');

      expect(teamMetrics).toBeTruthy();
      expect(teamMetrics).toHaveProperty('active_days');
      expect(teamMetrics).toHaveProperty('commit_count');
      expect(teamMetrics).toHaveProperty('total_impact');
      expect(teamMetrics).toHaveProperty('total_efficiency');

      expect(baselineMetrics).toBeTruthy();
      expect(baselineMetrics).toHaveProperty('active_days');
      expect(baselineMetrics).toHaveProperty('commit_count');
      expect(baselineMetrics).toHaveProperty('total_impact');
      expect(baselineMetrics).toHaveProperty('total_efficiency');

      expect(comparedMetrics).toEqual(compared_period_metrics);
    });




  });
})