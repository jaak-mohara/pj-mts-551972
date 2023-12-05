exports.AuthException = class AuthException extends Error {
  /**
   * @param {string} message
   */
  constructor(message = 'You are not authorised to perform this action.') {
    super(message);
    this.status = 403;
    this.name = 'AuthException';
  }
};
