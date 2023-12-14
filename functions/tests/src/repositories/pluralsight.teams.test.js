const mockGet = jest.fn();
const mockDB = {
  collection: jest.fn(),
  where: jest.fn(),
  get: jest.fn(),
};

require('dotenv').config();

const { database } = require('@firebase/testing');

const { exampleObjectMetadata } = require('firebase-functions-test/lib/providers/storage');
const { getDateRange } = require('../../../src/helpers/date');
const { globalCollaborationBaselines, adjustedGlobalCollaborationBaselines, noTeamAdjustedCollaborationAverages, noTeamCollaborationAverages, teamCollaborationBaselines, teamAdjustedCollaboration, comparedCollaborationMetrics } = require('../../mockObjects/collaboration');
const { singleTeam, teamList } = require('../../mockObjects/teams');

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

describe('teams', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('getTeams', () => {
    it('should return a list of the teams that are registered on Pluralsight Flow.', async () => {
      mockGet.mockResolvedValueOnce(teamList);

      const { getTeams } = require('../../../src/repositories/pluralsightRepository');
      const metrics = await getTeams();

      mockTests && expect(mockGet).toHaveBeenCalledTimes(1);
      mockTests && expect(mockGet).toHaveBeenCalledWith('https://flow.pluralsight.com/v3/customer/core/teams/');
      expect(metrics).toBeTruthy();

      const keys = Object.keys(metrics);
      expect(keys).toContain('count');
      expect(keys).toContain('next');
      expect(keys).toContain('previous');
      expect(keys).toContain('results');
    });
  });

  describe('getTeamIds', () => {
    it('should return a projected list of the teams containing a name and ID for each team.', async () => {
      mockGet.mockResolvedValueOnce(teamList);

      const { getTeamIds } = require('../../../src/repositories/pluralsightRepository');
      const metrics = await getTeamIds();

      mockTests && expect(mockGet).toHaveBeenCalledTimes(1);
      mockTests && expect(mockGet).toHaveBeenCalledWith('https://flow.pluralsight.com/v3/customer/core/teams/');
      expect(metrics).toBeTruthy();

      expect(typeof metrics).toBe('object');
      expect(metrics.length).toBeGreaterThan(0);

      metrics.forEach(element => {
        expect(element).toHaveProperty('id');
        expect(element).toHaveProperty('name');
      });
    });

    it('should return a projected list of the teams containing a capitalised name and ID for each team.', async () => {
      mockGet.mockResolvedValueOnce(teamList);

      const { getTeamIds } = require('../../../src/repositories/pluralsightRepository');
      const metrics = await getTeamIds(true);

      mockTests && expect(mockGet).toHaveBeenCalledTimes(1);
      mockTests && expect(mockGet).toHaveBeenCalledWith('https://flow.pluralsight.com/v3/customer/core/teams/');
      expect(metrics).toBeTruthy();

      expect(typeof metrics).toBe('object');
      expect(metrics.length).toBeGreaterThan(0);

      metrics.forEach(element => {
        expect(element).toHaveProperty('id');
        expect(element).toHaveProperty('name');
        expect(element.name).toEqual(element.name.toUpperCase());
      });
    });
  });

  describe('getTeamIdByName', () => {
    it('should query the database and return an ID for the team.', async () => {

      database.collection = mockDB.collection.mockReturnValue({
        where: mockDB.where.mockReturnValue({
          get: mockDB.get.mockResolvedValue({
            empty: false,
            docs: [{
              id: 1,
              data: () => ({
                name: 'Team 1',
              }),
            }],
          }),
        }),
      });

      const { getTeamIdByName } = require('../../../src/repositories/pluralsightRepository');
      const id = await getTeamIdByName('Team 1', database);

      expect(mockDB.collection).toHaveBeenCalledTimes(1);
      expect(mockDB.where).toHaveBeenCalledTimes(1);
      expect(mockDB.get).toHaveBeenCalledTimes(1);
      expect(id).toBeTruthy();

      expect(id).toBe(1);
    });

    it('should query the database and return an ID for the team.', async () => {

      database.collection = mockDB.collection.mockReturnValue({
        where: mockDB.where.mockReturnValue({
          get: mockDB.get.mockResolvedValue({
            empty: true,
            docs: [],
          }),
        }),
      });

      const { getTeamIdByName } = require('../../../src/repositories/pluralsightRepository');
      const id = await getTeamIdByName('Team 1', database);

      expect(mockDB.collection).toHaveBeenCalledTimes(1);
      expect(mockDB.where).toHaveBeenCalledTimes(1);
      expect(mockDB.get).toHaveBeenCalledTimes(1);

      expect(id).toBe(0);
    });
  })
});