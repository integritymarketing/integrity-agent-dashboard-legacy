import moment from "moment";

const months = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

export const dateFormatter = (date, format) => {
  if (date) {
    date = date.split(" ");
    return moment(
      [date[3], months[date[1]], date[2]].join("-"),
      "YYYY-MM-DD"
    ).format(format);
  } else {
    return moment(Date.now()).format(format);
  }
};
