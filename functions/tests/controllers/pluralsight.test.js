const mockGet = jest.fn();

const { team_period, no_team_period } = require('../mockObjects/codingMetrics');

jest.mock('../../src/utils/fetch', () => ({
  get: mockGet,
}));

describe('pluralsight_controller', () => {
  describe('codeMetrics', () => {
    beforeAll(() => {
      this.codingMetricsFields = [
        'active_days',
        'commit_count',
        'total_impact',
        'total_efficiency',
      ];
      this.metricComparisonItemFields = [
        'current',
        'target',
        'change',
      ];
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should return a list of metric comparisons in the correct format', async () => {
      mockGet
        .mockResolvedValueOnce(team_period)
        .mockResolvedValueOnce(no_team_period);

      const { compareWithOwnBaselines } = require('../../src/controllers/pluralsight/codeMetricsController');

      const response = await compareWithOwnBaselines();

      expect(response).toBeDefined();

      this.codingMetricsFields.forEach(metric => {
        expect(response).toHaveProperty(metric);
        this.metricComparisonItemFields.forEach(item =>
          expect(response[metric]).toHaveProperty(item)
        );
      });
    });
  })
})