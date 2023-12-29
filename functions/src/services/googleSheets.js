const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/**
 * Fetches an auth token that we can use to edit Google Sheets with.
 *
 * @return {Promise<google.auth.GoogleAuth>}
 */
exports.getAuthToken = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: '../../serviceAccounts/sheetEditor.json',
    scopes: SCOPES,
  });
  const authToken = await auth.getClient();
  return authToken;
};
