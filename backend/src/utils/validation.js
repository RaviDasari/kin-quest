/**
 * Shared validation utilities
 */

const CONSTANTS = {
  ZIP_CODE_REGEX: /^\d{5}$/,
  VALID_GENDERS: ['M', 'F', 'Other', 'Prefer not to say'],
};

/**
 * Validate ZIP code format
 * @param {string} zipCode - ZIP code to validate
 * @returns {boolean} True if valid
 */
const isValidZipCode = (zipCode) => {
  return CONSTANTS.ZIP_CODE_REGEX.test(zipCode);
};

/**
 * Validate gender value
 * @param {string} gender - Gender to validate
 * @returns {boolean} True if valid
 */
const isValidGender = (gender) => {
  return !gender || CONSTANTS.VALID_GENDERS.includes(gender);
};

/**
 * Validate date of birth
 * @param {string|Date} dob - Date of birth
 * @returns {boolean} True if valid
 */
const isValidDOB = (dob) => {
  const date = new Date(dob);
  return !isNaN(date.getTime()) && date < new Date();
};

module.exports = {
  CONSTANTS,
  isValidZipCode,
  isValidGender,
  isValidDOB,
};
