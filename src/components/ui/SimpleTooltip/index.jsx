import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

const SimpleTooltip = ({ label, tooltipText, children, placement }) => {
    return (
        <Tooltip
            placement={placement || "bottom"}
            title={
                tooltipText ? (
                    <Box className={styles.tooltipBox}>
                        <Typography className={styles.tooltipText}>{tooltipText}</Typography>
                    </Box>
                ) : null
            }
            enterTouchDelay={0}
            leaveTouchDelay={2000}
            arrow
        >
            {children}
            {label && <Typography className={styles.tooltipLabel}>{label}</Typography>}
        </Tooltip>
    );
};

SimpleTooltip.propTypes = {
    label: PropTypes.string.isRequired,
    tooltipText: PropTypes.string.isRequired,
};

export default SimpleTooltip;
