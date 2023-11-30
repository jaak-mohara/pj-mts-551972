const mockGet = jest.fn();

const { getDateRange } = require('../../../src/helpers/date');
const { globalCollaborationBaselines, adjustedGlobalCollaborationBaselines, teamCollaborationAverages } = require('../../mockObjects/collaboration');
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

describe('collaboration', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('getCollaborationMetricBaselines', () => {
    it('should return a list of the global collaboration metrics to use as a baseline', async () => {
      mockGet.mockResolvedValueOnce(globalCollaborationBaselines);

      const { getCollaborationMetricBaselines } = require('../../../src/repositories/pluralsightRepository');
      const metrics = await getCollaborationMetricBaselines();

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-10-28:2023-11-25]&fields=average');
      expect(metrics).toBeTruthy();
    });

    it('should return a list of the team collaboration metrics to use as a baseline', async () => {
      mockGet.mockResolvedValueOnce(teamCollaborationAverages);

      const { getCollaborationMetricBaselines } = require('../../../src/repositories/pluralsightRepository');
      const metrics = await getCollaborationMetricBaselines(singleTeam?.id);

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-10-28:2023-11-25]&fields=average&team_id=95611');
      expect(metrics).toBeTruthy();
    });

    it('should adjust the collaboration baselines to account for the number of weeks in the date range', async () => {
      mockGet.mockResolvedValueOnce(globalCollaborationBaselines);

      const { getCollaborationMetricBaselines, changeToWeekly } = require('../../../src/repositories/pluralsightRepository');
      const period = getDateRange(null, '2023-11-25', 4);
      const metrics = await getCollaborationMetricBaselines();
      const weekAdjustedMetrics = changeToWeekly(metrics, period.startDate, period.endDate);


      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-10-28:2023-11-25]&fields=average');
      expect(weekAdjustedMetrics).toBeTruthy();
      expect(weekAdjustedMetrics).toMatchObject(adjustedGlobalCollaborationBaselines);
    });
  });
})