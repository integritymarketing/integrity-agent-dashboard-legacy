import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import BackIcon from "images/new-back-btn.svg";
import styles from "./BackButton.module.scss";

function BackButton({ label = "Back" }) {
    // Mimics native back button
    const handleBackNavigation = () => window.history.back();

    return (
        <div className={styles.backContainer}>
            <Button
                icon={<img src={BackIcon} alt="Back" />}
                label={label}
                onClick={() => handleBackNavigation()}
                type="tertiary"
                className={styles.backButton}
            />
        </div>
    );
}

BackButton.propTypes = {
    label: PropTypes.string, // optional string prop
};

export default BackButton;
