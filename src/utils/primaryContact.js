import { formatPhoneNumber } from "./phones";

export const getPrimaryContact = (clientInfo) => {
  const { primaryContact, phone, email } = clientInfo;
  const formatContactNumber = formatPhoneNumber(phone);
  if (primaryContact === "email") {
    return email;
  } else if (primaryContact === "phone") {
    return formatContactNumber;
  } else return formatContactNumber || email || "N/A";
};
