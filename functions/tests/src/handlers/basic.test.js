// Describe block fo the basicHandler.
describe('basic_handler', () => {
  // Test 200 response from the basicHandler.
  test('should return a 200 response', () => {
    const { handler } = require('../../../src/handlers/basic');

    // Create a mock response object.
    const res = {
      // Create a status method that returns the response object.
      status: jest.fn().mockReturnThis(),
      // Create a send method that returns the response object.
      send: jest.fn().mockReturnThis(),
    };

    // Create a mock request that sends a test message in the body.
    const req = {
      body: {
        message: 'Hello from the basicHandler',
      },
    };

    // Call the basicHandler with the mock response object.
    handler(req, res);

    // Expect the status method to have been called with 200.
    expect(res.status).toHaveBeenCalledWith(200);

    // Expect the send method to have been called with the message 'Hello from the basicHandler'.
    expect(res.send).toHaveBeenCalledWith('{"message":"Hello from the basicHandler"}');
  });
});