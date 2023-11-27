const mockGet = jest.fn();
const mockMoment = jest.fn();

const { getDateRange } = require('../../src/helpers/date');
const { team_period } = require('../mockObjects/codingMetrics');
const { collaborationAverages, globalCollaborationAverages, teamCollaborationAverages, globalCollaborationBaselines,
  adjustedGlobalCollaborationBaselines } = require('../mockObjects/collaboration');
const { singleTeam } = require('../mockObjects/teams');

jest.mock('../../src/utils/fetch', () => ({
  get: mockGet,
}));

describe('collaborationService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('getCollaborationMetrics', () => {
    it('should return collaboration metrics for the week if no date range is specified', async () => {
      mockGet.mockResolvedValueOnce(globalCollaborationAverages);
      const { getCollaborationMetrics } = require('../../src/services/pluralsight/collaborationService');
      const metrics = await getCollaborationMetrics();

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-11-18:2023-11-25]&fields=average');
      expect(metrics).toBeTruthy();
    });

    it('should return a truthy value', async () => {
      mockGet.mockResolvedValueOnce(globalCollaborationAverages);
      const { getCollaborationMetrics } = require('../../src/services/pluralsight/collaborationService');
      const metrics = await getCollaborationMetrics(
        null,
        '2023-11-18',
        '2023-11-25'
      );

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-11-18:2023-11-25]&fields=average');
      expect(metrics).toBeTruthy();
    });

    it('should return a list of collaboration metrics', async () => {
      mockGet.mockResolvedValueOnce(teamCollaborationAverages);
      const { getCollaborationMetrics } = require('../../src/services/pluralsight/collaborationService');
      const metrics = await getCollaborationMetrics(
        singleTeam.id,
        '2023-11-18',
        '2023-11-25'
      );

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-11-18:2023-11-25]&fields=average&team_id=95611');

      expect(metrics.pr_count).toBeDefined();
      collaborationMetrics.forEach(metric => {
        expect(metrics[metric]).toBeDefined();
        expect(metrics[metric].average).toBeDefined();
      });
    });
  });

  describe('getCollaborationMetricBaselines', () => {
    it('should return a list of the global collaboration metrics to use as a baseline', async () => {
      mockGet.mockResolvedValueOnce(globalCollaborationBaselines);

      const { getCollaborationMetricBaselines } = require('../../src/services/pluralsight/collaborationService');
      const metrics = await getCollaborationMetricBaselines();

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-10-28:2023-11-25]&fields=average');
      expect(metrics).toBeTruthy();
    });

    it('should return a list of the team collaboration metrics to use as a baseline', async () => {
      mockGet.mockResolvedValueOnce(globalCollaborationBaselines);

      const { getCollaborationMetricBaselines } = require('../../src/services/pluralsight/collaborationService');
      const metrics = await getCollaborationMetricBaselines(singleTeam?.id);

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-10-28:2023-11-25]&fields=average&team_id=95611');
      expect(metrics).toBeTruthy();
    });

    it('should adjust the collaboration baselines to account for the number of weeks in the date range', async () => {
      mockGet.mockResolvedValueOnce(globalCollaborationBaselines);

      const { getCollaborationMetricBaselines, changeToWeekly } = require('../../src/services/pluralsight/collaborationService');
      const period = getDateRange('2023-11-25', null, 4);
      const metrics = await getCollaborationMetricBaselines();
      const weekAdjustedMetrics = changeToWeekly(metrics, period.startDate, period.endDate);


      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-10-28:2023-11-25]&fields=average');
      expect(weekAdjustedMetrics).toBeTruthy();
      expect(weekAdjustedMetrics).toMatchObject(adjustedGlobalCollaborationBaselines);
    });
  });
});