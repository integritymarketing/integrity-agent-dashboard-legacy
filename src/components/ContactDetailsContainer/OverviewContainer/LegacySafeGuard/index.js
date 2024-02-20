import React, { useMemo } from "react";
import PropTypes from "prop-types";
import moment from 'moment';
import Box from "@mui/material/Box";
import { Button } from "components/ui/Button";
import styles from "./styles.module.scss";
import LegacySafeGuardCardImage from "images/LegacySafeGuardCard.png";
import { Arrow } from "../Icons";
import useUserProfile from "hooks/useUserProfile";
import useAgentInformationByID from "hooks/useAgentInformationByID";

/**
 * Component to render Legacy SafeGuard card with eligibility check and redirection functionality.
 * @param {Object} props Component props
 * @param {Object} props.leadDetails Details of the lead
 */
const LegacySafeGuard = ({ leadDetails }) => {
    const { npn: userNpn } = useUserProfile();
    const { agentInformation } = useAgentInformationByID();
    const {
        firstName,
        lastName,
        birthdate,
        emails,
        phones,
        addresses,
        gender,
        leadsId,
        leadTags,
    } = leadDetails;

    const agentFirstName = useMemo(() => agentInformation?.agentFirstName || "", [agentInformation]);
    const agentLastName = useMemo(() => agentInformation?.agentLastName || "", [agentInformation]);
    const agentPhone = useMemo(() => agentInformation?.phone || "", [agentInformation]);
    const agentEmail = useMemo(() => agentInformation?.email || "", [agentInformation]);
    const leadPhones = useMemo(() => phones?.[0]?.leadPhone || "", [phones]);
    const leadEmail = useMemo(() => emails?.[0]?.leadEmail || '', [emails]);
    const leadAddress = useMemo(() => addresses?.[0]?.address1 || '', [addresses]);
    const leadCity = useMemo(() => addresses?.[0]?.city || "", [addresses]);
    const leadState = useMemo(() => addresses?.[0]?.state || "", [addresses]);
    const leadZip = useMemo(() => addresses?.[0]?.postalCode || "", [addresses]);
    const formattedBirthdate = useMemo(() => (birthdate ? moment(birthdate).format('MM-DD-YYYY') : ""), [birthdate]);
    const formattedGender = useMemo(() => (gender === "male" ? "M" : gender === "female" ? "F" : ""), [gender]);
    const isLSGTagPresent = useMemo(() => leadTags?.some((tag) => tag?.tag?.tagLabel === "LS USER"), [leadTags]);

    /**
     * Constructs the URL for Legacy SafeGuard with query parameters based on lead details.
     * @returns {string} URL for Legacy SafeGuard
     */
    const constructLegacySafeGuardUrl = () => {
        const queryParams = new URLSearchParams({
            ...(userNpn && { npn: userNpn }),
            ...(leadsId && { leadid: leadsId }),
            ...(firstName && { mc_fn: firstName }),
            ...(lastName && { mc_ln: lastName }),
            ...(leadAddress && { mc_address: leadAddress }),
            ...(leadCity && { mc_city: leadCity }),
            ...(leadZip && { mc_zip: leadZip }),
            ...(leadState && { mc_state: leadState }),
            ...(leadEmail && { mc_email: leadEmail }),
            ...(leadPhones && { mc_phone: leadPhones }),
            ...(formattedGender && { gender: formattedGender }),
            ...(formattedBirthdate && { mc_dob: formattedBirthdate }),
            ...(agentFirstName && { agent_fname: agentFirstName }),
            ...(agentLastName && { agent_lname: agentLastName }),
            ...(agentPhone && { agent_phone: agentPhone }),
            ...(agentEmail && { agent_email: agentEmail })
        }).toString();

        return `https://legacysafeguarduniversity.com/enrollment-form/?${queryParams}`;
    };

    /**
     * Handles click on the card, redirecting to the constructed URL.
     */
    const handleCardClick = () => {
        if (!userNpn || !leadsId) { return; }

        const url = constructLegacySafeGuardUrl();
        window.open(url, "_blank");
    };

    // Render nothing if the LS USER tag is present
    if (isLSGTagPresent) { return null; }

    return (
        <Box className={styles.legacySafeGuardCardContainer}>
            <Box className={styles.legacySafeGuardCard}>
                <Box className={styles.legacySafeGuardCardImage}>
                    <img alt="Legacy Safe Guard Card" src={LegacySafeGuardCardImage} />
                </Box>
                <Box className={styles.legacySafeGuardCardContent}>
                    <div className={styles.legacySafeGuardCardTitle}>
                        <strong>Eligible for a FREE MEMBERSHIP</strong>
                    </div>
                    <Button
                        icon={<Arrow />}
                        label="Sign Up"
                        className={styles.buttonWithIcon}
                        onClick={handleCardClick}
                        type="tertiary"
                        iconPosition="right"
                    />
                </Box>
            </Box>
        </Box>
    );
};

LegacySafeGuard.propTypes = {
    leadDetails: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        birthdate: PropTypes.string,
        emails: PropTypes.arrayOf(
            PropTypes.shape({
                leadEmail: PropTypes.string,
            })
        ),
        phones: PropTypes.arrayOf(
            PropTypes.shape({
                leadPhone: PropTypes.string,
            })
        ),
        addresses: PropTypes.arrayOf(
            PropTypes.shape({
                address1: PropTypes.string,
                city: PropTypes.string,
                state: PropTypes.string,
                postalCode: PropTypes.string,
            })
        ),
        gender: PropTypes.string,
        leadsId: PropTypes.string,
        leadTags: PropTypes.arrayOf(
            PropTypes.shape({
                tagLabel: PropTypes.string,
            })
        ),
    }),
};

LegacySafeGuard.defaultProps = {
    leadDetails: {},
};

export default LegacySafeGuard;
