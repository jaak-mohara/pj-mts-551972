const mockGet = jest.fn();

const moment = require('moment');

const { exampleObjectMetadata } = require('firebase-functions-test/lib/providers/storage');
const { singleTeam, teamList } = require('../mockObjects/teams');
const { team_period } = require('../mockObjects/codingMetrics');

require('dotenv').config();

jest.mock('../../src/utils/fetch', () => ({
  get: mockGet,
}));

describe('pluralsight_service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Don't care so much about commits right now since we can get the aggregated values from the metrics.
  false && describe('commits', () => {
    it('should return a list of commits', async () => {
      const { getCommits } = require('../../src/services/pluralsight/commitsService');
      const commits = await getCommits();

      expect(commits.results.length).toBeGreaterThan(0);
    });
  });

  describe('teams', () => {
    it('should return a list of teams', async () => {
      mockGet.mockResolvedValueOnce(teamList);
      const { getTeams } = require('../../src/services/pluralsight/teamsService');
      const teams = await getTeams();

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('https://flow.pluralsight.com/v3/customer/core/teams/');
      expect(teams.results.length).toBeGreaterThan(0);
    });
  });

  describe('codingMetrics', () => {
    it('should return a list of coding metrics', async () => {
      mockGet.mockResolvedValueOnce(team_period);
      const { getWeeklyMetrics } = require('../../src/services/pluralsight/codingMetricsService');
      const metrics = await getWeeklyMetrics(
        singleTeam.id,
        '2023-11-18',
        '2023-11-25'
      );

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('https://flow.pluralsight.com/v3/customer/metrics/code_fundamentals/period_metrics/?start_date=2023-11-18&end_date=2023-11-25&team_id=103984&include_nested_teams=true&resolution=period');
      expect(metrics.results.length).toBeGreaterThan(0);
      expect(metrics.count).toBeDefined();
      expect(metrics.results).toBeDefined();
    });

    it('should return an average of the codeing metrics for the past 4 weeks', async () => {
      mockGet.mockResolvedValueOnce(team_period);
      const { getCodingMetricsBaselines } = require('../../src/services/pluralsight/codingMetricsService');
      const metrics = await getCodingMetricsBaselines(singleTeam.id);
      const startDate = moment().subtract(4, 'weeks').format('YYYY-MM-DD');
      const endDate = moment().format('YYYY-MM-DD');

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith(`https://flow.pluralsight.com/v3/customer/metrics/code_fundamentals/period_metrics/?start_date=${startDate}&end_date=${endDate}&team_id=103984&include_nested_teams=true&resolution=period`);
      expect(metrics.count).toBeDefined();
      expect(metrics.results).toBeDefined();
      expect(metrics.results.length).toBe(1);
    });
  });

  // describe('collaboration', () => {

  // });
});
