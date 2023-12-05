exports.ValidationException = class ValidationException extends Error {
  /**
   * @param {string} message
   */
  constructor(message = 'Validation failed.') {
    super(message);
    this.name = 'ValidationException';
  }
};
