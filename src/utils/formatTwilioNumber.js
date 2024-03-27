export const formatTwilioNumber = (phoneNumber) => {
  const phoneNumberWithoutCountryCode = phoneNumber?.replace(/^\+1/, "");
  const digitsOnly = (`${phoneNumberWithoutCountryCode}`).replace(/\D/g, "");
  const match = digitsOnly.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  return null;
};