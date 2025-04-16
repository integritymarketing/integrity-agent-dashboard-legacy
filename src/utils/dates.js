import {
  parse,
  parseISO,
  format,
  differenceInDays,
  differenceInYears,
  intervalToDuration,
} from 'date-fns';
import moment from 'moment';
import getNextAEPEnrollmentYear from 'utils/getNextAEPEnrollmentYear';
import { dateFormatter } from './dateFormatter';

export const DEFAULT_EFFECTIVE_YEAR = [getNextAEPEnrollmentYear()];

export const parseDate = (dateString, format = 'MM/dd/yyyy') => {
  return parse(dateString, format, new Date());
};

export const convertToLocalDateTime = dateString => {
  return moment.utc(dateString).local();
};

export const formatServerDate = (dateString, type) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return format(date, 'yyyy-MM-dd');
};

export const convertAndFormatUTCDateToLocalDate = (
  dateString,
  dateFormat = 'MM/DD/YY',
  timeFormat = 'h:mm A'
) => {
  let date;
  const inputFormat = 'MM/DD/YYYY HH:mm:ss';
  date = moment.utc(dateString, inputFormat).local();
  return {
    formattedDate: date.format(dateFormat),
    formattedTime: date.format(timeFormat),
  };
};

export const isLiveByDate = (goLiveDate = '2022/10/15') => {
  const now = moment();
  const result = moment(moment().year() + goLiveDate, 'YYYY/MM/DD');
  return result.diff(now, 'days') <= 0;
};

export const formatDate = (dateString, formatString = 'MM/dd/yyyy') => {
  if (dateString === null) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? '' : format(date, formatString);
};

export const formatToLocalDate = dateString => {
  const localDate = parseISO(`${dateString}Z`);
  return isNaN(localDate.getTime()) ? '' : format(localDate, 'MM/dd/yyyy');
};

export const getMMDDYY = date => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear().toString().substring(2);

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [month, day, year].join('/');
};

export const convertUTCDateToLocalDate = date => {
  if (date) {
    const local = moment.utc(date).local().format();
    return local;
  }
  return Date.now();
};

export const getForDistance = date => {
  const date1 = new Date(convertUTCDateToLocalDate(date));
  const date2 = new Date();
  const diffTime = Math.abs(date2 - date1);
  const diffSeconds = Math.ceil(diffTime / 1000);
  const diffMinutes = parseInt(diffTime / (1000 * 60));
  const diffHours = parseInt(diffTime / (1000 * 60 * 60));
  const diffDays = parseInt(diffTime / (1000 * 60 * 60 * 24));

  if (diffSeconds < 1) {
    return 'Just Now';
  } else if (diffMinutes < 1) {
    return diffSeconds + ' seconds ago';
  } else if (diffHours < 1) {
    return diffMinutes + ' minutes ago';
  } else if (diffDays < 1) {
    return diffHours + ' hours ago';
  } else if (diffDays < 2) {
    return (
      'Yesterday at ' + format(date1, 'h:mm b') + ' ' + timeZoneAbbreviated()
    );
  } else if (diffDays > 2) {
    return format(date1, 'MM/dd/yyyy h:mm b') + ' ' + timeZoneAbbreviated();
  }
};

const timeZoneAbbreviated = () => {
  const { 1: tz } = new Date().toString().match(/\((.+)\)/);

  // In Chrome browser, new Date().toString() is
  // "Thu Aug 06 2020 16:21:38 GMT+0530 (India Standard Time)"

  // In Safari browser, new Date().toString() is
  // "Thu Aug 06 2020 16:24:03 GMT+0530 (IST)"

  if (tz.includes(' ')) {
    return tz
      .split(' ')
      .map(([first]) => first)
      .join('');
  } else {
    return tz;
  }
};

/**
 * Checks if the given date is overdue by comparing the difference in milliseconds.
 * @param {string | Date} value - The date to compare against the current date.
 * @returns {boolean} - Returns true if the given date is overdue, false otherwise.
 */
export const getOverDue = value => {
  const localDate = convertUTCDateToLocalDate(value); // Convert the UTC date to local date

  const currentDateInMilliSeconds = new Date().getTime(); // Get current date in milliseconds
  const targetDateInMilliSeconds = new Date(localDate).getTime(); // Convert target date to milliseconds

  const timeDifference = currentDateInMilliSeconds - targetDateInMilliSeconds; // Difference in milliseconds

  return timeDifference > 0; // Return true if the difference is greater than 0, meaning overdue
};

