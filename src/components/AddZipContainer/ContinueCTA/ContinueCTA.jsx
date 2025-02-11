import React from "react";
import PropTypes from "prop-types";
import styles from "./ContinueCTA.module.scss";
import { Button } from "components/ui/Button";
import ButtonCircleArrow from "components/icons/button-circle-arrow";
import { CONTINUE } from "components/AddZipContainer/AddZipContainer.constants";

export const ContinueCTA = ({ isMobile, isDisabled, handleContinue }) => {
    return (
        <div className={isMobile ? styles.alignRight : ""}>
            <Button
                disabled={isDisabled}
                label={CONTINUE}
                onClick={handleContinue}
                type="primary"
                icon={<ButtonCircleArrow />}
                iconPosition="right"
                style={{ border: "none" }}
                className={`${isDisabled ? styles.disabled : ""} ${isMobile ? styles.submitMobile : styles.submitDesktop
                    } ${styles.submit}`}
            />
        </div>
    );
};

ContinueCTA.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    handleContinue: PropTypes.func.isRequired,
};