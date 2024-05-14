const { validateNumber, validateString } = require('./utils');

describe('validateNumber function', () => {
  it('should return true for a positive integer when positive flag is true', () => {
    expect(validateNumber(10, true)).toBe(true);
  });
  it('should return true for a positive integer when positive flag is true even if number is a string', () => {
    expect(validateNumber('10', true)).toBe(true);
  });

  it('should return true for a negative integer when positive flag is false', () => {
    expect(validateNumber(-10)).toBe(true);
  });

  it('should return false for a non-integer number', () => {
    expect(validateNumber(10.5)).toBe(false);
  });

  it('should return false for a non-positive integer when positive flag is true', () => {
    expect(validateNumber(-10, true)).toBe(false);
  });
});

describe('validateString function', () => {
  it('should return true for a non-empty string', () => {
    expect(validateString('Hello')).toBe(true);
  });

  it('should return false for an empty string', () => {
    expect(validateString('')).toBe(false);
  });

  it('should return false for a non-string value', () => {
    expect(validateString(123)).toBe(false);
  });
});
