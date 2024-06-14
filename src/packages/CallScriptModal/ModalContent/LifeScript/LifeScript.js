import PropTypes from "prop-types";
import TagsInfo from "../TagsInfo/TagsInfo";
 
import styles from "./styles.module.scss";
 
function LifeScript({ leadId }) {
    return (
        <div>
            <div className={styles.cmsComplianceSection}>
                To be in compliance with FCC guidelines, please read this script at the beginning of every call.
            </div>
            <div className={styles.planInformationSection}>
                This call may be recorded for quality assurance or training purposes.
            </div>
            {leadId && <TagsInfo leadId={leadId} />}
        </div>
    );
}
 
LifeScript.propTypes = {
    leadId: PropTypes.string,
};
 
export default LifeScript;
