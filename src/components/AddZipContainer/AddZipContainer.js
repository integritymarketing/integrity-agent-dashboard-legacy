import { useState, useMemo, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

import useFetch from "hooks/useFetch";
import WithLoader from "components/ui/WithLoader";
import { useLeadDetails } from "providers/ContactDetails";
import { formatDate } from "utils/dates";
import { formatMbiNumber } from "utils/shared-utils/sharedUtility";
import {
    MEDICARE_ADVANTAGE,
    CONFIRM_DETAILS_SUBTEXT,
    CONFIRM_DETAILS_TEXT,
    GET_COUNTIES,
} from "./AddZipContainer.constants";
import styles from "./AddZipContainer.module.scss";
import { getTransformedCounties } from "./AddZipContainer.utils";
import { ContinueCTA } from "./ContinueCTA/ContinueCTA";
import { CopyAddress } from "./CopyAddress/CopyAddress";
import { SelectCounty } from "./SelectCounty/SelectCounty";
import { ZipCodeInput } from "./ZipCodeInput/ZipCodeInput";
import { Box, Button, Typography } from "@mui/material";
import ButtonCircleArrow from "components/icons/button-circle-arrow";
import { ContactProfileTabBar } from "components/ContactDetailsContainer";

const AddZipContainer = ({ isMobile, contactId, quickQuoteModalCallBack = () => { }, pageName = "" }) => {
    const navigate = useNavigate();
    const { leadDetails, updateLeadDetails, getLeadDetails } = useLeadDetails();

    const {
        address1 = "",
        address2 = "",
        city = "",
        stateCode = "",
        postalCode = "",
    } = useMemo(() => leadDetails?.addresses?.[0] ?? {}, [leadDetails]);

    useEffect(() => {
        if (!leadDetails && contactId) {
            getLeadDetails(contactId);
        }
    }, [contactId, getLeadDetails, leadDetails]);

    const address = useMemo(
        () => [address1, address2, city, stateCode].filter(Boolean).join(", "),
        [address1, address2, city, stateCode],
    );

    const [zipCode, setZipCode] = useState(postalCode);
    const [allCounties, setAllCounties] = useState([]);
    const [countyObj, setCountyObj] = useState({});
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [zipError, setZipError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setZipCode(postalCode);
    }, [postalCode]);

    const URL = `${GET_COUNTIES}${zipCode}`;
    const { Get: getCounties } = useFetch(URL);

    const handleContinue = async () => {
        const { countyFIPS, countyName, state } = countyObj;
        const {
            emails = [],
            phones = [],
            firstName = "",
            lastName = "",
            middleName = "",
            leadsId = 0,
            contactRecordType = "",
            leadStatusId = 0,
            notes = "",
            medicareBeneficiaryID = "",
            partA = false,
            partB = false,
            addresses = [],
            contactPreferences = {},
        } = leadDetails || {};

        const email = emails.length > 0 ? emails[0]?.leadEmail : null;
        const phoneData = phones.length > 0 ? phones[0] : null;
        const addressData = addresses.length > 0 ? addresses[0] : null;

        const emailID = emails.length > 0 ? emails[0]?.emailID : 0;
        const leadAddressId = addressData?.leadAddressId || 0;
        const phoneId = phoneData?.phoneId || 0;

        const phone = phoneData?.leadPhone || "";
        const phoneLabel = phoneData?.phoneLabel || "mobile";

        const county = addressData?.county || "";
        const countyFips = addressData?.countyFips || "";

        const isPrimary = contactPreferences.primary || "email";

        const payload = {
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
                stateCode: state ? state : stateCode,
                postalCode: zipCode ? zipCode : postalCode,
                county: countyName ? countyName : county,
                countyFips: countyFIPS ? countyFIPS : countyFips,
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
            height: leadDetails?.height,
            weight: leadDetails?.weight,
            isTobaccoUser: leadDetails?.isTobaccoUser,
            gender: leadDetails?.gender,
        };
        const res = await updateLeadDetails(payload);
        if (res) {
            navigate(`/plans/${leadsId}`);
            quickQuoteModalCallBack?.();
        }
    };

    const fetchCounties = useCallback(
        async (zipcode) => {
            if (zipcode) {
                setIsLoading(true);
                const counties = await getCounties();
                setIsLoading(false);
                if (counties?.length === 1) {
                    setCountyObj(...counties);
                    setAllCounties([]);
                    setIsSubmitDisabled(false);
                    setZipError(false);
                } else if (counties?.length > 1) {
                    setAllCounties(getTransformedCounties(counties) || []);
                    setIsSubmitDisabled(true);
                    setZipError(false);
                } else {
                    setAllCounties([]);
                    setIsSubmitDisabled(true);
                    setZipError(true);
                }
            }
        },
        [getCounties],
    );

    const debounceZipFn = debounce((zipcode) => setZipCode(zipcode), 1000);

    const onSelectCounty = (county) => {
        const { key, value, state } = county;
        setCountyObj({ countyFIPS: key, countyName: value, state });
        setIsSubmitDisabled(false);
    };

    const handleZipCode = (zipcode) => {
        if (zipcode) {
            debounceZipFn(zipcode);
        } else {
            setIsSubmitDisabled(true);
        }
    };

    useEffect(() => {
        if (zipCode) {
            fetchCounties(zipCode);
        }
    }, [fetchCounties, zipCode]);

    return (
        <>
            {pageName !== "Quick Quote" && (
                <ContactProfileTabBar contactId={contactId} showTabs={false} backButtonLabel={"Back"} />
            )}
            <div className={styles.addZipContainer}>
                <Box sx={{ pb: 3 }} display={"flex"} justifyContent={"center"}>
                    <Typography variant="h2" gutterBottom color={"#052a63"}>
                        {MEDICARE_ADVANTAGE}
                    </Typography>
                </Box>
                <div
                    className={
                        pageName === "Quick Quote"
                            ? styles.quickQuote
                            : isMobile
                                ? styles.detailsMContainer
                                : styles.detailsDContainer
                    }
                >
                    <div className={styles.detailsTitle}>{CONFIRM_DETAILS_TEXT}</div>
                    <div className={styles.detailsSubTitle}>{CONFIRM_DETAILS_SUBTEXT}</div>
                    <ZipCodeInput defaultValue={zipCode} handleZipCode={handleZipCode} zipError={zipError} />
                    <WithLoader isLoading={isLoading}>
                        {zipCode && allCounties.length > 0 && (
                            <SelectCounty counties={allCounties} isMobile={isMobile} onSelectCounty={onSelectCounty} />
                        )}
                        {address && <CopyAddress isMobile={isMobile} address={address} />}
                        {pageName !== "Quick Quote" && (
                            <ContinueCTA
                                isMobile={isMobile}
                                isDisabled={isSubmitDisabled}
                                handleContinue={handleContinue}
                            />
                        )}
                    </WithLoader>
                </div>
            </div>
            {pageName === "Quick Quote" && (
                <Box className={styles.submitButtonContainer}>
                    <Button
                        onClick={handleContinue}
                        size="medium"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitDisabled}
                        endIcon={<ButtonCircleArrow />}
                    >
                        Continue
                    </Button>
                </Box>
            )}
        </>
    );
};

AddZipContainer.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    contactId: PropTypes.string.isRequired,
    quickQuoteModalCallBack: PropTypes.func,
    pageName: PropTypes.string,
};

export default AddZipContainer;
