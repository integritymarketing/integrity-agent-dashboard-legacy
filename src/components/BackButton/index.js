import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import BackIcon from "images/new-back-btn.svg";
import { useMediaQuery, useTheme } from "@mui/material";
import styles from "./BackButton.module.scss";

function BackButton({ label = "Back", route = null, showInMobile = false, onClick, className = "" }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const navigate = useNavigate();
    // Mimics native back button
    const handleBackNavigation = () => {
        if (route) {
            navigate(route);
        } else {
            window.history.back();
        }
    };

    if (!showInMobile && isMobile) {
        return null;
    }

    return (
        <div className={styles.backContainer}>
            <Button
                icon={<img src={BackIcon} alt="Back" />}
                label={isMobile ? "" : label}
                onClick={onClick ? onClick : () => handleBackNavigation()}
                type="tertiary"
                className={`${styles.backButton} ${className}`}
            />
        </div>
    );
}

BackButton.propTypes = {
    label: PropTypes.string, // optional string prop
    route: PropTypes.string,
    showInMobile: PropTypes.bool,
    className: PropTypes.string,
};

export default BackButton;
