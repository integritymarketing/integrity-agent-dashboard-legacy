import { formatPhoneNumber } from "./phones";

export const getPrimaryContact = (clientInfo) => {
  const { primaryContact, phones, emails } = clientInfo;
  if (primaryContact === "Email") {
    const email = emails.map((email) => email.leadEmail);
    return email;
  } else if (primaryContact === "Phone") {
    const phone = phones.map((phone) => phone.leadPhone);
    const formatContactNumber = formatPhoneNumber(phone);
    return formatContactNumber;
  } else return "N/A";
};
