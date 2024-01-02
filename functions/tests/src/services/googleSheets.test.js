const mockGetClient = jest.fn();

require('dotenv').config();

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

const { GoogleSheetService } = require('../../../src/services/googleSheets');

false && jest.mock('googleapis', () => ({
  google: mockGoogle,
}));

describe('googleSheetsService', () => {
  describe('getAuthToken', () => {
    it('should return an auth token', async () => {
      mockGetClient.mockReturnValue('authToken');
      const authToken = await (new GoogleSheetService()).getAuthToken();
      expect(authToken).toBeTruthy();
    });
  });

  describe('get', () => {
    it('should return a list of values for a valid range', async () => {
      const service = new GoogleSheetService();
      const response = await service.get('Sheet8!A2:A4');

      expect(response).toBeTruthy();
    }, 10000);
  })
});