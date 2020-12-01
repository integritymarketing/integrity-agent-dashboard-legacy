import { parse, parseISO, format } from "date-fns";

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
