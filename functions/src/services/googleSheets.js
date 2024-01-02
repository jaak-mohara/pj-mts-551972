const { google } = require('googleapis');

exports.GoogleSheetService = class GoogleSheetService {
  /**
   * Sets the auth token and spreadsheet ID.
   *
   * @param {string} spreadsheetId
   */
  constructor(spreadsheetId = null) {
    this.setClient();
    this.setSpreadsheetId(spreadsheetId);
  }

  /**
   * Sets the client that we will be working with to interact with Google
   * Sheets.
   */
  async setClient() {
    this.client = google.sheets({
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
    const sheets = await this.getClient();
    const spreadsheetId = this.getSpreadsheetId();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return response.data.values;
  }
};
