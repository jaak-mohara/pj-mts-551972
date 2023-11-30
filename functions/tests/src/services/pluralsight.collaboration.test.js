const mockGet = jest.fn();
const mockMoment = jest.fn();

const { getDateRange } = require('../../../src/helpers/date');
const { team_period } = require('../../mockObjects/codingMetrics');
const { collaborationAverages, globalCollaborationAverages, teamCollaborationAverages } = require('../../mockObjects/collaboration');
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

describe('collaborationService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCollaborationMetrics', () => {
    it('should return collaboration metrics for the week if no date range is specified', async () => {
      mockGet.mockResolvedValueOnce(globalCollaborationAverages);
      const { getCollaborationMetrics } = require('../../../src/services/pluralsightService');
      const metrics = await getCollaborationMetrics(
        '2023-11-18',
        '2023-11-25',
      );

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-11-18:2023-11-25]&fields=average');
      expect(metrics).toBeTruthy();
    });

    it('should return a truthy value', async () => {
      mockGet.mockResolvedValueOnce(globalCollaborationAverages);
      const { getCollaborationMetrics } = require('../../../src/services/pluralsightService');
      const metrics = await getCollaborationMetrics(
        '2023-11-18',
        '2023-11-25',
      );

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('https://flow-api.pluralsight.com/collaboration/pullrequest/metrics/?date_range=[2023-11-18:2023-11-25]&fields=average');
      expect(metrics).toBeTruthy();
    });

    it('should return a list of collaboration metrics', async () => {
      mockGet.mockResolvedValueOnce(teamCollaborationAverages);
      const { getCollaborationMetrics } = require('../../../src/services/pluralsightService');
      const metrics = await getCollaborationMetrics(
        '2023-11-18',
        '2023-11-25',
        singleTeam.id,
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
});