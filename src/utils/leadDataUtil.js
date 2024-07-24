import { formatDate } from "utils/dates";

export const formatPayload = (leadDetails, formData, stateCode) => {
    const {
        modifyDate,
        addresses,
        contactPreferences,
        emails,
        phones,
        firstName,
        lastName,
        middleName,
        leadsId,
        contactRecordType,
        leadStatusId,
        notes,
        medicareBeneficiaryID,
        partA,
        partB,
    } = leadDetails;

    const email = emails.length > 0 ? emails[0].leadEmail : null;
    const phoneData = phones.length > 0 ? phones[0] : null;
    const addressData = addresses.length > 0 ? addresses[0] : null;
    const emailID = emails.length > 0 ? emails[0].emailID : 0;
    const leadAddressId = addressData && addressData.leadAddressId ? addressData.leadAddressId : 0;
    const phoneId = phoneData && phoneData.phoneId ? phoneData.phoneId : 0;

    const city = addressData && addressData.city ? addressData.city : "";
    const state = addressData && addressData.stateCode ? addressData.stateCode : "";
    const address1 = addressData && addressData.address1 ? addressData.address1 : "";
    const address2 = addressData && addressData.address2 ? addressData.address2 : "";
    const county = addressData && addressData.county ? addressData.county : "";
    const countyFips = addressData && addressData.countyFips ? addressData.countyFips : "";
    const postalCode = addressData && addressData.postalCode ? addressData.postalCode : "";
    const phone = phoneData && phoneData.leadPhone ? phoneData.leadPhone : "";
    const phoneLabel = phoneData && phoneData.phoneLabel ? phoneData.phoneLabel : "mobile";

    const isPrimary = contactPreferences?.primary ? contactPreferences?.primary : "email";

    return {
        ...leadDetails,
        firstName,
        lastName,
        middleName,
        email,
        birthdate: leadDetails?.birthdate ? formatDate(leadDetails?.birthdate) : "",
        phones: {
            leadPhone: phone,
            phoneLabel: phoneLabel?.toLowerCase(),
        },
        address: {
            address1,
            address2,
            city,
            stateCode: stateCode || state,
            postalCode,
            county: county || "",
            countyFips,
        },
        primaryCommunication: isPrimary,
        contactRecordType: contactRecordType?.toLowerCase(),
        emailID,
        leadAddressId,
        phoneId,
        leadStatusId,
        leadsId,
        modifyDate,
        notes,
        medicareBeneficiaryID: medicareBeneficiaryID ? formatMbiNumber(medicareBeneficiaryID) : "",
        partA: partA ?? "",
        partB: partB ?? "",
        ...formData,
    };
};
