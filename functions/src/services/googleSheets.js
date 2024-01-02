const { google } = require('googleapis');

exports.GoogleSheetService = class GoogleSheetService {
  /**
   * @param {string} spreadsheetId
   */
  constructor() {
    this.setAuthToken();
  }

  /**
   * Fetches and sets an auth token that we can use to edit Google Sheets with.
   *
   * @return {Promise<google.auth.GoogleAuth>}
   */
  async setAuthToken() {
    const auth = new google.auth.GoogleAuth({
      keyFile: '../../serviceAccounts/sheetEditor.json',
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
   * Gets the values from a Google Sheet.
   *
   * @param {string} range
   * @param {string} spreadsheetId
   *
   * @return {Promise<Array<Array<string>>>}
   */
  async get(range, spreadsheetId = null) {
    const sheets = google.sheets({
      version: 'v4',
      auth: await this.getToken(),
    });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return response.data.values;
  }
};
