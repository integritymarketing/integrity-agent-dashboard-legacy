import { useMemo } from "react";

/**
 * Merges two arrays of objects based on the 'leadId' property, combining the properties of each object.
 *
 * @param {Array} policyArray - Array of objects containing policy information.
 * @param {Array} leadArray - Array of objects containing lead information.
 * @returns {Array} - A new array containing merged objects with combined properties.
 */
const useArrayMerger = (policyArray, leadArray) => {
    const mergedArray = useMemo(() => {
        const newArray = [];

        for (const lead of leadArray) {
            const matchingPolicy = policyArray?.find((policy) => policy.leadId === lead.leadsId);

            if (matchingPolicy) {
                const mergedObject = {
                    ...lead,
                    lifePolicyCount: matchingPolicy.lifePolicyCount,
                    healthPolicyCount: matchingPolicy.healthPolicyCount,
                };

                newArray.push(mergedObject);
            } else {
                // If there's no matching policy, add the original lead to the mergedArray
                newArray.push(lead);
            }
        }

        return newArray;
    }, [policyArray, leadArray]);

    return mergedArray;
};

export default useArrayMerger;
