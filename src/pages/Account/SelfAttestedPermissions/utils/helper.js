/**
 * Extracts unique carrier values from an array of objects.
 *
 * @param {Array} data - The array of objects containing carrier information.
 * @returns {Array} An array of unique carrier values extracted from the input data.
 */
function getUniqueCarriers(data) {
  const uniqueCarriers = new Set();
  for (const item of data) {
    if (item.carrier) {
      uniqueCarriers.add(item.carrier);
    }
  }

  return Array.from(uniqueCarriers);
}

/**
 * Groups unique plan types by carrier and returns an object with the format record<carrier, planType[]>.
 *
 * @param {Array} data - The array of objects containing product information.
 * @returns {Object} An object with carrier as the key and an array of unique plan types as the value.
 */
function groupUniquePlanTypesByCarrier(data) {
  const record = {};

  for (const item of data) {
    const carrier = item.carrier;
    const planType = item.planType;

    // If the carrier is not already in the record, create an empty Set for it
    if (!record[carrier]) {
      record[carrier] = new Set();
    }

    // Add the planType to the carrier's Set to ensure uniqueness
    record[carrier].add(planType);
  }

  // Convert the Sets to arrays
  for (const carrier in record) {
    record[carrier] = Array.from(record[carrier]);
  }

  return record;
}

/**
 * Groups unique plan years by carrier and returns an object with the format record<carrier, planYear[]>.
 *
 * @param {Array} data - The array of objects containing product information.
 * @returns {Object} An object with carrier as the key and an array of unique plan years as the value.
 */
function groupUniquePlanYearsByCarrier(data) {
  const record = {};

  for (const item of data) {
    const carrier = item.carrier;
    const planYear = item.planYear;

    // If the carrier is not already in the record, create an empty Set for it
    if (!record[carrier]) {
      record[carrier] = new Set();
    }

    // Add the planYear to the carrier's Set to ensure uniqueness
    record[carrier].add(planYear);
  }

  // Convert the Sets to arrays
  for (const carrier in record) {
    record[carrier] = Array.from(record[carrier]);
  }

  return record;
}

/**
 * Converts an array of strings to an array of objects with the format [{ label: value, value: value }].
 *
 * @param {Array} inputArray - The array of strings to convert.
 * @returns {Array} An array of objects with label and value properties.
 */
function convertArrayToOptions(inputArray) {
  return inputArray.map((value) => ({ label: value, value: value }));
}

/**
 * Filters and returns an array of unique records where "isSelfAttested" is equal to TRUE.
 *
 * @param {Array} data - The array of objects containing the records.
 * @returns {Array} An array of unique records with "isSelfAttested" equal to TRUE.
 */
function getRecordsWithSelfAttestation(data) {
  const uniqueRecords = [];
  const seenIds = new Set();

  for (const item of data) {
    if (item.isSelfAttested === "TRUE" && !seenIds.has(item.producerId)) {
      uniqueRecords.push(item);
      seenIds.add(item.producerId);
    }
  }
  
  return uniqueRecords;
}

export {
  getUniqueCarriers,
  groupUniquePlanTypesByCarrier,
  groupUniquePlanYearsByCarrier,
  convertArrayToOptions,
  getRecordsWithSelfAttestation,
};
