import { useState, useMemo, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

import useFetch from "hooks/useFetch";
import WithLoader from "components/ui/WithLoader";
import { useLeadDetails } from "providers/ContactDetails";
import { formatDate } from "utils/dates";
import { formatMbiNumber } from "utils/shared-utils/sharedUtility";
import { CONFIRM_DETAILS_SUBTEXT, CONFIRM_DETAILS_TEXT, GET_COUNTIES } from "./AddZipContainer.constants";
import styles from "./AddZipContainer.module.scss";
import { getTransformedCounties } from "./AddZipContainer.utils";
import { ContinueCTA } from "./ContinueCTA/ContinueCTA";
import { CopyAddress } from "./CopyAddress/CopyAddress";
import { SelectCounty } from "./SelectCounty/SelectCounty";
import { ZipCodeInput } from "./ZipCodeInput/ZipCodeInput";

const AddZipContainer = ({ isMobile, contactId, quickQuoteModalCallBack = () => {}, pageName = "" }) => {
    const navigate = useNavigate();

    const { leadDetails, updateLeadDetails } = useLeadDetails();

    const {
        address1 = "",
        address2 = "",
        city = "",
        stateCode = "",
        postalCode = "",
    } = useMemo(() => leadDetails?.addresses?.[0] ?? {}, [leadDetails]);
    const address = useMemo(
        () => [address1, address2, city, stateCode].filter(Boolean).join(", "),
        [address1, address2, city, stateCode]
    );
    const [zipCode, setZipCode] = useState(postalCode);
    const [allCounties, setAllCounties] = useState([]);
    const [countyObj, setCountyObj] = useState({});
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [zipError, setZipError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const URL = `${GET_COUNTIES}${zipCode}`;
    const { Get: getCounties } = useFetch(URL);

    const handleContinue = async () => {
        const { countyFIPS, countyName, state } = countyObj;
        // const payload = getPayloadForUpdate(leadDetails, countyName, countyFIPS, state, zipCode);
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

        // Extract primary email and phone details with null checks
        const email = emails.length > 0 ? emails[0]?.leadEmail : null;
        const phoneData = phones.length > 0 ? phones[0] : null;
        const addressData = addresses.length > 0 ? addresses[0] : null;

        // Extract email ID and address ID with default values
        const emailID = emails.length > 0 ? emails[0]?.emailID : 0;
        const leadAddressId = addressData?.leadAddressId || 0;
        const phoneId = phoneData?.phoneId || 0;

        // Extract phone details with default values
        const phone = phoneData?.leadPhone || "";
        const phoneLabel = phoneData?.phoneLabel || "mobile";

        // Extract address details with default values
        const county = addressData?.county || "";
        const countyFips = addressData?.countyFips || "";

        // Extract primary contact preference with a default value
        const isPrimary = contactPreferences.primary || "email";

        const payload = {
            firstName: firstName,
            lastName: lastName,
            middleName: middleName,
            email: email,
            birthdate: leadDetails?.birthdate ? formatDate(leadDetails?.birthdate) : "",
            phones: {
                leadPhone: phone,
                phoneLabel: phoneLabel?.toLowerCase(),
            },
            address: {
                address1: address1,
                address2: address2,
                city: city,
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
        };

        const res = await updateLeadDetails(payload);
        if (res) {
            navigate(`/plans/${leadsId}`);
            quickQuoteModalCallBack && quickQuoteModalCallBack();
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
        [getCounties]
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
        <div
            className={
                isMobile
                    ? styles.detailsMContainer
                    : pageName === "Quick Quote"
                    ? styles.quickQuote
                    : styles.detailsDContainer
            }
        >
            <div className={styles.detailsTitle}>{CONFIRM_DETAILS_TEXT}</div>
            <div className={styles.detailsSubTitle}>{CONFIRM_DETAILS_SUBTEXT}</div>
            <ZipCodeInput handleZipCode={handleZipCode} zipError={zipError} />
            <WithLoader isLoading={isLoading}>
                {zipCode && allCounties.length > 0 && (
                    <SelectCounty counties={allCounties} isMobile={isMobile} onSelectCounty={onSelectCounty} />
                )}
                {address && <CopyAddress isMobile={isMobile} address={address} />}
                <ContinueCTA isMobile={isMobile} isDisabled={isSubmitDisabled} handleContinue={handleContinue} />
            </WithLoader>
        </div>
    );
};

AddZipContainer.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    contactId: PropTypes.string.isRequired,
};

export default AddZipContainer;
