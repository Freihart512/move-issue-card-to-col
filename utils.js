/**
 * Validates if a number is an integer and optionally positive.
 * @param {number} number - The number to validate.
 * @param {boolean} [positive=false] - Whether the number should be positive. Default is false.
 * @returns {boolean} True if the number is an integer and optionally positive, false otherwise.
 */
function validateNumber (number, positive = false) {
  if (!Number.isInteger(Number(number))) {
    return false;
  }

  if (positive && number <= 0) {
    return false;
  }

  return true;
}

/**
 * Validates if a value is a non-empty string.
 * @param {any} value - The value to validate.
 * @returns {boolean} True if the value is a non-empty string, false otherwise.
 */
function validateString (value) {
  return typeof value === 'string' && value.trim() !== '';
}

module.exports = {
  validateNumber,
  validateString,
};
