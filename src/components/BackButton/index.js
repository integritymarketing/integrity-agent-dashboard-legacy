import { Button } from "components/ui/Button";

import PropTypes from "prop-types";
import BackIcon from "images/new-back-btn.svg";
import styles from "./BackButton.module.scss";

function BackButton({ label = "Back", route = null }) {
    // Mimics native back button
    const handleBackNavigation = () => window.history.back();

    return route ? (
        <div className={styles.backContainer}>
            <a
                href={route}
                className={`button button--tertiary icon-left ${styles.buttonLink}`}
                style={{ borderRadius: "20px" }}
            >
                <img src={BackIcon} alt="" aria-hidden="true" />
                <span>{label}</span>
            </a>
        </div>
    ) : (
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
    route: PropTypes.string,
};

export default BackButton;
