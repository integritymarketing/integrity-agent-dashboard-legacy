import { useState, useMemo, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

import useFetch from "hooks/useFetch";
import WithLoader from "components/ui/WithLoader";
import useContactDetails from "pages/ContactDetails/useContactDetails";
import {
    CONFIRM_DETAILS_SUBTEXT,
    CONFIRM_DETAILS_TEXT,
    GET_COUNTIES,
    UPDATE_LEAD_DETAILS,
} from "./AddZipContainer.constants";
import styles from "./AddZipContainer.module.scss";
import { getPayloadForUpdate, getTransformedCounties } from "./AddZipContainer.utils";
import { ContinueCTA } from "./ContinueCTA/ContinueCTA";
import { CopyAddress } from "./CopyAddress/CopyAddress";
import { SelectCounty } from "./SelectCounty/SelectCounty";
import { ZipCodeInput } from "./ZipCodeInput/ZipCodeInput";

const AddZipContainer = ({ isMobile, contactId }) => {
    const navigate = useNavigate();
    const { getLeadDetails, leadDetails } = useContactDetails(contactId);
    const {
        address1 = "",
        address2 = "",
        city = "",
        stateCode = "",
        postalCode = "",
    } = useMemo(() => leadDetails.addresses?.[0] ?? {}, [leadDetails]);
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
    const { Put: updateLeadData } = useFetch(`${UPDATE_LEAD_DETAILS}${contactId}`);

    const handleContinue = async () => {
        const { countyFIPS, countyName, state } = countyObj;
        const payload = getPayloadForUpdate(leadDetails, countyName, countyFIPS, state, zipCode);
        await updateLeadData(payload);
        getLeadDetails();
        navigate(`/plans/${contactId}`);
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
        <div className={isMobile ? styles.detailsMContainer : styles.detailsDContainer}>
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
