import { useNavigate } from "react-router";

import PropTypes from "prop-types";

import ArrowRightCircle from "./assets/ArrrowRightCircle";

import styles from "../AskIntegrityFeedback.module.scss";

const Support = ({ onShare }) => {
    const navigate = useNavigate();

    const handleContactSupportNavigation = () => {
        navigate("/help");
    };

    return (
        <div className={styles.infoContainer}>
            <div className={styles.heading}>Feedback and Support</div>
            <div className={styles.infoItem}>
                <div className={styles.gap}>
                    <div>
                        If you are experiencing any issues with Ask Integrity, we invite you to share your feedback with
                        us so that Ask Integrity can learn and improve.
                    </div>
                    <div className={styles.buttonContainer} onClick={onShare}>
                        <div className={styles.actionButton}>
                            Share Feedback
                            <ArrowRightCircle />
                        </div>
                    </div>
                </div>
                <div className={styles.gap}>
                    <div>
                        For issues with Integrity outside of Ask Integrity, please contact one of our support
                        representatives.
                    </div>
                    <div className={styles.buttonContainer} onClick={handleContactSupportNavigation}>
                        <div className={styles.actionButton}>Contact Support</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Support.propTypes = {
    onShare: PropTypes.func.isRequired,
};

export default Support;
