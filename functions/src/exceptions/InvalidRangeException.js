exports.InvalidRangeException = class AuthException extends Error {
  /**
   * @param {string} message
   */
  constructor(message = 'Unable to parse range.') {
    super(message);
    this.status = 400;
    this.name = 'InvalidRangeException';
  }
};
