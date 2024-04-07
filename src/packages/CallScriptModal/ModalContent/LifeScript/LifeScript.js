import PropTypes from "prop-types";
import TagsInfo from "../TagsInfo/TagsInfo";

import styles from "./styles.module.scss";

function LifeScript() {
    return (
        <div>
            <div className={styles.cmsComplianceSection}>
                To be in compliance with FCC guidelines, please read this script at the beginning of every call.
            </div>
            <div className={styles.planInformationSection}>
                This call may be recorded for quality assurance or training purposes.
            </div>
            <TagsInfo />
        </div>
    );
}

LifeScript.propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    leadId: PropTypes.string.isRequired,
    countyFips: PropTypes.string.isRequired,
    postalCode: PropTypes.string.isRequired,
};

export default LifeScript;
