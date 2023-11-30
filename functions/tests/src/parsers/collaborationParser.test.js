const { globalCollaborationAverages } = require('../../mockObjects/collaboration');

describe('collaborationParser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should return a successful response', function () {
    const { collaborationParser } = require('../../../src/parsers/collaborationParser');
    const metrics = collaborationParser(globalCollaborationAverages);
    expect(metrics).toBeTruthy();
  });

  it('should return a parsed list of the collaboration response', function () {
    const { collaborationParser } = require('../../../src/parsers/collaborationParser');
    const metrics = collaborationParser(globalCollaborationAverages);
    expect(metrics).toMatchObject({
      reaction_time: 4.27,
      responsiveness: 2.15,
      time_to_merge: 5.68,
      time_to_first_comment: 6.19,
      rework_time: 8.8,
      iterated_prs: 91.67,
      unreviewed_prs: 33.97,
      thoroughly_reviewed_prs: 14.1,
      pr_count: 156
    });
  });
})