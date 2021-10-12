import { parse, parseISO, format } from "date-fns";

const DEFAULT_EFFECTIVE_YEAR = [
  parseInt(process.env.REACT_APP_CURRENT_PLAN_YEAR || 2022),
];

export const parseDate = (dateString, format = "MM/dd/yyyy") => {
  return parse(dateString, format, new Date());
};

export const formatServerDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "yyyy-MM-dd");
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "" : format(date, "MM/dd/yyyy");
};

export const formatToLocalDate = (dateString) => {
  const localDate = parseISO(`${dateString}Z`);
  return isNaN(localDate.getTime()) ? "" : format(localDate, "MM/dd/yyyy");
};

export const getMMDDYY = (date) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear().toString().substring(2);

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [month, day, year].join("/");
};

function convertUTCDateToLocalDate(date) {
  date = new Date(date);
  var newDate = new Date(date + "UTC");
  newDate.toString();
  return newDate;
}

export const getForDistance = (date) => {
  const date1 = new Date(convertUTCDateToLocalDate(date));
  const date2 = new Date();
  const diffTime = Math.abs(date2 - date1);
  const diffSeconds = Math.ceil(diffTime / 1000);
  const diffMinutes = parseInt(diffTime / (1000 * 60));
  const diffHours = parseInt(diffTime / (1000 * 60 * 60));
  const diffDays = parseInt(diffTime / (1000 * 60 * 60 * 24));

  if (diffSeconds < 1) {
    return "Just Now";
  } else if (diffMinutes < 1) {
    return diffSeconds + " seconds ago";
  } else if (diffHours < 1) {
    return diffMinutes + " minutes ago";
  } else if (diffDays < 1) {
    return diffHours + " hours ago";
  } else if (diffDays < 2) {
    return (
      "Yesterday at " + format(date1, "h:mm b") + " " + timeZoneAbbreviated()
    );
  } else if (diffDays > 2) {
    return format(date1, "MM/dd/yyyy h:mm b") + " " + timeZoneAbbreviated();
  }
};

const timeZoneAbbreviated = () => {
  const { 1: tz } = new Date().toString().match(/\((.+)\)/);

  // In Chrome browser, new Date().toString() is
  // "Thu Aug 06 2020 16:21:38 GMT+0530 (India Standard Time)"

  // In Safari browser, new Date().toString() is
  // "Thu Aug 06 2020 16:24:03 GMT+0530 (IST)"

  if (tz.includes(" ")) {
    return tz
      .split(" ")
      .map(([first]) => first)
      .join("");
  } else {
    return tz;
  }
};

export const getOverDue = (value) => {
  let date = convertUTCDateToLocalDate(value);
  if (new Date(date) < new Date()) {
    let Difference_In_Time = Math.abs(new Date() - new Date(date));
    var Difference_In_Days = parseInt(Difference_In_Time / (1000 * 3600 * 24));
    if (Difference_In_Days > 0) {
      return `${Difference_In_Days.toString()} Day${
        Difference_In_Days.toString() > 1 ? "s" : ""
      } Overdue`;
    }
    return false;
  }
  return false;
};

export const getNextEffectiveDate = (years) => {
  const now = new Date();

  for (const year of years) {
    if (year === now.getFullYear()) {
      now.setMonth(now.getMonth() + 1);
      return now;
    } else if (year > now.getFullYear()) {
      now.setFullYear(year);
      now.setMonth(0);
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
