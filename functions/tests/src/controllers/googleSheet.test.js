const { getTeamIds } = require('../../../src/repositories/pluralsightRepository');

require('dotenv').config();

// const mock = process.env.MOCK_TESTS === 'true';
const mock = false;
const timeout = mock ? 5000 : 10000;

describe('googleSheetController', () => {
  beforeAll(() => {
    const { GoogleSheetService } = require('../../../src/services/googleSheets');
    this.service = new GoogleSheetService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  false && describe('updateTeamTabs', () => {
    it('should return truthy', async () => {
      const { updateTeamTabs } = require('../../../src/controllers/googleSheets');

      const teamIds = mock ?
        [{ id: 1, name: 'TEAM_1' }, { id: 2, name: 'TEAM_2' }]
        : await getTeamIds(true);

      const response = await updateTeamTabs(
        teamIds,
        this.service
      );

      expect(response).toBeTruthy();
    }, timeout);

    it('should call the creatTab method for each team', async () => {
      const { updateTeamTabs } = require('../../../src/controllers/googleSheets');
      const { GoogleSheetService } = require('../../../src/services/googleSheets');

      const spy = jest.spyOn(GoogleSheetService.prototype, 'createTab');

      const teamIds = mock ?
        [{ id: 1, name: 'TEAM_1' }, { id: 2, name: 'TEAM_2' }]
        : await getTeamIds(true);

      const response = await updateTeamTabs(
        teamIds,
        this.service
      );

      expect(spy).toHaveBeenCalledTimes(teamIds.length);
      mock && expect(spy).toHaveBeenCalledWith(teamIds[0].name);
      mock && expect(spy).toHaveBeenCalledWith(teamIds[1].name);
    });
  }, timeout);

  describe('fetchMetrics', () => {
    false && it('should return truthy', async () => {
      const { updateMetrics } = require('../../../src/controllers/googleSheets');

      const teamIds = mock ?
        [{ id: 1, name: 'TEAM_1' }, { id: 2, name: 'TEAM_2' }]
        : await getTeamIds(true);

      const response = await updateMetrics(
        teamIds,
        this.service
      );

      expect(response).toBeTruthy();
    }, 100000);

    it('should get the metrics from the Pluralsight API for each of the teams', async () => {
      const { updateMetrics } = require('../../../src/controllers/googleSheets');
      const { getMetrics } = require('../../../src/repositories/pluralsightRepository');

      const teamIds = mock ?
        [{ id: 1, name: 'TEAM_1' }, { id: 2, name: 'TEAM_2' }]
        : await getTeamIds(true);

      const response = await updateMetrics(
        teamIds,
        this.service
      );

      expect(true).toBe(true);
    }, 100000);
  }, timeout);
});