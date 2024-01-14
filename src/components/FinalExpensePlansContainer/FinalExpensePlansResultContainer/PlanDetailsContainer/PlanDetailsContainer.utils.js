import { formatDate } from "utils/dates";

export const getPlanEnrollBody = (agentNumber, agentFirstName, agentLastName, leadDetails, coverageAmount, planName, resource_url) => {
    const { firstName, lastName, gender, addresses, emails, birthdate: dateOfBirth, phones, height: heightInches, weight: weightLbs, isTobaccoUser: smoker } = leadDetails;
    const { city = null, postalCode: zipCode = null, stateCode: state = null } = addresses?.[0] || {};
    const { leadEmail: emailAddress = null } = emails?.[0] || {};
    const { leadPhone: phoneNumber = null } = phones?.[0] || {};
    const effectiveDate = formatDate(new Date(), "yyyy-MM-dd");
    return {
        "enroller": {
            agentLastName,
            agentFirstName,
            agentNumber
        },
        "enrollee": {
            firstName,
            lastName,
            gender,
            dateOfBirth,
            emailAddress,
            phoneNumber,
            city,
            state,
            zipCode,
            heightInches,
            weightLbs,
            smoker,
            effectiveDate
        },
        "faceAmount": coverageAmount.toString(),
        "productName": planName,
        "carrierUrl": resource_url
    };
}