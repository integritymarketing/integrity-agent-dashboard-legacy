import moment from 'moment'

export const dateFormatter = (date, format) => {
  return moment(date || Date.now()).format(format);
};
  