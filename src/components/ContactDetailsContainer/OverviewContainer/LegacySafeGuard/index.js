import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { Button } from "components/ui/Button";
import styles from "./styles.module.scss";
import LegacySafeGuardCardImage from "images/LegacySafeGuardCard.png";
import { Arrow } from "../Icons";
import { formatDate } from "utils/dates";
import useUserProfile from "hooks/useUserProfile";

const LegacySafeGuard = ({
    leadDetails: { firstName, lastName, birthdate, emails, phones, addresses, gender, leadsId, leadTags },
}) => {
    const { npn: userNPN } = useUserProfile();

    const leadPhone = useMemo(() => phones?.[0]?.leadPhone || "", [phones]);
    const leadEmail = useMemo(() => emails?.[0]?.leadEmail || "", [emails]);
    const leadAddress = useMemo(() => addresses?.[0]?.address1?.replace(/ /g, "%20") || "", [addresses]);
    const leadCity = useMemo(() => addresses?.[0]?.city || "", [addresses]);
    const leadState = useMemo(() => addresses?.[0]?.state || "", [addresses]);
    const leadZip = useMemo(() => addresses?.[0]?.postalCode || "", [addresses]);
    const formattedBirthdate = useMemo(() => (birthdate ? formatDate(birthdate) : ""), [birthdate]);
    const formattedGender = useMemo(() => (gender === "Male" ? "M" : gender === "Female" ? "F" : ""), [gender]);
    const isLSGTagPresent = useMemo(() => leadTags?.some((tag) => tag?.tag?.tagLabel === "LS USER"), [leadTags]);

    const constructLegacySafeGuardUrl = () => {
        const legacySafeGuardQueryParams = new URLSearchParams({
            ...(userNPN && { npn: userNPN }),
            ...(leadsId && { leadid: leadsId }),
            ...(firstName && { mc_fn: firstName }),
            ...(lastName && { mc_ln: lastName }),
            ...(leadAddress && { mc_address: leadAddress }),
            ...(leadCity && { mc_city: leadCity }),
            ...(leadZip && { mc_zip: leadZip }),
            ...(leadState && { mc_state: leadState }),
            ...(leadPhone && { mc_phone: leadPhone }),
            ...(leadEmail && { mc_email: `%20${leadEmail}%20` }),
            ...(formattedGender && { gender: formattedGender }),
            ...(formattedBirthdate && { mc_dob: formattedBirthdate }),
        }).toString();

        return `http://legacysafeguard.com/?${legacySafeGuardQueryParams}`;
    };

    const handleCardClick = () => {
        if (!userNPN || !leadsId) {
            return;
        }

        const url = constructLegacySafeGuardUrl();
        window.open(url, "_blank");
    };

    if (isLSGTagPresent) {
        return null;
    }

    return (
        <Box className={styles.legacySafeGuardCardContainer}>
            <Box className={styles.legacySafeGuardCard}>
                <Box className={styles.legacySafeGuardCardImage}>
                    <Box component="img" alt="Legacy Safe Guard Card" src={LegacySafeGuardCardImage} />
                </Box>
                <Box className={styles.legacySafeGuardCardContent}>
                    <div className={styles.legacySafeGuardCardTitle}>
                        <strong>Eligible for a</strong>
                    </div>
                    <div className={styles.legacySafeGuardCardTitle}>
                        <strong>FREE MEMBERSHIP</strong>
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
    }),
};

LegacySafeGuard.defaultProps = {
    leadDetails: {},
};

export default LegacySafeGuard;