export const isOverDue = value => {
  let date = convertUTCDateToLocalDate(value);
  let one = dateFormatter(new Date(), 'MM/DD/yyyy');
  let two = dateFormatter(date, 'MM/DD/yyyy');

  const result = differenceInDays(new Date(one), new Date(two));
  if (result > 0) {
    return true;
  } else return false;
};

export const getFirstEffectiveDateOption = years => {
  const currentDate = new Date();
  currentDate.setDate(15);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  let options = [];

  const validYears =
    Array.isArray(years) && years.length > 0 ? years : [currentYear];

  for (const year of validYears) {
    let startMonth = year === currentYear ? currentMonth + 1 : 0;
    for (let month = startMonth; month < 12; month++) {
      const date = new Date(currentDate);
      date.setMonth(month);
      date.setFullYear(year);
      options.push({
        label: `${date.toLocaleString('default', { month: 'long' })} ${year}`,
        value: date.toISOString(),
      });
    }
  }

  if (validYears.length > 1) {
    const nextYear = Math.max(...validYears);
    const nextYearJanuary = moment(currentDate)
      .year(nextYear)
      .month('Jan')
      .date(15)
      .startOf('day');
    return new Date(nextYearJanuary.toISOString());
  }

  const aepSeasonStart = moment(currentDate)
    .date(1)
    .month('Oct')
    .startOf('day');
  const aepSeasonEnd = moment(currentDate).date(1).month('Dec').startOf('day');

  if (moment(currentDate).isBetween(aepSeasonStart, aepSeasonEnd)) {
    const nextYearJanuary = moment(currentDate)
      .add(1, 'year')
      .month('Jan')
      .date(15)
      .startOf('day');
    options.push({
      label: `January ${nextYearJanuary.year()}`,
      value: nextYearJanuary.toISOString(),
    });
  }

  const decStart = moment(currentDate).date(1).month('Dec').startOf('day');
  const decMid = moment(currentDate).date(14).month('Dec').startOf('day');

  if (moment(currentDate).isBetween(decStart, decMid)) {
    return new Date(`January ${currentYear + 1}`);
  }

  const decMiddle = moment(currentDate).date(15).month('Dec').startOf('day');
  const decEnd = moment(currentDate).endOf('year');

  if (moment(currentDate).isBetween(decMiddle, decEnd)) {
    const nextYear = currentYear + 1;
    for (let month = 0; month < 12; month++) {
      const date = new Date(currentDate);
      date.setMonth(month);
      date.setFullYear(nextYear);
      options.push({
        label: `${date.toLocaleString('default', {
          month: 'long',
        })} ${nextYear}`,
        value: date.toISOString(),
      });
    }
  }

  return options?.length > 0
    ? new Date(options[0]?.value)
    : new Date().setDate(15);
};

export const getNextEffectiveDate = (years, month) => {
  const now = new Date();

  const aepSeasonStart = new moment(now).date(15).month('Oct').startOf('day');
  const aepSeasonEnd = new moment(now).endOf('year');

  if (now >= aepSeasonStart && now <= aepSeasonEnd) {
    const nextYearJanuary = new moment(now)
      .add(1, 'year')
      .month('Jan')
      .date(15)
      .startOf('day');

    return new Date(nextYearJanuary);
  }

  for (const year of years) {
    if (year === now.getFullYear()) {
      now.setMonth(month || now.getMonth() + 1);
      return now;
    } else if (year > now.getFullYear()) {
      now.setFullYear(year);
      now.setMonth(month || 0);
      return now;
    }
  }
};

export function getEffectiveDates(planData) {
  var effectiveStartDate,
    effectiveEndDate = null;
  if (planData.effectiveStartDate) {
    effectiveStartDate = new Date(planData.effectiveStartDate);
  } else {
    effectiveStartDate = new Date();
    effectiveStartDate.setFullYear(DEFAULT_EFFECTIVE_YEAR);
    effectiveStartDate.setMonth(effectiveStartDate.getMonth() + 1); // by default, start NEXT month
  }
  if (planData.effectiveEndDate) {
    effectiveEndDate = new Date(planData.effectiveEndDate);
  } else {
    effectiveEndDate = new Date();
    effectiveEndDate.setFullYear(DEFAULT_EFFECTIVE_YEAR);
    effectiveEndDate.setMonth(11);
  }

  return { effectiveStartDate, effectiveEndDate };
}

