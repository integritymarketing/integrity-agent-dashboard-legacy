import PropTypes from "prop-types";
import styles from "./EnrollmentHistoryContainer.module.scss";

const NoPlansAvailable = ({ guideLink }) => (
    <div className={styles.noPlansAvailable}>
        <div>
            There is no policy information available for this contact at this time. For more information about policy
            data, please view our guides.
        </div>
        <a href={guideLink} target="_blank" rel="noopener noreferrer">
            Policy Data Guide
        </a>
    </div>
);

NoPlansAvailable.propTypes = {
    guideLink: PropTypes.string.isRequired,
};

export default NoPlansAvailable;