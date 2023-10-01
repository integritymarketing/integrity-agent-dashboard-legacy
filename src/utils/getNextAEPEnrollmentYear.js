import moment from 'moment';

/**
 * Get the next enrollment year based on the current date. If the current date is on or after October 1st,
 * the next enrollment year is the next calendar year. Otherwise, it's the current year.
 * @returns {number} The next enrollment year for AEP (Annual Enrollment Period).
 */

const getNextAEPEnrollmentYear = () => {
  const now = moment();

  // Define the date for October 1st of the current year
  const octoberFirstOfThisYear = moment().year(now.year()).month(9).date(1);

  // Check if the current date is on or after October 1st
  if (now.isSameOrAfter(octoberFirstOfThisYear)) {
    return now.year() + 1;
  }

  return now.year();
};

export default getNextAEPEnrollmentYear;