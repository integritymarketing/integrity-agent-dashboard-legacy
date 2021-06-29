import { formatPhoneNumber } from "./phones";

export const getPrimaryContact = (clientInfo) => {
  const { primaryCommunication, phones, emails } = clientInfo;
  if (primaryCommunication === "email") {
    const email = emails.map((email) => email.leadEmail);
    return email;
  } else if (primaryCommunication === "phone") {
    const phone = phones.map((phone) => phone.leadPhone);
    const formatContactNumber = formatPhoneNumber(phone);
    return formatContactNumber;
  } else return "N/A";
};
