/**
 * Formats an address from an object containing address components.
 *
 * @param {Object} addressObj - The object containing address components.
 * @param {string} addressObj.address1 - The first line of the address.
 * @param {string} [addressObj.address2] - The second line of the address.
 * @param {string} addressObj.city - The city of the address.
 * @param {string} addressObj.stateCode - The state code of the address.
 * @param {string} addressObj.postalCode - The postal code of the address.
 * @param {string} [addressObj.defaultValue="N/A"] - The default value to return if the address is not valid.
 * @returns {string} - The formatted address or the default value if the address is not valid.
 */

export const formatAddress = ({ address1, address2, city, stateCode, postalCode, defaultValue = "N/A" }) => {
    const formattedAddress = [address1, address2, city, stateCode, postalCode].filter(Boolean).join(", ");
    return formattedAddress || defaultValue;
};
