/**
 * Formats a full name from the given first, middle, and last names, capitalizing the first letter of each.
 * 
 * @param {string|null|undefined} firstName - The first name.
 * @param {string|null|undefined} middleName - The middle name.
 * @param {string|null|undefined} lastName - The last name.
 * @returns {string} The formatted full name, with each part separated by a space. 
 *                   Parts that are null, undefined, or empty strings are omitted.
 */

export const formatFullName = (firstName, middleName, lastName) => {
    const capitalize = str => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

    return [firstName, middleName, lastName]
        .filter(name => name)
        .map(capitalize)
        .join(' ');
};