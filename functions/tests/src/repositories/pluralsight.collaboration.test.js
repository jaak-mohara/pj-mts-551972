const mockGet = jest.fn();

require('dotenv').config();

const { getDateRange } = require('../../../src/helpers/date');
const { globalCollaborationBaselines, adjustedGlobalCollaborationBaselines, noTeamAdjustedCollaborationAverages, noTeamCollaborationAverages, teamCollaborationBaselines, teamAdjustedCollaboration, comparedCollaborationMetrics } = require('../../mockObjects/collaboration');
const {
  dummyCollaborationMetrics,
  dummyCollaborationMetricBaselines,
  dummyCollaborationMetricBaselinesWeekly,
  dummyCollaborationMetricsWeekly,
  dummyComparisonResponse,
} = require('../../mockObjects/dummyObjects');
const { singleTeam } = require('../../mockObjects/teams');

const mockTests = process.env.MOCK_TESTS === 'true';
mockTests && jest.mock('../../../src/utils/fetch', () => ({
  get: mockGet,
}));

if (mockTests) {
  process.env.PLURALSIGHT_API_KEY = undefined;
}

jest.mock('moment', () => {
  const moment = jest.requireActual('moment');
  return (suppliedDate = null) => {
    if (suppliedDate !== null) {
      return moment(suppliedDate);
    }
    return moment('2023-11-25T00:00:00.000Z');
  };
});

describe('collaboration', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('getCollaborationMetricBaselines', () => {
    it('should return a list of the global collaboration metrics to use as a baseline', async () => {
      mockGet.mockResolvedValueOnce(globalCollaborationBaselines);

      const { getCollaborationMetricBaselines, changeToWeekly } = require('../../../src/repositories/pluralsightRepository');
      const metrics = await getCollaborationMetricBaselines();

      mockTests && expect(mockGet).toHaveBeenCalledTimes(1);
      mockTests && expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-10-28:2023-11-25]&fields=average');
      expect(metrics).toBeTruthy();
    });

    it('should return a list of the team collaboration metrics to use as a baseline', async () => {
      mockGet.mockResolvedValueOnce(noTeamCollaborationAverages);

      const { getCollaborationMetricBaselines } = require('../../../src/repositories/pluralsightRepository');
      const metrics = await getCollaborationMetricBaselines(singleTeam?.id);

      mockTests && expect(mockGet).toHaveBeenCalledTimes(1);
      mockTests && expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-10-28:2023-11-25]&fields=average&team_id=95611');
      expect(metrics).toBeTruthy();
    });

    it('should adjust the collaboration baselines to account for the number of weeks in the date range', async () => {
      mockGet.mockResolvedValueOnce(globalCollaborationBaselines);

      const { getCollaborationMetricBaselines, changeToWeekly } = require('../../../src/repositories/pluralsightRepository');
      const period = getDateRange(null, '2023-11-25', 4);
      const metrics = await getCollaborationMetricBaselines();
      const weekAdjustedMetrics = changeToWeekly(metrics, period.startDate, period.endDate);


      mockTests && expect(mockGet).toHaveBeenCalledTimes(1);
      mockTests && expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-10-28:2023-11-25]&fields=average');
      expect(weekAdjustedMetrics).toBeTruthy();
      mockTests && expect(weekAdjustedMetrics).toMatchObject(adjustedGlobalCollaborationBaselines);
    });
  });
  describe('getCollaborationMetrics', () => {
    it('should return a list of collaboration metrics', async () => {
      mockGet.mockResolvedValueOnce(noTeamCollaborationAverages);

      const { getCollaborationMetrics } = require('../../../src/repositories/pluralsightRepository');
      const metrics = await getCollaborationMetrics('2023-11-18', '2023-11-25');

      mockTests && expect(mockGet).toHaveBeenCalledTimes(1);
      mockTests && expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-11-18:2023-11-25]&fields=average');
      expect(metrics).toBeTruthy();
    });

    it('should adjust the collaboration metrics to account for the number of weeks in the data range', async () => {
      mockGet.mockResolvedValueOnce(noTeamCollaborationAverages);

      const { getCollaborationMetrics, changeToWeekly } = require('../../../src/repositories/pluralsightRepository');
      const startDate = '2023-11-18';
      const endDate = '2023-11-25';
      const metrics = await getCollaborationMetrics(startDate, endDate, null);
      const adjustedMetrics = changeToWeekly(metrics, startDate, endDate);

      mockTests && expect(mockGet).toHaveBeenCalledTimes(1);
      mockTests && expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-11-18:2023-11-25]&fields=average');
      expect(metrics).toBeTruthy();
      expect(metrics).toMatchObject(noTeamCollaborationAverages);
      expect(adjustedMetrics).toMatchObject(noTeamAdjustedCollaborationAverages);
    });
  });
  describe('getParsedCollaborationMetrics', () => {
    it('should return a list of normalised collaboration metrics', async () => {
      mockGet.mockResolvedValueOnce(noTeamCollaborationAverages);

      const { getParsedCollaborationMetrics, getCollaborationMetrics } = require('../../../src/repositories/pluralsightRepository');
      const metrics = await getCollaborationMetrics('2023-11-18', '2023-11-25');
      const normalisedMetrics = getParsedCollaborationMetrics(metrics);

      mockTests && expect(mockGet).toHaveBeenCalledTimes(1);
      mockTests && expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-11-18:2023-11-25]&fields=average');
      expect(metrics).toBeTruthy();
      expect(normalisedMetrics).toBeTruthy();

      (Object.keys(metrics)).forEach(metric => {
        expect(normalisedMetrics[metric]).toBeDefined();
        expect(typeof normalisedMetrics[metric]).not.toBe('object');
      });
    });
  });
  describe('getComparedCollaborationMetrics', () => {
    it('should return a list of no-team collaboration metrics', async () => {
      mockGet
        .mockResolvedValueOnce(noTeamCollaborationAverages)
        .mockResolvedValueOnce(globalCollaborationBaselines);

      const { getComparedCollaborationMetrics } = require('../../../src/repositories/pluralsightRepository');
      const metrics = await getComparedCollaborationMetrics(
        '2023-11-18',
        '2023-11-25',
      );

      mockTests && expect(mockGet).toHaveBeenCalledTimes(2);
      mockTests && expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-11-18:2023-11-25]&fields=average');
      expect(metrics).toBeTruthy();
      expect(metrics).toMatchObject(comparedCollaborationMetrics);
    });
  });
});