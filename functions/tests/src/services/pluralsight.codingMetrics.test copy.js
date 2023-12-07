const mockGet = jest.fn();

const { team_period } = require('../../mockObjects/codingMetrics');
const { collaborationAverages, globalCollaborationAverages, teamCollaborationAverages, globalCollaborationBaselines,
  adjustedGlobalCollaborationBaselines } = require('../../mockObjects/collaboration');
const { singleTeam } = require('../../mockObjects/teams');

jest.mock('../../../src/utils/fetch', () => ({
  get: mockGet,
}));

jest.mock('moment', () => {
  return () => jest.requireActual('moment')('2023-11-25T00:00:00.000Z');
});

describe('codingMetrics', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of coding metrics for he given period', async () => {
    mockGet.mockResolvedValueOnce(team_period);
    const { getCodingMetricsForPeriod } = require('../../../src/services/pluralsightService');
    const metrics = await getCodingMetricsForPeriod(
      '2023-10-28',
      '2023-11-25',
      singleTeam.id
    );

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith(`https://flow.pluralsight.com/v3/customer/metrics/code_fundamentals/period_metrics/?start_date=2023-10-28&end_date=2023-11-25&team_id=${singleTeam?.id}&include_nested_teams=true&resolution=period`);
    expect(metrics.count).toBeDefined();
    expect(metrics.results).toBeDefined();
    expect(metrics.results.length).toBe(1);
  });
});
