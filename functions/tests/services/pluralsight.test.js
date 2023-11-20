const { exampleObjectMetadata } = require('firebase-functions-test/lib/providers/storage');
const { singleTeam } = require('../mockObjects/teams');

require('dotenv').config();

describe('pluralsight_service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('commits', () => {
    it('should return a list of commits', async () => {
      const { getCommits } = require('../../src/services/pluralsight/commits');
      const commits = await getCommits();
      expect(commits.results.length).toBeGreaterThan(0);
    });
  });

  describe('teams', () => {
    it('should return a list of teams', async () => {
      const { getTeams } = require('../../src/services/pluralsight/teams');
      const teams = await getTeams();
      expect(teams.results.length).toBeGreaterThan(0);
    });
  });

  describe('codingMetrics', () => {
    it('should return a list of coding metrics', async () => {
      const { getWeeklyMetrics } = require('../../src/services/pluralsight/codingMetrics');
      const metrics = await getWeeklyMetrics(singleTeam.id);

      expect(metrics.results.length).toBeGreaterThan(0);
      expect(metrics.count).toBeDefined();
      expect(metrics.results).toBeDefined();
    });

    it('should return an average of the codeing metrics for the past 4 weeks', async () => {
      const { getCodingMetricsBaselines } = require('../../src/services/pluralsight/codingMetrics');
      const metrics = await getCodingMetricsBaselines(singleTeam.id);

      expect(metrics).toBeDefined();
      expect(metrics.count).toBeDefined();
      expect(metrics.results).toBeDefined();
      expect(metrics.results.length).toBe(1);
    });
  });
});
