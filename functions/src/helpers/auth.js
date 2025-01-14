/**
 * Checks to see if the request is authenticated.
 *
 * @param {*} request
 * @param {*} database
 *
 * @return {boolean}
 */
exports.authenticate = async (request, database) => {
  const apiKey = request.headers['x-api-key'];

  if (!apiKey) {
    return false;
  }

  const snapshot = await database
    .collection('api_keys')
    .where('key', '==', apiKey)
    .get();

  if (snapshot.empty) {
    return false;
  }

  return true;
};
