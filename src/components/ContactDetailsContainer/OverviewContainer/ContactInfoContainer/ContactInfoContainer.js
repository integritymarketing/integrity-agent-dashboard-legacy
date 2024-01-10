import React, { useMemo, useState } from "react";

import { Box } from "@mui/system";

import { useLeadDetails } from "providers/ContactDetails";

import calculateAgeFromBirthdate from "utils/calculateAgeFromBirthdate";
import { formatDate, getLocalDateTime } from "utils/dates";
import { formatFullName } from "utils/formatFullName";
import { formatPhoneNumber } from "utils/phones";
import { formatMBID } from "utils/shared-utils/sharedUtility";

import WithLoader from "components/ui/WithLoader";

import styles from "./ContactInfoContainer.module.scss";
import ContactInfoForm from "./ContactInfoForm";

import Label from "../CommonComponents/Label";
import SectionContainer from "../CommonComponents/SectionContainer";
import { EditWithIcon, Favorite } from "../Icons";

const NOT_AVAILABLE = "-";

export const ContactInfoContainer = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const { leadDetails, updateLeadDetails, isLoadingLeadDetails } = useLeadDetails();

    let {
        firstName = "",
        middleName = "",
        lastName = "",
        birthdate,
        emails = [],
        phones = [],
        addresses = [],
        contactPreferences,
        medicareBeneficiaryID,
        partA,
        partB,
        hasMedicAid,
        contactRecordType,
        emailID,
        leadAddressId,
        phoneId,
        leadStatusId,
        leadsId,
        notes,
        createDate,
        gender,
        weight,
        height,
        isTobaccoUser,
        modifyDate,
    } = leadDetails;

    let phonesData = phones?.filter((phone) => {
        return phone?.leadPhone && phone?.leadPhone !== "" ? phone : null;
    });

    const leadPhone = useMemo(() => {
        return phonesData?.[0]?.leadPhone ? formatPhoneNumber(phonesData?.[0]?.leadPhone) : NOT_AVAILABLE;
    }, [phonesData]);

    const leadEmail = useMemo(() => {
        return emails?.length > 0 ? emails?.[0]?.leadEmail : NOT_AVAILABLE;
    }, [emails]);

    const leadAddress1 = useMemo(() => {
        const address1 = addresses?.[0]?.address1;
        return address1 ? address1 : NOT_AVAILABLE;
    }, [addresses]);

    const leadAddress2 = useMemo(() => {
        const address2 = addresses?.[0]?.address2;
        return address2 ? address2 : NOT_AVAILABLE;
    }, [addresses]);

    const leadCity = useMemo(() => {
        const city = addresses?.[0]?.city;
        return city ? city : NOT_AVAILABLE;
    }, [addresses]);

    const leadState = useMemo(() => {
        const state = addresses?.[0]?.state;
        return state ? state : NOT_AVAILABLE;
    }, [addresses]);

    const leadZip = useMemo(() => {
        const postalCode = addresses?.[0]?.postalCode;
        return postalCode ? postalCode : NOT_AVAILABLE;
    }, [addresses]);

    const leadMBID = useMemo(() => {
        return medicareBeneficiaryID ? formatMBID(medicareBeneficiaryID) : NOT_AVAILABLE;
    }, [medicareBeneficiaryID]);

    const leadPartA = useMemo(() => {
        return partA ? formatDate(partA, "MM/dd/yyyy") : NOT_AVAILABLE;
    }, [partA]);

    const leadPartB = useMemo(() => {
        return partB ? formatDate(partB, "MM/dd/yyyy") : NOT_AVAILABLE;
    }, [partB]);

    const leadAge = useMemo(() => {
        return birthdate ? calculateAgeFromBirthdate(birthdate) : NOT_AVAILABLE;
    }, [birthdate]);

    const leadBirthdate = useMemo(() => {
        return birthdate ? formatDate(birthdate, "MM/dd/yyyy") : NOT_AVAILABLE;
    }, [birthdate]);

    const leadCounty = useMemo(() => {
        return addresses?.length > 0 ? addresses?.[0]?.county : NOT_AVAILABLE;
    }, [addresses]);

    const leadCountyFips = useMemo(() => {
        return addresses?.length > 0 ? addresses?.[0]?.countyFips : NOT_AVAILABLE;
    }, [addresses]);

    const isPrimary = useMemo(() => {
        return contactPreferences?.primary ? contactPreferences?.primary : "phone";
    }, [contactPreferences]);

    const leadCreatedDate = useMemo(() => {
        return createDate ? getLocalDateTime(createDate)?.fullDate : NOT_AVAILABLE;
    }, [leadDetails]);

    const leadData = {
        firstName,
        middleName,
        lastName,
        birthdate,
        leadPhone,
        leadEmail,
        leadAddress1,
        leadAddress2,
        leadCity,
        leadState,
        leadZip,
        leadMBID: medicareBeneficiaryID,
        leadPartA,
        leadPartB,
        leadAge,
        leadBirthdate,
        leadCounty,
        leadCountyFips,
        isPrimary,
        hasMedicAid,
        contactRecordType: contactRecordType?.toLowerCase(),
        emailID,
        leadAddressId,
        phoneId,
        leadStatusId,
        leadsId,
        notes,
        leadCreatedDate,
    };

    const editLeadDetails = (data) => {
        const payload = {
            ...leadData,
            ...data,
            gender,
            weight,
            height,
            isTobaccoUser,
            modifyDate,
        };
        updateLeadDetails(payload);
        setIsEditMode(false);
    };

    return (
        <WithLoader isLoading={isLoadingLeadDetails}>
            <Box>
                <Box className={`${styles.horizontalLayout} ${styles.gap}`} marginBottom="-16px">
                    <Label value={isEditMode ? "Edit Contact Details" : "Contact Details"} />
                    {!isEditMode && (
                        <Box
                            className={styles.editIcon}
                            onClick={() => {
                                setIsEditMode(true);
                            }}
                        >
                            <EditWithIcon />
                        </Box>
                    )}
                </Box>
                {isEditMode && leadDetails && (
                    <ContactInfoForm
                        leadDetails={leadData}
                        editLeadDetails={editLeadDetails}
                        setIsEditMode={setIsEditMode}
                    />
                )}
                {!isEditMode && (
                    <Box>
                        <SectionContainer>
                            <Label value="Full Name" color="#717171" size="14px" />
                            <Label
                                value={formatFullName(firstName, middleName, lastName)}
                                color="#052A63"
                                size="20px"
                            />
                        </SectionContainer>
                        <Box className={styles.miniContainer}>
                            <SectionContainer>
                                <Label value="Birthdate" color="#717171" size="14px" />
                                <Label value={leadBirthdate} color="#052A63" size="20px" />
                            </SectionContainer>
                            <SectionContainer>
                                <Label value="Age" color="#717171" size="14px" />
                                <Label value={leadAge} color="#052A63" size="20px" />
                            </SectionContainer>
                        </Box>
                        <SectionContainer>
                            <Label value="Email" color="#717171" size="14px" />
                            <Box className={styles.horizontalLayout}>
                                <Box className={styles.emailAddress}>
                                    <Label value={leadEmail} color="#4178FF" size="16px" />
                                </Box>
                                {isPrimary === "email" && <Favorite />}
                            </Box>
                        </SectionContainer>
                        <SectionContainer>
                            <Label value="Phone" color="#717171" size="14px" />
                            <Box className={`${styles.horizontalLayout}   ${styles.gap}`}>
                                <Box className={styles.horizontalLayout}>
                                    <Label value="Home:" color="#052A63" size="16px" />
                                    <Label value={leadPhone} color="#4178FF" size="16px" />
                                </Box>
                                {isPrimary === "phone" && <Favorite />}
                            </Box>
                        </SectionContainer>
                        <SectionContainer>
                            <Label value="Address" color="#717171" size="14px" />
                            <Label value={leadAddress1} color="#4178FF" size="16px" />
                            <Label value={`${leadCity} ${leadState} ${leadZip}`} color="#4178FF" size="16px" />
                            <Box className={styles.horizontalLayout}>
                                <Label value="County:" color="#052A63" size="16px" />
                                <Label value={leadCounty} color="#717171" size="16px" />
                            </Box>
                        </SectionContainer>
                        <SectionContainer>
                            <Label value="Medicare Beneficiary Identifier (MBIs)" color="#717171" size="14px" />
                            <Label value={leadMBID} color="#052A63" size="16px" />
                            <Box className={`${styles.horizontalLayout} ${styles.gap}`}>
                                <Box>
                                    <Label value="Part A start date" color="#717171" size="14px" />
                                    <Label value={leadPartA} color="#052A63" size="16px" />
                                </Box>
                                <Box>
                                    <Label value="Part B start date" color="#717171" size="14px" />
                                    <Label value={leadPartB} color="#052A63" size="16px" />
                                </Box>
                            </Box>
                        </SectionContainer>
                        <SectionContainer>
                            <Label value="Medicaid" color="#717171" size="14px" />
                            <Label value={hasMedicAid ? "Yes" : "No"} color="#052A63" size="16px" />
                        </SectionContainer>
                        <Box display="flex" alignItems="center" justifyContent="center" marginTop="10px">
                            <Label value={`Created Date: ${leadCreatedDate}`} color="#717171" size="14px" />
                        </Box>
                    </Box>
                )}
            </Box>
        </WithLoader>
    );
};
