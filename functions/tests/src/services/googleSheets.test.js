const mockValues = {
  get: jest.fn(),
  update: jest.fn(),
  append: jest.fn(),
};

const mockGoogle = {
  spreadsheets: {
    values: mockValues,
  },
};

const mockGetClient = jest.fn().mockReturnValue(mockGoogle);

require('dotenv').config();

const mock = process.env.MOCK_TESTS === 'true';
const timeout = mock ? 5000 : 10000;

const { GoogleSheetService } = require('../../../src/services/googleSheets');

mock && jest.mock('googleapis', () => ({
  google: mockGoogle,
}));

describe('googleSheetsService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    this.GoogleService = new GoogleSheetService(
      mockGoogle,
      'test-spreadsheet-id',
    );
  });

  !mock && describe('getAuthToken', () => {
    it('should return an auth token', async () => {
      mockGetClient.mockReturnValue('authToken');
      const authToken = await this.GoogleService.getAuthToken();
      expect(authToken).toBeTruthy();
    });
  });

  describe('get', () => {
    it('should return a list of values for a valid range', async () => {
      mockValues.get.mockReturnValue({
        data: {
          values: [
            ['A2'],
            ['A3'],
            ['A4'],
          ],
        },
        status: 200,
        statusText: 'OK',
      });

      const response = await this.GoogleService.get('Sheet8!A2:A4');

      expect(response).toBeTruthy();
    }, timeout);

    it('should handle invalid range arguments', async () => {
      try {
        const response = await this.GoogleService.get('Sheet100!A2:A4');
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.name).toBe('InvalidRangeException');
      }
    }, timeout);
  });

  describe('set', () => {
    it('should return a list of values for a valid range', async () => {
      mockValues.update.mockReturnValue({
        data: {
          spreadsheetId: 'test-spreadsheet-id',
          updatedRange: 'Sheet8!B2:B4',
          updatedRows: 3,
          updatedColumns: 1,
          updatedCells: 3,
        },
        status: 200,
        statusText: 'OK',
      });
      const response = await this.GoogleService.set(
        'Sheet8!B2',
        [
          ['A2'],
          ['A3'],
          ['A4'],
        ],
      );

      expect(response).toBeTruthy();
      expect(response.updatedCells).toBe(3);
    }, timeout);
  });

  describe('appendRow', () => {
    it('should append a row to the given sheet', async () => {
      mockValues.append.mockReturnValue({
        data: {
          updates: {
            spreadsheetId: 'test-spreadsheet-id',
            updatedRange: "Sheet8!A6:C6",
            updatedRows: 1,
            updatedColumns: 3,
            updatedCells: 3,
          },
        },
        status: 200,
        statusText: "OK",
      });

      const response = await this.GoogleService
        .appendRow(
          'Sheet8',
          ['A2', 'A3', 'A4']
        );

      expect(response).toBeTruthy();
      expect(typeof response).toBe('object');
      expect(response.updatedRange)
        .toBe('Sheet8!A6:C6');
      expect(response.updatedCells).toBe(3);
    });
  });
});