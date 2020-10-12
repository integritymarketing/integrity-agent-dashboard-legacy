// Utility functions for date manipulation
import dateFnsParse from "date-fns/parse";
import dateFnsFormat from "date-fns/format";

export const parseDate = (dateString) => {
  return dateFnsParse(dateString, "MM/dd/yyyy", new Date());
};

export const formatServerDate = (dateString) => {
  const date = new Date(dateString);
  return dateFnsFormat(date, "yyyy-MM-dd");
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "" : dateFnsFormat(date, "MM/dd/yyyy");
};
