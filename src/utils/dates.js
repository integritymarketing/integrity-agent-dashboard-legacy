import { parse, parseISO, format, formatDistance } from "date-fns";

export const parseDate = (dateString) => {
  return parse(dateString, "MM/dd/yyyy", new Date());
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

export const getForDistance = (date) => {
  const result = formatDistance(
    new Date(convertUTCDateToLocalDate(date)),
    new Date(),
    {
      addSuffix: true,
    }
  );
  return result;
};

function convertUTCDateToLocalDate(date) {
  date = new Date(date);
  var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
}
