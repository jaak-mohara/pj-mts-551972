const mockGet = jest.fn();

const moment = require('moment');

const { exampleObjectMetadata } = require('firebase-functions-test/lib/providers/storage');
const { singleTeam, teamList } = require('../mockObjects/teams');
const { team_period } = require('../mockObjects/codingMetrics');
const { collaborationAverages, globalCollaborationAverages, teamCollaborationAverages } = require('../mockObjects/collaboration');

require('dotenv').config();

const collaborationMetrics = [
  'reaction_time',
  'responsiveness',
  'time_to_merge',
  'time_to_first_comment',
  'rework_time',
  'iterated_prs',
  'unreviewed_prs',
  'thoroughly_reviewed_prs',
];

const mock = process.env.MOCK_TESTS === 'true';
if (mock) {
  jest.mock('../../src/utils/fetch', () => ({
    get: mockGet,
  }));
}



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

  false && describe('teams', () => {
    it('should return a list of teams', async () => {
      mock && mockGet.mockResolvedValueOnce(teamList);
      const { getTeams } = require('../../src/services/pluralsight/teamsService');
      const teams = await getTeams();

      mock && expect(mockGet).toHaveBeenCalledTimes(1);
      mock && expect(mockGet).toHaveBeenCalledWith('https://flow.pluralsight.com/v3/customer/core/teams/');
      expect(teams.results.length).toBeGreaterThan(0);
    });
  });

  false && describe('codingMetrics', () => {
    it('should return a list of coding metrics', async () => {
      mock && mockGet.mockResolvedValueOnce(team_period);
      const { getWeeklyMetrics } = require('../../src/services/pluralsight/codingMetricsService');
      const metrics = await getWeeklyMetrics(
        singleTeam.id,
        '2023-11-18',
        '2023-11-25'
      );

      mock && expect(mockGet).toHaveBeenCalledTimes(1);
      mock && expect(mockGet).toHaveBeenCalledWith('https://flow.pluralsight.com/v3/customer/metrics/code_fundamentals/period_metrics/?start_date=2023-11-18&end_date=2023-11-25&team_id=103984&include_nested_teams=true&resolution=period');
      expect(metrics.results.length).toBeGreaterThan(0);
      expect(metrics.count).toBeDefined();
      expect(metrics.results).toBeDefined();
    });

    it('should return an average of the coding metrics for the past 4 weeks', async () => {
      mock && mockGet.mockResolvedValueOnce(team_period);
      const { getCodingMetricsBaselines } = require('../../src/services/pluralsight/codingMetricsService');
      const metrics = await getCodingMetricsBaselines(singleTeam.id);
      const startDate = moment().subtract(4, 'weeks').format('YYYY-MM-DD');
      const endDate = moment().format('YYYY-MM-DD');

      mock && expect(mockGet).toHaveBeenCalledTimes(1);
      mock && expect(mockGet).toHaveBeenCalledWith(`https://flow.pluralsight.com/v3/customer/metrics/code_fundamentals/period_metrics/?start_date=${startDate}&end_date=${endDate}&team_id=103984&include_nested_teams=true&resolution=period`);
      expect(metrics.count).toBeDefined();
      expect(metrics.results).toBeDefined();
      expect(metrics.results.length).toBe(1);
    });
  });

  describe('collaboration', () => {
    describe('getCollaborationMetrics', () => {
      it('should throw an error if no startDate is provided', async () => {
        const { getCollaborationMetrics } = require('../../src/services/pluralsight/collaborationService');

        try {
          getCollaborationMetrics(singleTeam.id, null, '2023-11-18');
        } catch (e) {
          expect(e.message).toBe('Start and end dates are required');
        }
      });

      it('should throw an error if no endDate is provided', async () => {
        const { getCollaborationMetrics } = require('../../src/services/pluralsight/collaborationService');

        try {
          getCollaborationMetrics(singleTeam.id, '2023-11-18', null);
        } catch (e) {
          expect(e.message).toBe('Start and end dates are required');
        }
      });

      it('should return a truthy value', async () => {
        mock && mockGet.mockResolvedValueOnce(globalCollaborationAverages);
        const { getCollaborationMetrics } = require('../../src/services/pluralsight/collaborationService');
        const metrics = await getCollaborationMetrics(
          null,
          '2023-11-18',
          '2023-11-25'
        );

        mock && expect(mockGet).toHaveBeenCalledTimes(1);
        mock && expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-11-18:2023-11-25]&fields=average');
        expect(metrics).toBeTruthy();
      });

      it('should return a list of collaboration metrics', async () => {
        mock && mockGet.mockResolvedValueOnce(teamCollaborationAverages);
        const { getCollaborationMetrics } = require('../../src/services/pluralsight/collaborationService');
        const metrics = await getCollaborationMetrics(
          singleTeam.id,
          '2023-11-18',
          '2023-11-25'
        );

        mock && expect(mockGet).toHaveBeenCalledTimes(1);
        mock && expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-11-18:2023-11-25]&fields=average&team_id=95611');

        expect(metrics.pr_count).toBeDefined();
        collaborationMetrics.forEach(metric => {
          expect(metrics[metric]).toBeDefined();
          expect(metrics[metric].average).toBeDefined();
        });
      });
    })
  });
});
