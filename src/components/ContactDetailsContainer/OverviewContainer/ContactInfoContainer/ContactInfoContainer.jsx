import React, { useMemo, useState } from "react";
import { Box } from "@mui/system";
import { useLeadDetails } from "providers/ContactDetails";
import calculateAgeFromBirthdate from "utils/calculateAgeFromBirthdate";
import { formatDate, getLocalDateTime } from "utils/dates";
import { formatFullName } from "utils/formatFullName";
import { formatPhoneNumber } from "utils/phones";
import { formatAddress } from "utils/addressFormatter";
import { formatMBID } from "utils/shared-utils/sharedUtility";
import WithLoader from "components/ui/WithLoader";
import styles from "./ContactInfoContainer.module.scss";
import ContactInfoForm from "./ContactInfoForm";
import Label from "../CommonComponents/Label";
import SectionContainer from "../CommonComponents/SectionContainer";
import { EditWithIcon, Favorite } from "../Icons";
import { Hide } from "../Icons/Hide";
import { Show } from "../Icons/Show";
import ArrowDownBig from "components/icons/version-2/ArrowDownBig";
import { Paper, Stack, Typography } from "@mui/material";

const NOT_AVAILABLE = "-";

export const ContactInfoContainer = ({ isMobile }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const { leadDetails, updateLeadDetails, isLoadingLeadDetails } = useLeadDetails();
    const [isShowBeneficiaryId, setShowBeneficiaryId] = useState(false);
    const [isCollapsed, setCollapsed] = useState(false);

    const handleToggle = () => {
        setCollapsed(!isCollapsed);
    };

    const {
        firstName = "",
        middleName = "",
        lastName = "",
        suffix = "",
        prefix = "",
        maritalStatus = "",
        birthdate,
        emails = [],
        phones = [],
        addresses = [],
        contactPreferences,
        medicareBeneficiaryID,
        partA,
        partB,
        hasMedicAid,
        subsidyLevel,
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
        consumerId,
    } = leadDetails;

    const phonesData = phones?.filter((phone) => {
        return phone?.leadPhone && phone?.leadPhone !== "" ? phone : null;
    });

    const leadPhone = useMemo(() => {
        return phonesData?.[0]?.leadPhone ? formatPhoneNumber(phonesData?.[0]?.leadPhone) : "";
    }, [phonesData]);

    const leadEmail = useMemo(() => {
        return emails?.length > 0 ? emails?.[0]?.leadEmail : "";
    }, [emails]);

    const leadAddress1 = useMemo(() => {
        const address1 = addresses?.[0]?.address1;
        return address1 ? address1 : "";
    }, [addresses]);

    const leadAddress2 = useMemo(() => {
        const address2 = addresses?.[0]?.address2;
        return address2 ? address2 : "";
    }, [addresses]);

    const leadCity = useMemo(() => {
        const city = addresses?.[0]?.city;
        return city ? city : "";
    }, [addresses]);

    const leadState = useMemo(() => {
        const state = addresses?.[0]?.stateCode;
        return state ? state : "";
    }, [addresses]);

    const leadZip = useMemo(() => {
        const postalCode = addresses?.[0]?.postalCode;
        return postalCode ? postalCode : "";
    }, [addresses]);

    const leadMBID = useMemo(() => {
        return medicareBeneficiaryID ? formatMBID(medicareBeneficiaryID) : NOT_AVAILABLE;
    }, [medicareBeneficiaryID]);

    const leadMBIDFull = useMemo(() => {
        return medicareBeneficiaryID ? formatMBID(medicareBeneficiaryID, true) : NOT_AVAILABLE;
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
        suffix,
        prefix,
        maritalStatus,
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
        subsidyLevel,
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
            hasMedicAid: data.hasMedicAid != null ? Number(data.hasMedicAid) : null,
            consumerId,
        };
        updateLeadDetails(payload);
        setIsEditMode(false);
    };

    return (
        <WithLoader isLoading={isLoadingLeadDetails}>
            <Box marginTop={"20px"}>
                <Box
                    className={`${styles.horizontalLayout} ${styles.gap}  ${isCollapsed ? styles.underLine : ""} `}
                    marginBottom="16px"
                >
                    <Box className={styles.iconWithTitle}>
                        {isMobile && (
                            <div
                                className={`${styles.icon} ${isCollapsed ? styles.iconRotate : ""}`}
                                onClick={handleToggle}
                            >
                                <ArrowDownBig />
                            </div>
                        )}
                        <Label value={isEditMode ? "Edit Contact Details" : "Contact Details"} />
                    </Box>
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
                {isEditMode && leadDetails && (!isCollapsed || !isMobile) && (
                    <ContactInfoForm
                        leadDetails={leadData}
                        editLeadDetails={editLeadDetails}
                        setIsEditMode={setIsEditMode}
                    />
                )}
                {!isEditMode && (!isCollapsed || !isMobile) && (
                    <Box>
                        <SectionContainer>
                            <Label value="Full Name" color="#717171" size="14px" />
                            <Label
                                value={formatFullName({ prefix, firstName, middleName, lastName, suffix })}
                                color="#052A63"
                                size="20px"
                            />

                            <Box sx={{ pt: 2 }}>
                                <Label value="Marital Status" color="#717171" size="14px" />
                                <Label value={maritalStatus || "Unknown"} color="#052A63" size="20px" />
                            </Box>

                        </SectionContainer>

                        <Box className={styles.miniContainer}>
                            <Box className={styles.miniCard}>
                                <SectionContainer>
                                    <Label value="Birthdate" color="#717171" size="14px" />
                                    <Label value={leadBirthdate} color="#052A63" size="20px" />
                                </SectionContainer>
                            </Box>
                            <Box className={styles.miniCard}>
                                <SectionContainer>
                                    <Label value="Age" color="#717171" size="14px" />
                                    <Label value={leadAge} color="#052A63" size="20px" />
                                </SectionContainer>
                            </Box>
                        </Box>
                        <SectionContainer>
                            <Label value="Email" color="#717171" size="14px" />
                            <Box className={styles.emailBox}>
                                <Box className={styles.emailAddress}>
                                    <Box className={styles.emailText}>
                                        <Label value={leadEmail} color="#4178FF" size="16px" />
                                    </Box>
                                    {isPrimary === "email" && <Favorite />}
                                </Box>
                            </Box>
                        </SectionContainer>
                        <SectionContainer>
                            <Label value="Phone" color="#717171" size="14px" />
                            <Box className={`${styles.horizontalLayout}   ${styles.gap}`}>
                                <Box className={styles.horizontalLayout}>
                                    <Label value="Home:" color="#052A63" size="16px" />
                                    <Label value={` ${leadPhone}`} color="#4178FF" size="16px" />
                                </Box>
                                {isPrimary === "phone" && <Favorite />}
                            </Box>
                        </SectionContainer>
                        <SectionContainer>
                            <Label value="Address" color="#717171" size="14px" />
                            <Label
                                value={formatAddress({
                                    address1: leadAddress1,
                                    address2: leadAddress2,
                                    city: leadCity,
                                    stateCode: leadState,
                                    postalCode: leadZip,
                                })}
                                color="#4178FF"
                                size="16px"
                            />
                            <Box className={styles.horizontalLayout}>
                                <Label value="County: " color="#052A63" size="16px" />
                                <Label value={leadCounty} color="#717171" size="16px" left={"5px"} />
                            </Box>
                        </SectionContainer>
                        <SectionContainer>
                            <Label value="Medicare Beneficiary Identifier (MBI)" color="#717171" size="14px" />
                            <div className={styles.beneficiaryId}>
                                <Label
                                    value={isShowBeneficiaryId ? leadMBIDFull : leadMBID}
                                    color="#052A63"
                                    size="16px"
                                />
                                <span onClick={() => setShowBeneficiaryId(!isShowBeneficiaryId)}>
                                    {isShowBeneficiaryId ? <Hide /> : <Show />}
                                    {isShowBeneficiaryId ? "Hide" : "Show"}
                                </span>
                            </div>
                            <Box className={`${styles.horizontalLayout} ${styles.dateAlignment}`}>
                                <Box>
                                    <Label value="Part A start date" color="#717171" size="14px" />
                                    <Label value={leadPartA} color="#052A63" size="16px" />
                                </Box>
                                <Box className={styles.miniCard}>
                                    <Label value="Part B start date" color="#717171" size="14px" />
                                    <Label value={leadPartB} color="#052A63" size="16px" />
                                </Box>
                            </Box>
                        </SectionContainer>
                        <SectionContainer>
                            <Paper className={styles.specialAssistanceCard} elevation="0">
                                <Stack className={styles.specialAssistanceContainer} direction="row">
                                    <Typography className={styles.specialAssistanceHeader} variant="custom">
                                        Special Assistance
                                    </Typography>
                                    {subsidyLevel === "Yes" && (
                                        <Typography variant="body1" color="#434A51">
                                            LIS
                                        </Typography>
                                    )}
                                    {hasMedicAid === 1 && (
                                        <Typography variant="body1" color="#434A51">
                                            Medicaid
                                        </Typography>
                                    )}
                                    {subsidyLevel !== "Yes" && hasMedicAid !== 1 && (
                                        <Typography variant="body1" color="#434A51">
                                            None
                                        </Typography>
                                    )}
                                </Stack>
                            </Paper>
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
