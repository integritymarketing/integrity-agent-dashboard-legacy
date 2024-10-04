import React, { useMemo } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Grid, Stack, Typography, Button, useMediaQuery, useTheme, Box } from "@mui/material";
import styles from "./styles.module.scss";
import LegacySafeGuardCardImage from "images/Campaigns/legacy-safeguard.png";
import ArrowForwardWithCircle from "components/icons/version-2/ArrowForwardWithCircle";
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
    const { firstName, lastName, birthdate, emails, phones, addresses, gender, leadsId, leadTags } = leadDetails;

    const agentFirstName = useMemo(() => agentInformation?.agentFirstName || "", [agentInformation]);
    const agentLastName = useMemo(() => agentInformation?.agentLastName || "", [agentInformation]);
    const agentPhone = useMemo(() => agentInformation?.phone || "", [agentInformation]);
    const agentEmail = useMemo(() => agentInformation?.email || "", [agentInformation]);
    const leadPhones = useMemo(() => phones?.[0]?.leadPhone || "", [phones]);
    const leadEmail = useMemo(() => emails?.[0]?.leadEmail || "", [emails]);
    const leadAddress = useMemo(() => addresses?.[0]?.address1 || "", [addresses]);
    const leadCity = useMemo(() => addresses?.[0]?.city || "", [addresses]);
    const leadState = useMemo(() => addresses?.[0]?.state || "", [addresses]);
    const leadZip = useMemo(() => addresses?.[0]?.postalCode || "", [addresses]);
    const formattedBirthdate = useMemo(() => (birthdate ? moment(birthdate).format("MM-DD-YYYY") : ""), [birthdate]);
    const isLSGTagPresent = useMemo(() => leadTags?.some((tag) => tag?.tag?.tagLabel === "LS USER"), [leadTags]);

    const formattedDetails = useMemo(
        () => ({
            birthdate: birthdate ? moment(birthdate).format("MM-DD-YYYY") : "",
            gender: gender === "male" ? "M" : gender === "female" ? "F" : "",
        }),
        [birthdate, gender]
    );
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
            ...(formattedDetails.gender && { mc_gender: formattedDetails.gender }),
            ...(formattedBirthdate && { mc_dob: formattedBirthdate }),
            ...(agentFirstName && { agent_fname: agentFirstName }),
            ...(agentLastName && { agent_lname: agentLastName }),
            ...(agentPhone && { agent_phone: agentPhone }),
            ...(agentEmail && { agent_email: agentEmail }),
        }).toString();

        return `https://legacysafeguarduniversity.com/enrollment-form/?${queryParams}`;
    };

    /**
     * Handles click on the card, redirecting to the constructed URL.
     */
    const handleCardClick = () => {
        if (!userNpn || !leadsId) {
            return;
        }

        const url = constructLegacySafeGuardUrl();
        window.open(url, "_blank");
    };

    // Render nothing if the LS USER tag is present
    if (isLSGTagPresent) {
        return null;
    }

    return (
        <Grid container className={styles.marketingBanner}>
            <Grid item md={5} xs={5}>
                <img alt="Legacy Safe Guard Card" className={styles.bannerCardImage} src={LegacySafeGuardCardImage} />
            </Grid>
            <Grid item md={7} xs={7} className={styles.bannerGridItem}>
                <Stack direction="column" spacing={1} alignItems={"center"}>
                    <Typography variant="h4" sx={{ color: "#052A63", fontSize: "20px", fontWeight: "700" }}>
                        Eligible for a FREE
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#052A63",
                            fontSize: "20px",
                            fontWeight: "700",
                        }}
                    >
                        {" "}
                        Membership
                    </Typography>
                    <Button
                        onClick={handleCardClick}
                        variant="contained"
                        color="secondary"
                        size="medium"
                        endIcon={<ArrowForwardWithCircle color="#4178ff" />}
                        className={styles.buttonstyles}
                    >
                        {" "}
                        Sign Up
                    </Button>
                </Stack>
            </Grid>
        </Grid>
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
