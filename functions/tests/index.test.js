require('dotenv').config();

describe('ENV', () => {
  it('should have a variable for MOCK_TESTS', () => {
    expect(process.env.MOCK_TESTS).toBeDefined();
  });
})