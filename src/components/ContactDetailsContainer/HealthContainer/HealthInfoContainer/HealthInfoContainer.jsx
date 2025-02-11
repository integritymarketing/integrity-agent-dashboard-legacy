import { useState } from "react";

import { useLeadDetails } from "providers/ContactDetails";

import { formatDate } from "utils/dates";

import { EditHealthInfo } from "./EditHealthInfo";
import { ViewHealthInfo } from "./ViewHealthInfo";

const HealthInfoContainer = () => {
    const [isEditHealthInfo, setIsEditHealthInfo] = useState(false);
    const { leadDetails, updateLeadDetails } = useLeadDetails();

    const formatMbiNumber = (value) => {
        if (!value) {return;}
        let formattedValue = value.replace(/-/g, "");
        if (formattedValue.length > 4) {
            formattedValue = `${formattedValue.slice(0, 4)  }-${  formattedValue.slice(4)}`;
        }
        if (formattedValue.length > 8) {
            formattedValue = `${formattedValue.slice(0, 8)  }-${  formattedValue.slice(8)}`;
        }
        return formattedValue.toUpperCase();
    };

    const {
        birthdate,
        gender,
        weight,
        height,
        isTobaccoUser,
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

    const smoker = isTobaccoUser ? "Yes" : "No";

    const onSave = async (formData) => {
        const email = emails.length > 0 ? emails[0].leadEmail : null;
        const phoneData = phones.length > 0 ? phones[0] : null;
        const addressData = addresses.length > 0 ? addresses?.[0] : null;
        const emailID = emails.length > 0 ? emails[0].emailID : 0;
        const leadAddressId = addressData && addressData.leadAddressId ? addressData.leadAddressId : 0;
        const phoneId = phoneData && phoneData.phoneId ? phoneData.phoneId : 0;

        const city = addressData && addressData.city ? addressData.city : "";
        const stateCode = addressData && addressData.stateCode ? addressData.stateCode : "";
        const address1 = addressData && addressData.address1 ? addressData.address1 : "";
        const address2 = addressData && addressData.address2 ? addressData.address2 : "";
        const county = addressData && addressData.county ? addressData.county : "";
        const countyFips = addressData && addressData.countyFips ? addressData.countyFips : "";
        const postalCode = addressData && addressData.postalCode ? addressData.postalCode : "";
        const phone = phoneData && phoneData.leadPhone ? phoneData.leadPhone : "";
        const phoneLabel = phoneData && phoneData.phoneLabel ? phoneData.phoneLabel : "mobile";

        const isPrimary = contactPreferences?.primary ? contactPreferences?.primary : "email";

        const initialValues = {
            firstName: firstName,
            lastName: lastName,
            middleName: middleName,
            email: email,
            birthdate: birthdate ? formatDate(birthdate) : "",
            phones: {
                leadPhone: phone,
                phoneLabel: phoneLabel?.toLowerCase(),
            },
            address: {
                address1: address1,
                address2: address2,
                city: city,
                stateCode: stateCode,
                postalCode: postalCode,
                county: county || "",
                countyFips: countyFips,
            },
            primaryCommunication: isPrimary,
            contactRecordType: contactRecordType?.toLowerCase(),
            emailID,
            leadAddressId,
            phoneId,
            leadStatusId,
            leadsId,
            notes,
            medicareBeneficiaryID: medicareBeneficiaryID ? formatMbiNumber(medicareBeneficiaryID) : "",
            partA: partA ?? "",
            partB: partB ?? "",
            ...formData,
        };
        const payload = {
            ...leadDetails,
            ...initialValues,
        };
        await updateLeadDetails(payload);
        setIsEditHealthInfo(false);
    };

    return (
        <>
            {isEditHealthInfo ? (
                <EditHealthInfo
                    birthdate={birthdate}
                    sexuality={gender}
                    wt={weight ? weight : ""}
                    hFeet={height ? Math.floor(height / 12) : ""}
                    hInch={height ? height % 12 : ""}
                    smoker={smoker}
                    modifyDate={modifyDate}
                    onSave={onSave}
                    onCancel={() => setIsEditHealthInfo(false)}
                    leadId={leadsId}
                />
            ) : (
                <ViewHealthInfo
                    birthdate={birthdate}
                    gender={gender}
                    weight={weight ? weight : ""}
                    height={height ? `${Math.floor(height / 12)}' ${height % 12}''` : ""}
                    smoker={smoker}
                    onEdit={() => setIsEditHealthInfo(true)}
                />
            )}
        </>
    );
};

export default HealthInfoContainer;
