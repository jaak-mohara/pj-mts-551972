/**
 * Divide all numbers in an object by a divisor.
 *
 * @param {object} obj
 * @param {number} divisor
 *
 * @return {object}
 */
exports.divideNumbersInObject = (obj, divisor) => {
  const newObj = {};

  for (const key in obj) {
    if (typeof obj[key] === 'number') {
      newObj[key] = obj[key] / divisor;
    } else if (typeof obj[key] === 'object') {
      newObj[key] = exports.divideNumbersInObject(obj[key], divisor);
    } else {
      newObj[key] = obj[key];
    }
  }

  return newObj;
}