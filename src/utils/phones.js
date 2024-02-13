/**
 * Formats a given phone number string to a standard format.
 *
 * @param {string} phoneNumberString - The phone number to format.
 * @param {boolean} [includeCountryCode=false] - Flag to determine if country code should be included in the format.
 * @returns {string|null} The formatted phone number or null if input is invalid.
 */
export const formatPhoneNumber = (phoneNumberString, includeCountryCode = false) => {
  let originalInput = phoneNumberString;
  if (includeCountryCode) {
    originalInput = originalInput?.replace(/^\+1/, "");
  }


  const digitsOnly = originalInput.replace(/\D/g, "");


  const partsMatch = digitsOnly.match(/^(\d{3})(\d{3})(\d{4})$/);

  return partsMatch ? `${partsMatch[1]}-${partsMatch[2]}-${partsMatch[3]}` : (digitsOnly === "" ? null : originalInput);
};