export const callDuration = (dateLeft, dateRight) => {
  let dateOne = convertUTCDateToLocalDate(dateLeft);
  let dateTwo = convertUTCDateToLocalDate(dateRight);
  const diffTime = intervalToDuration({
    start: new Date(dateOne),
    end: new Date(dateTwo),
  });
  let { hours, minutes, seconds } = diffTime;

  return `${hours > 9 ? hours : '0' + hours}:${
    minutes > 9 ? minutes : '0' + minutes
  }:${seconds > 9 ? seconds : '0' + seconds}`;
};

export const formattedTime = time => {
  const date = parse(time, 'HH:mm:ss', new Date());

  // Format the Date object into a 12-hour time string
  const convertedTime = format(date, 'h:mm aa');
  return convertedTime;
};

export const getHoursDiffBetweenTwoDays = (endDate, startDate) => {
  var duration = moment.duration(moment(startDate).diff(moment(endDate)));
  return duration.asHours();
};

export const getMonthNumber = date => {
  if (!date) return null;
  return date.getMonth() + 1;
};

/**
 * Parses a date string and returns a Date object or null if invalid.
 * @param {string} dateString - The date string to be parsed.
 * @returns {Date|null}
 */
const parseDateValue = dateString => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Sorts an array of objects based on a date property.
 * @param {Object[]} list - The array of objects to sort.
 * @param {string} dateProperty - The property name of the date to sort by.
 * @param {boolean} ascending - Whether to sort in ascending order.
 * @returns {Object[]}
 */
export const sortListByDate = (list, dateProperty, ascending = true) => {
  return [...list].sort((a, b) => {
    const dateA = parseDateValue(a[dateProperty]);
    const dateB = parseDateValue(b[dateProperty]);

    // Handling null dates
    if (!dateA) return ascending ? -1 : 1;
    if (!dateB) return ascending ? 1 : -1;

    // Sorting
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const getDateTime = dateString => {
  if (!dateString) return null;
  const date = formatDate(dateString, 'MM/dd/yyyy');
  const time = formatDate(dateString, 'h:mm a').toLowerCase();
  return { date, time };
};

export const getLocalDateTime = dateString => {
  if (!dateString) return null;
  const localDateTime = convertToLocalDateTime(dateString);
  const date = formatDate(localDateTime, 'MM/dd/yyyy');
  const time = formatDate(localDateTime, 'h:mm a').toLowerCase();
  const fullDate = formatDate(localDateTime, 'MM/dd/yyyy h:mm a').toLowerCase();
  return { date, time, fullDate };
};

export const getAgeFromBirthDate = birthdate => {
  // If the birthdate is in MM/DD/YYYY format, parse it correctly
  const birthDate = parse(birthdate, 'MM/dd/yyyy HH:mm:ss', new Date());

  // Use the current date as the second parameter
  const currentDate = new Date();

  // Calculate the difference in years
  return differenceInYears(currentDate, birthDate);
};

export const getBirthDateFromAge = age => {
  // Get the current year
  const currentYear = new Date().getFullYear();

  // Calculate the birth year by subtracting the age from the current year
  const birthYear = currentYear - age;

  // Create the Date object for January 1st of the birth year
  const birthDate = moment(`${birthYear}-01-01`); // Creating a moment object with the birth year and January 1st

  // Format the date as YYYY-MM-DD (correct format)
  const formattedDate = birthDate.format('YYYY-MM-DD');

  return formattedDate;
};
export const getSoaDatesFromSummary = inputString => {
  // Regular expression to extract dates and times
  const regex = /(\d{2}\/\d{2}\/\d{4}) (\d{2}:\d{2}:\d{2})/g;

  // Extract all date-time strings from the input
  const dateTimes = [...inputString.matchAll(regex)].map(match => match[0]);

  // Assuming the first date-time is the sent date and the second is the signed date
  const [sentDateTime, signedDateTime] = dateTimes;

  // Convert to desired format
  const formatString = 'YYYY-MM-DDTHH:mm:ss';
  const sentDate = moment(sentDateTime, 'MM/DD/YYYY HH:mm:ss').format(
    formatString
  );
  const signedDate = moment(signedDateTime, 'MM/DD/YYYY HH:mm:ss').format(
    formatString
  );

  return { sentDate, signedDate };
};

/**
 * Validates if the given time string is in 'hh:mm a' format and represents a valid time in 12-hour format.
 * @param {string} timeString - The time string to validate.
 * @returns {boolean} True if the time string is valid, false otherwise.
 */
export function isTimeValid(timeString) {
  if (!timeString) return false;

  return !isNaN(timeString.getTime());
}
