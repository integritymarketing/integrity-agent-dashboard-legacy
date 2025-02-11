import { Box } from "@mui/material";
 
import PropTypes from "prop-types";
 
import TagsInfo from "../TagsInfo/TagsInfo";
import styles from "./styles.module.scss";
 
function HealthScript({ shouldShowOptionalHealthInfo, carrierCount, productCount, leadId }) {
    return (
        <Box>
            <Box className={styles.cmsComplianceSection}>
                To be in compliance with CMS guidelines, please read this script before every call.
            </Box>
            <Box className={styles.planInformationSection}>
                This call may be recorded for quality assurance or training purposes. We do not offer every plan
                available in your area. Currently, we represent {carrierCount} organizations which offer {productCount}
                products in your area. Please contact medicare.gov, 1-800-MEDICARE, or your local State Health Insurance
                Program (SHIP) to get information on all of your options.
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
};
 
export default HealthScript;