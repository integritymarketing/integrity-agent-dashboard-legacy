/**
 * Truncates a string to the specified length and adds ellipsis if the text is longer.
 *
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - The maximum length of the text including the ellipsis.
 * @returns {string} The truncated text with ellipsis if needed.
 */
function truncateText(text, maxLength = 45) {
    if (text?.length <= maxLength) {
        return text;
    }

    const truncated = text?.substring(0, maxLength - 3);

    return `${truncated}...`;
}

export default truncateText;
