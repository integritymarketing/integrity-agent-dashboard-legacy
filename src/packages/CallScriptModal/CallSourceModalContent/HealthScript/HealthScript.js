import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import TagsInfo from "../TagsInfo/TagsInfo";
import styles from "./styles.module.scss";

function HealthScript({ shouldShowOptionalHealthInfo, carrierCount, productCount, leadId, agentInformation }) {
    const { agentFirstName, agentLastName, officeState, officeCity, caLicense } = agentInformation;
    const agentFullName = `${agentFirstName} ${agentLastName}`;

    return (
        <Box>
            <Box className={styles.cmsComplianceSection}>
                To be in compliance with CMS guidelines, please read this script before every call.
            </Box>
            <Box className={styles.planInformationSection}>
                Hi my name is {agentFullName}, located in {officeCity}. {officeState} and my licensed insurance agent
                number is {caLicense}. I’m very happy to help you today! First, I need to make sure that you consent to the
                sharing of your personal beneficiary information with me in connection with this recorded call. Do we
                have you consent to share your personal beneficiary information?
                <Box>
                    <Typography
                        variant="h5"
                        color=" #052A63"
                        sx={{ paddingTop: "24px", paddingBottom: "24px", paddingLeft: "24px" }}
                    >
                        (wait for a yes or no)
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="h5" color=" #052A63" sx={{ paddingLeft: "24px" }}>
                        (if no)
                    </Typography>
                    <Box>
                        Thank you for your time today. Since we cannot utilize your personal beneficiary information,
                        I’ll need to end the call but I would like to direct you back to PlanEnroll.com if you need more
                        information. You may also go online to Medicare.gov, or call 1-800-MEDICARE or you can reach out
                        to your local State Health Insurance Program (SHIP) to obtain information on all of your
                        available options. Thank you! (end the call)
                    </Box>
                </Box>
                <Box>
                    <Typography variant="h5" color=" #052A63" sx={{ paddingTop: "24px", paddingLeft: "24px" }}>
                        (if yes)
                    </Typography>
                    <Box>
                        Great! As I mentioned, I’m a licensed insurance agent participating in the PlanEnroll Network.
                        This call is recorded pursuant to CMS requirements as well as for quality assurance or training
                        purposes. We do not offer every plan available in your area. Currently, we represent {carrierCount}{" "}
                        organizations which offer {productCount} products in your area. You may also go
                        online to Medicare.gov, or call 1-800-MEDICARE, or you can reach out to your local State Health
                        Insurance Program (SHIP) to obtain information on all of your available options.
                    </Box>
                </Box>
            </Box>
            {leadId && <TagsInfo leadId={leadId} />}
            {shouldShowOptionalHealthInfo && (
                <>
                    <Box className={styles.cmsComplianceSection}>Optional information</Box>
                    <Box className={styles.planInformationSection}>
                        Exact carrier and plan counts are determined by your zip code and county.
                    </Box>
                </>
            )}
        </Box>
    );
}

HealthScript.propTypes = {
    shouldShowOptionalHealthInfo: PropTypes.bool.isRequired,
    productCount: PropTypes.string.isRequired,
    carrierCount: PropTypes.string.isRequired,
    leadId: PropTypes.string,
    agentInformation: PropTypes.object,
};

export default HealthScript;
