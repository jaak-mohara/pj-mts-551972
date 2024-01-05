const { google } = require('googleapis');
const {
  InvalidRangeException,
} = require('../exceptions/InvalidRangeException');

exports.GoogleSheetService = class GoogleSheetService {
  /**
   * Sets the auth token and spreadsheet ID.
   *
   * @param {google.auth.GoogleAuth} client
   * @param {string} spreadsheetId
   */
  constructor(client = null, spreadsheetId = null) {
    this.setClient(client);
    this.setSpreadsheetId(spreadsheetId);
  }

  /**
   * Sets the client that we will be working with to interact with Google
   * Sheets.
   *
   * @param {google.auth.GoogleAuth} client
   */
  async setClient(client) {
    this.client = client || google.sheets({
      version: 'v4',
      auth: await this.getAuthToken(),
    });
  }

  /**
   * Gets the client that we will be using to interact with Google Sheets.
   *
   * @return {sheets_v4.Sheets}
   */
  async getClient() {
    if (!this.client) {
      await this.setClient();
    }

    return this.client;
  }

  /**
   * Fetches and sets an auth token that we can use to edit Google Sheets with.
   *
   * @return {Promise<google.auth.GoogleAuth>}
   */
  async setAuthToken() {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'serviceAccounts/sheetEditor.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.authToken = await auth.getClient();
  }

  /**
   * Gets the active authentication token.
   *
   * @return {Promise<google.auth.GoogleAuth>}
   */
  async getAuthToken() {
    if (!this.authToken) {
      await this.setAuthToken();
    }

    return this.authToken;
  }

  /**
   * Set the spreadsheet ID that we will be working with.
   *
   * @param {string} spreadsheetId
   */
  setSpreadsheetId(spreadsheetId = null) {
    this.spreadsheetId = spreadsheetId !== null ?
      spreadsheetId :
      process.env.GOOGLE_SHEET_ID;
  }

  /**
   * Gets the spreadsheet ID that we are working with.
   *
   * @return {string}
   */
  getSpreadsheetId() {
    if (!this.spreadsheetId) {
      this.setSpreadsheetId();
    }

    return this.spreadsheetId;
  }

  /**
   * Gets the values from a Google Sheet.
   *
   * @param {string} range
   *
   * @return {Promise<Array<Array<string>>>}
   */
  async get(range) {
    try {
      const sheets = await this.getClient();
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.getSpreadsheetId(),
        range,
      });

      return response.data.values;
    } catch (error) {
      console.error(error.message);
      if (error.errors[0].reason === 'badRequest') {
        throw new InvalidRangeException('Unable to parse: ' + range + '.');
      }

      throw error;
    }
  }

  /**
   * Sets the values from a Google Sheet.
   *
   * @param {string} range
   * @param {Array<Array<string>>} values
   * @param {'ROWS'|'COLUMNS'} dimension
   *
   * @return {Promise<{
   *    spreadsheetId: string,
   *    updatedRange: string,
   *    updatedRows: number,
   *    updatedColumns: number,
   *    updatedCells: number,
   * }>}
   */
  async set(range, values, dimension = 'ROWS') {
    try {
      const sheets = await this.getClient();
      const response = await sheets.spreadsheets.values
        .update({
          spreadsheetId: this.getSpreadsheetId(),
          range,
          valueInputOption: 'USER_ENTERED',
          resource: {
            majorDimension: dimension,
            values,
          },
        });

      return response.data;
    } catch (error) {
      console.error(error.message);
      if (error.errors[0].reason === 'badRequest') {
        throw new InvalidRangeException('Unable to parse: ' + range + '.');
      }

      throw error;
    }
  }

  /**
   * Appends the values as a new row to the given sheet.
   *
   * @param {string} tabName
   * @param {Array<Array<string>>} values
   *
   * @return {Promise<{
   *    spreadsheetId: string,
   *    updatedRange: string,
   *    updatedRows: number,
   *    updatedColumns: number,
   *    updatedCells: number,
   * }>}
   */
  async appendRow(tabName, values) {
    try {
      const sheets = await this.getClient();
      const response = await sheets.spreadsheets.values
        .append({
          spreadsheetId: this.getSpreadsheetId(),
          range: tabName,
          valueInputOption: 'USER_ENTERED',
          resource: {
            majorDimension: 'ROWS',
            values: [values],
          },
        });

      return response.data.updates;
    } catch (error) {
      console.error(error.message);
      if (error.errors[0].reason === 'badRequest') {
        throw new InvalidRangeException('Unable to parse: ' + tabName + '.');
      }

      throw error;
    }
  }

  /**
   * Checks if a tab exists in the spreadsheet.
   *
   * @param {string} tabName
   * @return {boolean}
   */
  async checkTab(tabName) {
    const sheets = await this.getClient();
    const response = await sheets.spreadsheets.get({
      spreadsheetId: this.getSpreadsheetId(),
    });

    const sheetsList = response.data.sheets
      .map((sheet) => sheet.properties.title);

    return sheetsList.includes(tabName);
  }

  /**
   * Function to create a new tab in the spreadsheet.
   *
   * @param {string} tabName
   * @return {Promise<{
   *  spreadsheetId: string,
   *  replies: ?Array<{
   *    addSheet: {
   *      properties: {
   *        title: string,
   *      }
   *    }
   *  }>,
   *  error: ?string
   * }>}
   */
  async createTab(tabName) {
    const sheets = await this.getClient();
    try {
      const response = await sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.getSpreadsheetId(),
        resource: {
          requests: [{
            addSheet: {
              properties: {
                title: tabName,
              },
            },
          }],
        },
      });

      return response.data;
    } catch (error) {
      console.error(error.message);

      if (error.message.includes('already exists')) {
        return {
          spreadsheetId: this.getSpreadsheetId(),
          replies: [],
          error: 'A tab with the name "' + tabName + '" already exists.',
        };
      }

      throw error;
    }
  }
};
