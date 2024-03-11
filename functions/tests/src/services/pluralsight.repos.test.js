const { getRepos } = require('../../../src/services/pluralsight');
const { get } = require('../../../src/utils/fetch');
const { repos: mockRepoResponse } = require('../../mockObjects/repos');

jest.mock('../../../src/utils/fetch');

describe('getRepos', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch the full list of repos from the Pluralsight Flow API', async () => {
    const localMockResponse = mockRepoResponse;

    get.mockResolvedValue(localMockResponse);

    const repos = await getRepos();

    expect(get).toHaveBeenCalledWith('https://flow.pluralsight.com/v3/customer/core/repos/?limit=1000');
    expect(repos.getList()).toEqual(localMockResponse.results);
  });

  it('should use next from the response if it exists', async () => {
    const localMockResponse = {
      ...mockRepoResponse,
      next: 'test url',
    };

    get.mockResolvedValueOnce(localMockResponse);
    get.mockResolvedValueOnce({
      count: 0,
      next: null,
      results: [],
    });

    const repos = await getRepos();

    expect(get).toHaveBeenCalledWith('https://flow.pluralsight.com/v3/customer/core/repos/?limit=1000');
    expect(get).toHaveBeenCalledWith('test url');
    expect(repos.getList()).toEqual(localMockResponse.results);
  });

  it('should return an empty list if there are no repos', async () => {
    get.mockResolvedValue({
      count: 0,
      next: null,
      results: [],
    });

    const repos = await getRepos();

    expect(get).toHaveBeenCalledWith('https://flow.pluralsight.com/v3/customer/core/repos/?limit=1000');
    expect(repos.getList()).toEqual([]);
  });

  it('should return a list of all the tags registered on PluralSight Flow', async () => {
    const localMockResponse = mockRepoResponse;

    get.mockResolvedValue(localMockResponse);

    const repos = await getRepos();

    expect(get).toHaveBeenCalledWith('https://flow.pluralsight.com/v3/customer/core/repos/?limit=1000');
    expect(Array.from(repos.getTagList())).toEqual([
      "experiencethis",
      "kikapay",
      "evo",
      "hostology",
      "pegasus",
      "icq",
      "smc",
      "ekko",
      "lealta",
      "bloss",
      "muov",
      "rmw",
      "acolyte",
      "taos",
      "ea inclusion",
      "geronimo",
      "boardly",
      "qr",
      "kyozo",
      "orderwork",
      "returnal",
      "joy",
      "survey shack",
    ]);
  });

  it('should return a list of repos filtered by a specific tag', async () => {
    const localMockResponse = mockRepoResponse;

    get.mockResolvedValue(localMockResponse);

    const repos = await getRepos();

    expect(get).toHaveBeenCalledWith('https://flow.pluralsight.com/v3/customer/core/repos/?limit=1000');
    expect(repos.getReposByTag('taos').length).toEqual(2);
    expect(repos.getReposByTag('taos').map(({ id }) => id).join(',')).toEqual('2917458,2961111');
  });

  it('should return an empty list if the tag does not exist', async () => {
    const localMockResponse = mockRepoResponse;

    get.mockResolvedValue(localMockResponse);

    const repos = await getRepos();

    expect(get).toHaveBeenCalledWith('https://flow.pluralsight.com/v3/customer/core/repos/?limit=1000');
    expect(repos.getReposByTag('test')).toEqual([]);
  });

  // It should include the tag in the get request if one was sent to the getRepos function
  it('should include the tag in the get request if one was sent to the getRepos function', async () => {
    const localMockResponse = mockRepoResponse;

    get.mockResolvedValue(localMockResponse);

    const repos = await getRepos('test');

    expect(get).toHaveBeenCalledWith('https://flow.pluralsight.com/v3/customer/core/repos/?limit=1000&tags__name=test');
  });
});