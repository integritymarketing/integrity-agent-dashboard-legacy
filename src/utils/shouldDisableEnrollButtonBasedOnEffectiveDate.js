import moment from "moment";

const shouldDisableEnrollButtonBasedOnEffectiveDate = (effectiveDate) => {
  // Extract the year from the effective date string
  const effectiveYear = moment(effectiveDate, "MMMM YYYY").year();

  // Get the current year
  const currentYear = moment().year();

  // Check if the effective year is equal to current year + 1
  if (effectiveYear === currentYear + 1) {
    // Get the current date and month
    const currentDate = moment();
    const currentMonth = currentDate.month() + 1; // January is 0, so we add 1
    const currentDay = currentDate.date();

    // Check if the current date is between October 1 and October 15
    if (currentMonth === 10 && currentDay >= 1 && currentDay <= 15) {
      return true;
    }
  }

  // Return false if any of the conditions are not met
  return false;
};

export default shouldDisableEnrollButtonBasedOnEffectiveDate;
