import moment from 'moment'

export const dateFormatter = (date, format) => {
    const formattedDate = moment(date).format(format);
    return formattedDate;
  };
  