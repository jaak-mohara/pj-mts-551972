exports.MethodNotAllowedException = class ValidationException extends Error {
  /**
   * @param {string} message
   */
  constructor(message = 'Method Not Allowed.') {
    super(message);
    this.status = 405;
    this.name = 'MethodNotAllowedException';
  }
};
