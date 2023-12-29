const mockGetClient = jest.fn();

const mockGoogle = {
  auth: {
    GoogleAuth: class {
      constructor(...args) {
        this.args = args;
      }

      getClient(...args) {
        return mockGetClient(...args);
      }
    }
  },
};

const googleSheetsService = require('../../../src/services/googleSheets');

jest.mock('googleapis', () => ({
  google: mockGoogle,
}));

describe('googleSheetsService', () => {
  describe('getAuthToken', () => {
    it('should return an auth token', async () => {
      mockGetClient.mockReturnValue('authToken');
      const authToken = await googleSheetsService.getAuthToken();
      expect(authToken).toBeTruthy();
    });
  });
});