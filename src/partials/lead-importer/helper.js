import moment from "moment";

import {formatPhoneNumber} from "utils/phones";

export const getFormattedData = ({phone, isTobaccoUser, height, weight, partB, partA, birthdate, email, ...data}) => {
  return {
    ...data,
    phone: phone === "" ? null : String(formatPhoneNumber(phone)).replace(/\D/g, ""),
    email: email === "" ? null : email,
    ...(isTobaccoUser !== null && isTobaccoUser !== undefined
      ? {isTobaccoUser: isTobaccoUser.toLowerCase() === "yes"}
      : {}),
    ...(height !== null && height !== undefined ? {height: Number(height)} : {}),
    ...(weight !== null && weight !== undefined ? {weight: Number(weight)} : {}),
    ...(birthdate !== null && birthdate !== undefined
      ? {birthdate: moment(birthdate, "MM/DD/YYYY").toDate()}
      : {}),
    ...(partA !== null && partA !== undefined ? {partA: moment(partA, "MM/DD/YYYY").toDate()} : {}),
    ...(partB !== null && partB !== undefined ? {partB: moment(partB, "MM/DD/YYYY").toDate()} : {}),
  };
};
