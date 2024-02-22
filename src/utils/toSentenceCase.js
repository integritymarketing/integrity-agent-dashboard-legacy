/**
 * Converts a string to sentence case.
 * @param {string} text - The text to be converted to sentence case.
 * @returns {string} The converted sentence case string.
 */
export const toSentenceCase = (text) => {
    if (!text) {return '';} // Return an empty string if text is null, undefined, or empty
    return text?.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
  };
  