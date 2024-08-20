import { formatDate } from "utils/dates";

export const getPlanEnrollBody = (agentNumber, agentFirstName, agentLastName, leadDetails, coverageAmount, planName, resource_url, contactId, planType, uwType) => {
    const { firstName, lastName, middleName,
        gender, addresses, emails, birthdate: dateOfBirth, phones, height, weight, isTobaccoUser: smoker, medicareBeneficiaryID, partA, partB } = leadDetails;
    const { city = null, postalCode: zipCode = null, stateCode: state = null, address1 = "", address2 = "" } = addresses?.[0] || {};
    const { leadEmail: emailAddress = null } = emails?.[0] || {};
    const { leadPhone: phoneNumber = null } = phones?.[0] || {};
    const effectiveDate = formatDate(new Date(), "yyyy-MM-dd");
    const heightInches = height ? height : 0;
    const weightLbs = weight ? weight : 0;
    const faceAmount = coverageAmount != null ? coverageAmount.toString() : "0";
    return {
        "enroller": {
            agentLastName,
            agentFirstName,
            agentNumber
        },
        "enrollee": {
            firstName,
            lastName,
            middleName,
            gender: gender,
            dateOfBirth,
            emailAddress,
            phoneNumber,
            address1,
            address2,
            city,
            state: sessionStorage.getItem(contactId)
                ? JSON.parse(sessionStorage.getItem(contactId)).stateCode
                : addresses[0]?.stateCode,
            zipCode,
            heightInches,
            weightLbs,
            smoker,
            effectiveDate
        },
        "medicareNumber": medicareBeneficiaryID,
        "partADate": partA,
        "partBDate": partB,
        "faceAmount": faceAmount,
        "productName": planName,
        "carrierUrl": resource_url,
        planType,
        uwType
    };
}