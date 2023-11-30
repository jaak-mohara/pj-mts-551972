const mockFetch = jest.fn();

jest.mock('node-fetch', () => mockFetch);

describe('fetch_util', () => {
  describe('get', () => {
    beforeAll(() => {
      this.get = require('../../../src/utils/fetch').get;
      jest.resetModules();
      jest.resetAllMocks();

      const { get } = require('../../../src/utils/fetch');

      get('https://example.com');
    });

    it('should call the fetch function', () => {
      expect(mockFetch).toHaveBeenCalled();
    });

    it('should include headers fort he Content-Type and Authorization', () => {
      expect(mockFetch).toHaveBeenCalledWith('https://example.com', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer undefined'
        },
        method: 'GET'
      });
    });
  });
});
