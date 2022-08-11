export const formatPhoneNumber = (phoneNumberString, countryCode = false) => {
  let phoneNumber;
  if (countryCode) {
    phoneNumber = phoneNumberString?.replace(/^\+1/, "");
  }
  const originalInput = phoneNumber;
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  if (cleaned === "") {
    return null;
  }

  return originalInput;
};
