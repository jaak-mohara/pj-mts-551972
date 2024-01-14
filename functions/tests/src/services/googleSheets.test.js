const mockValues = {
  get: jest.fn(),
  update: jest.fn(),
  append: jest.fn(),
};

const mockSpreadsheets = {
  get: jest.fn(),
  values: mockValues,
};

const mockGoogle = {
  spreadsheets: mockSpreadsheets,
};

const mockGetClient = jest.fn().mockReturnValue(mockGoogle);

require('dotenv').config();

// const mock = process.env.MOCK_TESTS === 'true';
const mock = false;
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
      mock ? mockGoogle : undefined,
      mock ? 'test-spreadsheet-id' : undefined,
    );
  });

  !mock && describe('getAuthToken', () => {
    it('should return an auth token', async () => {
      mockGetClient.mockReturnValue('authToken');
      const authToken = await this.GoogleService.getAuthToken();
      expect(authToken).toBeTruthy();
    });
  });

  false && describe('get', () => {
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

  false && describe('set', () => {
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

  false && describe('appendRow', () => {
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
      mock && expect(response.updatedRange)
        .toBe('Sheet8!A6:C6');
      expect(response.updatedCells).toBe(3);
    });
  });

  false && describe('checkTab', () => {
    it('should return true if the tab exists', async () => {
      mockSpreadsheets.get.mockReturnValue({
        data: {
          sheets: [{
            properties: {
              title: 'Sheet8',
            },
          }],
        }
      });
      const response = await this.GoogleService.checkTab('Sheet8');

      expect(response).toBeTruthy();
      expect(response).toBe(true);
    });

    it('should return false if the tab does not exist', async () => {
      mockSpreadsheets.get.mockReturnValue({
        data: {
          sheets: [{
            properties: {
              title: 'Sheet8',
            },
          }],
        }
      });
      const response = await this.GoogleService.checkTab('Sheet-1');

      expect(response).toBeFalsy();
      expect(response).toBe(false);
    });
  });

  false && describe('createTab', () => {
    it('should create a new sheet', async () => {
      mockSpreadsheets.get.mockReturnValue({
        spreadsheetId: "test-spreadsheet-id",
        replies: [
          {
            addSheet: {
              properties: {
                title: "TEST",
              },
            },
          },
        ],
      });

      const response = await this.GoogleService.createTab('TEST');
      expect(response).toBeTruthy();
      mock && expect(response.replies[0].addSheet.properties.title).toBe('TEST');
      mock && expect(response.spreadsheetId).toBe('test-spreadsheet-id');
    });

    it('should fail gracefully if the tab exists already', async () => {
      mockSpreadsheets.get.mockReturnValue({
        spreadsheetId: "test-spreadsheet-id",
        replies: [],
        error: 'A tab with the name "TEST" already exists.'
      });

      const response = await this.GoogleService.createTab('TEST');
      expect(response).toBeTruthy();
      mock && expect(response.replies?.length).toBe(0);
      mock && expect(response.spreadsheetId).toBe('test-spreadsheet-id');
      expect(response.error).toBe('A tab with the name "TEST" already exists.');
    });
  }, timeout);

  describe('bulkUpdateRow', () => {
    it('should update a row to the given sheets', async () => {
      mock && mockValues.append.mockReturnValue([
        {
          spreadsheetId: "1DeAf9z2ONGGWapJS357I7r3qGuatLDemBmsjBtospfw",
          updatedRange: "Sheet8!A1:C1",
          updatedRows: 1,
          updatedColumns: 3,
          updatedCells: 3,
        },
        {
          spreadsheetId: "1DeAf9z2ONGGWapJS357I7r3qGuatLDemBmsjBtospfw",
          updatedRange: "Sheet8!A1:C1",
          updatedRows: 1,
          updatedColumns: 3,
          updatedCells: 3,
        },
      ]);

      const response = await this.GoogleService
        .bulkAppendRow([{
          range: 'Sheet8',
          values: [['A2', 'A3', 'A4']],
        }, {
          range: 'Sheet9',
          values: [['A5', 'A6', 'A7']],
        }]);

      expect(response).toBeTruthy();
      expect(typeof response).toBe('object');
      mock && expect(response[0].updatedRange)
        .toBe('Sheet8!A6:C6');
      expect(response[0].updatedCells).toBe(3);
      expect(response[1].updatedCells).toBe(3);
    });
  });
});