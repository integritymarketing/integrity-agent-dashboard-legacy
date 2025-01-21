/**
 * Formats a full name from the given first, middle, and last names, capitalizing the first letter of each.
 *
 * @param {Object} nameParts - An object containing the name parts.
 * @param {string|null|undefined} nameParts.prefix - The prefix.
 * @param {string|null|undefined} nameParts.firstName - The first name.
 * @param {string|null|undefined} nameParts.middleName - The middle name.
 * @param {string|null|undefined} nameParts.lastName - The last name.
 * @param {string|null|undefined} nameParts.suffix - The suffix.
 * @returns {string} The formatted full name, with each part separated by a space.
 *                   Parts that are null, undefined, or empty strings are omitted.
 */

export const formatFullName = ({
    prefix = "",
    firstName = "",
    middleName = "",
    lastName = "",
    suffix = ""
} = {}) => {
    const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "");

    return [prefix, firstName, middleName, lastName, suffix]
        .filter((name) => name)
        .map(capitalize)
        .join(" ");
};
