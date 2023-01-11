import {
  parse,
  parseISO,
  format,
  differenceInDays,
  intervalToDuration,
} from "date-fns";
import moment from "moment";
import { dateFormatter } from "./dateFormatter";

const DEFAULT_EFFECTIVE_YEAR = [
  parseInt(process.env.REACT_APP_CURRENT_PLAN_YEAR || 2023),
];

export const parseDate = (dateString, format = "MM/dd/yyyy") => {
  return parse(dateString, format, new Date());
};

export const formatServerDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "yyyy-MM-dd");
};

export const isLiveByDate = (goLiveDate = "2022/10/15") => {
  const now = moment();
  const result = moment(moment().year() + goLiveDate, "YYYY/MM/DD");
  return result.diff(now, "days") <= 0;
};

export const formatDate = (dateString, formatString = "MM/dd/yyyy") => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "" : format(date, formatString);
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

export const convertUTCDateToLocalDate = (date) => {
  if (date) {
    const local = moment.utc(date).local().format();
    return local;
  }
  return Date.now();
};

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
  let one = dateFormatter(new Date(), "MM/DD/yyyy");
  let two = dateFormatter(date, "MM/DD/yyyy");

  const result = differenceInDays(new Date(one), new Date(two));
  if (result > 0) {
    return `${result.toString()} Day${
      result.toString() > 1 ? "s" : ""
    } Overdue`;
  } else return false;
};

export const getFirstEffectiveDateOption = (years) => {
  let initialValue = new Date();
  initialValue.setDate(15); // setting the day of month here to the middle of the month, to avoid timezone issues.

  let options = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  for (const year of years) {
    var i = year === now.getFullYear() ? currentMonth + 1 : 0;
    while (i < 12) {
      let date = new Date(initialValue);
      date.setMonth(i);
      date.setFullYear(year);
      options.push({
        label: `${date.toLocaleString("default", {
          month: "long",
        })} ${date.getFullYear()} `,
        value: date.toISOString(),
      });
      i++;
    }
  }

  const aepSeasonStart = new moment(now).date(1).month("Oct").startOf("day");
  const aepSeasonEnd = new moment(now).date(1).month("Dec").startOf("day");

  if (now >= aepSeasonStart && now <= aepSeasonEnd) {
    const nextYearJanuary = new moment(now)
      .add(1, "year")
      .month("Jan")
      .date(15)
      .startOf("day");

    options.push({
      label: `January ${nextYearJanuary.year()} `,
      value: nextYearJanuary.toISOString(),
    });
  }

  const decStart = new moment(now).date(1).month("Dec").startOf("day");
  const decMid = new moment(now).date(14).month("Dec").startOf("day");

  if (now >= decStart && now <= decMid) {
    const nextYearJanuary = new moment(now)
      .add(1, "year")
      .month("Jan")
      .date(15)
      .startOf("day");

    return new Date(`January ${nextYearJanuary.year()} `);
  }

  const decMiddle = new moment(now).date(15).month("Dec").startOf("day");
  const decEnd = new moment(now).endOf("year");

  if (now >= decMiddle && now <= decEnd) {
    let year = now.getFullYear() + 1;
    let i = 0;
    while (i < 12) {
      let date = new Date(initialValue);
      date.setMonth(i);
      date.setFullYear(year);
      options.push({
        label: `${date.toLocaleString("default", {
          month: "long",
        })} ${date.getFullYear()} `,
        value: date.toISOString(),
      });
      i++;
    }
  }
  return options?.length > 0
    ? new Date(options[0]?.label)
    : new Date().setDate(15);
};

export const getNextEffectiveDate = (years, month) => {
  const now = new Date();

  const aepSeasonStart = new moment(now).date(15).month("Oct").startOf("day");
  const aepSeasonEnd = new moment(now).endOf("year");

  if (now >= aepSeasonStart && now <= aepSeasonEnd) {
    const nextYearJanuary = new moment(now)
      .add(1, "year")
      .month("Jan")
      .date(15)
      .startOf("day");

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

  return `${hours > 9 ? hours : "0" + hours}:${
    minutes > 9 ? minutes : "0" + minutes
  }:${seconds > 9 ? seconds : "0" + seconds}`;
};