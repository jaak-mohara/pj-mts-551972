const { authenticate } = require("../../../src/helpers/auth");

describe('auth', () => {
  describe('authenticate', () => {
    it('should return flase if there is no api-key in the request', async () => {
      const request = {
        headers: {}
      };
      const result = await authenticate(request);
      expect(result).toBe(false);
    });
    it('should return false if the api-key is not valid', async () => {
      const request = {
        headers: {
          'x-api-key': 'invalid'
        }
      };
      const database = {
        collection: () => ({
          where: () => ({
            get: () => Promise
              .resolve({ empty: true })
          })
        })
      };
      const result = await authenticate(request, database);
      expect(result).toBe(false);
    });
    it('should return false if the api-key is not valid', async () => {
      const request = {
        headers: {
          'x-api-key': 'valid'
        }
      };
      const database = {
        collection: () => ({
          where: () => ({
            get: () => Promise
              .resolve({ empty: false })
          })
        })
      };
      const result = await authenticate(request, database);
      expect(result).toBe(true);
    });
  })
})