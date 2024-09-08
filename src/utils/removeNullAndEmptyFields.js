/**
 * Recursively removes null, undefined, empty fields, and empty arrays from an object or array,
 * while excluding specific keys (like 'addresses') from being cleaned.
 *
 * @param {Object|Array} obj - The object or array to clean.
 * @param {Array} excludeKeys - Keys to exclude from cleaning (e.g., ['addresses']).
 * @returns {Object|Array} - The cleaned object or array.
 */
const removeNullAndEmptyFields = (obj, excludeKeys = []) => {
    if (Array.isArray(obj)) {
        // Clean the array, but don't touch excluded keys' arrays
        const cleanedArray = obj
            .map((item) => removeNullAndEmptyFields(item, excludeKeys))
            .filter(
                (item) =>
                    item !== null &&
                    item !== undefined &&
                    item !== "" &&
                    (typeof item !== "object" || Object.keys(item).length > 0),
            );
        return cleanedArray.length > 0 ? cleanedArray : [];
    } else if (typeof obj === "object" && obj !== null) {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            // Skip cleaning for excluded keys like 'addresses'
            if (excludeKeys.includes(key)) {
                acc[key] = value;
            } else {
                const cleanedValue = removeNullAndEmptyFields(value, excludeKeys);
                if (
                    cleanedValue !== null &&
                    cleanedValue !== undefined &&
                    cleanedValue !== "" &&
                    (!Array.isArray(cleanedValue) || cleanedValue.length > 0) &&
                    (typeof cleanedValue !== "object" || Object.keys(cleanedValue).length > 0)
                ) {
                    acc[key] = cleanedValue;
                }
            }
            return acc;
        }, {});
    }
    return obj;
};

export default removeNullAndEmptyFields;
