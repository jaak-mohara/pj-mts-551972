/**
 * Basic handler to return the message in the body of the request.
 * @param {{ body: { message: string }}} request
 * @param { * } response
 * @return { Promise<{statusCode: number, body: string}> }
 */
exports.handler = async (request, response) => {
  // Return the message in the body of the request.
  response
    .status(200)
    .send(JSON.stringify({ message: request.body.message }));
};
