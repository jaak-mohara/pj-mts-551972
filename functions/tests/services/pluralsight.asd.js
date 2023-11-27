const mockGet = jest.fn();

jest.mock('moment', () => {
  return () => jest.requireActual('moment')('2023-11-25T00:00:00.000Z');
});

const { singleTeam, teamList } = require('../mockObjects/teams');
const { getDateRange } = require('../../src/helpers/date');

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

const mock = !process.env.MOCK_TESTS || process.env.MOCK_TESTS === 'true';
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

  false && describe('collaboration', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    describe('getCollaborationMetrics', () => {
      it('should return collaboration metrics for the week if no date range is specified', async () => {
        mock && mockGet.mockResolvedValueOnce(globalCollaborationAverages);
        const { getCollaborationMetrics } = require('../../src/services/pluralsight/collaborationService');
        const metrics = await getCollaborationMetrics();

        mock && expect(mockGet).toHaveBeenCalledTimes(1);
        mock && expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-11-18:2023-11-25]&fields=average');
        expect(metrics).toBeTruthy();
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
    });

    describe('getCollaborationMetricBaselines', () => {
      it('should return a list of the global collaboration metrics to use as a baseline', async () => {
        mock && mockGet.mockResolvedValueOnce(globalCollaborationBaselines);

        const { getCollaborationMetricBaselines } = require('../../src/services/pluralsight/collaborationService');
        const metrics = await getCollaborationMetricBaselines();

        mock && expect(mockGet).toHaveBeenCalledTimes(1);
        mock && expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-10-28:2023-11-25]&fields=average');
        expect(metrics).toBeTruthy();
      });

      it('should return a list of the team collaboration metrics to use as a baseline', async () => {
        mock && mockGet.mockResolvedValueOnce(globalCollaborationBaselines);

        const { getCollaborationMetricBaselines } = require('../../src/services/pluralsight/collaborationService');
        const metrics = await getCollaborationMetricBaselines(singleTeam?.id);

        mock && expect(mockGet).toHaveBeenCalledTimes(1);
        mock && expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-10-28:2023-11-25]&fields=average&team_id=95611');
        expect(metrics).toBeTruthy();
      });

      it('should adjust the collaboration baselines to account for the number of weeks in the date range', async () => {
        mock && mockGet.mockResolvedValueOnce(globalCollaborationBaselines);

        const { getCollaborationMetricBaselines, changeToWeekly } = require('../../src/services/pluralsight/collaborationService');
        const period = getDateRange('2023-11-25', 4);
        const metrics = await getCollaborationMetricBaselines();
        const weekAdjustedMetrics = changeToWeekly(metrics, period.startDate, period.endDate);


        mock && expect(mockGet).toHaveBeenCalledTimes(1);
        mock && expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-10-28:2023-11-25]&fields=average');
        expect(weekAdjustedMetrics).toBeTruthy();
        expect(weekAdjustedMetrics).toMatchObject(adjustedGlobalCollaborationBaselines);
      });
    });
  });
});
