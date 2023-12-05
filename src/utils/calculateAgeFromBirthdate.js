import moment from 'moment';

/**
 * Calculates the age from a given birthdate using Moment.js.
 *
 * @param {string} birthdate - The birthdate in a format that can be parsed by Moment.js (e.g., "YYYY-MM-DD").
 * @returns {number} The calculated age based on the birthdate.
 */

const calculateAgeFromBirthdate = (birthdate) => {
  if (!birthdate) return 0; 

  const today = moment();
  const birthDate = moment(birthdate);

  return today.diff(birthDate, 'years');
};

export default calculateAgeFromBirthdate;
