import React, { useCallback, useState } from "react";
import { debounce } from "debounce";
import useFetch from "hooks/useFetch";
import PropTypes from "prop-types";
import styles from "./AddZipContainer.module.scss";
import useContactDetails from "pages/ContactDetails/useContactDetails";
import { getPayloadForUpdate, getTransformedCounties } from "./AddZipContainer.utils";
import { useNavigate } from "react-router-dom";
import { CONFIRM_DETAILS_SUBTEXT, CONFIRM_DETAILS_TEXT, GET_COUNTIES, UPDATE_LEAD_DETAILS } from "./AddZipContainer.constants";
import { ZipCodeInput } from "./ZipCodeInput/ZipCodeInput";
import { SelectCounty } from "./SelectCounty/SelectCounty";
import { CopyAddress } from "./CopyAddress/CopyAddress";
import { ContinueCTA } from "./ContinueCTA/ContinueCTA";

const AddZipContainer = ({
    isMobile,
    contactId
}) => {
    const { getLeadDetails, leadDetails } = useContactDetails(contactId);
    const { address1 = "", address2 = "", city = "", stateCode = "", postalCode = "" } = leadDetails.addresses?.[0] ?? {};
    const address = [address1, address2, city, stateCode].filter(Boolean).join(", ");
    const [zipCode, setZipCode] = useState(postalCode);
    const [allCounties, setAllCounties] = useState([]);
    const [countyObj, setCountyObj] = useState({})
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [zipError, setZipError] = useState(false);
    const navigate = useNavigate();

    const { Get: getCounties } = useFetch(`${GET_COUNTIES}${zipCode}`);
    const { Put: updateLeadData } = useFetch(`${UPDATE_LEAD_DETAILS}${contactId}`)

    const handleContinue = async () => {
        const { countyFIPS, countyName, state } = countyObj;
        const payload = getPayloadForUpdate(leadDetails, countyName, countyFIPS, state, zipCode)
        await updateLeadData(payload)
        getLeadDetails();
        navigate(`/plans/${contactId}`);

    };


    const fetchCounties = async (zipcode) => {
        if (zipcode) {
            const counties = await getCounties(undefined, false, '', zipcode);
            if (counties?.length === 1) {
                setIsSubmitDisabled(false);
                setCountyObj(...counties);
                setAllCounties([]);
                setZipError(false);
            } else if (counties?.length > 1) {
                const countiesList = getTransformedCounties(counties);
                setAllCounties(countiesList || []);
                setZipError(false);
            } else {
                setIsSubmitDisabled(true);
                setZipError(true);
                setAllCounties([]);
            }
        }
    };

    const debounceZipFn = useCallback(debounce(fetchCounties, 1000), []);

    const onSelectCounty = (county) => {
        const { key, value, state } = county;
        setCountyObj({ countyFIPS: key, countyName: value, state });
        setIsSubmitDisabled(false);
    };

    const handleZipCode = (zipcode) => {
        if (zipcode) {
            setZipCode(zipcode);
            debounceZipFn(zipcode);
        } else {
            setIsSubmitDisabled(true);
        }

    };

    return (
        <div className={isMobile ? styles.detailsMContainer : styles.detailsDContainer}>
            <div className={styles.detailsTitle}>{CONFIRM_DETAILS_TEXT}</div>
            <div className={styles.detailsSubTitle}>{CONFIRM_DETAILS_SUBTEXT}</div>
            <ZipCodeInput handleZipCode={handleZipCode} zipError={zipError} />
            {zipCode && allCounties.length > 0 && <SelectCounty counties={allCounties} isMobile={isMobile} onSelectCounty={onSelectCounty} />}
            {address && <CopyAddress isMobile={isMobile} address={address} />}
            <ContinueCTA isMobile={isMobile} isDisabled={isSubmitDisabled} handleContinue={handleContinue} />
        </div >
    )
}

AddZipContainer.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    contactId: PropTypes.string.isRequired,
};

export default AddZipContainer;