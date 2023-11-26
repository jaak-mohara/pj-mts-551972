const { divideNumbersInObject } = require('../../src/utils/objects');

describe('objects_util', () => {
  describe('divideNumbersInObject', () => {
    it('should return a truthy value if an empty object is given', () => {
      const obj = {};
      const divisor = 1;
      const result = divideNumbersInObject(obj, divisor);

      expect(result).toBeTruthy();
    });

    it('should return a truthy value if an object with numbers is given', () => {
      const obj = {
        number: 1,
        nested: {
          number: 2
        }
      };
      const divisor = 1;
      const result = divideNumbersInObject(obj, divisor);

      expect(result).toBeTruthy();
    });

    it('should return the original object with all of the number fields divided by the given devisor', () => {
      const obj = {
        number: 1,
        nested: {
          number: 2
        }
      };
      const divisor = 2;
      const result = divideNumbersInObject(obj, divisor);

      expect(result.number).toEqual(0.5);
      expect(result.nested.number).toEqual(1);
    });
  });
});
