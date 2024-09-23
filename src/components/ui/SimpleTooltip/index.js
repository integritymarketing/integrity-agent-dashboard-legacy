import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

const SimpleTooltip = ({ label, tooltipText }) => {
    return (
        <Tooltip
            title={
                <Box className={styles.tooltipBox}>
                    <Typography className={styles.tooltipText}>{tooltipText}</Typography>
                </Box>
            }
            enterTouchDelay={0}
            leaveTouchDelay={2000}
            arrow
        >
            <Typography className={styles.tooltipLabel}>{label}</Typography>
        </Tooltip>
    );
};

SimpleTooltip.propTypes = {
    label: PropTypes.string.isRequired,
    tooltipText: PropTypes.string.isRequired,
};

export default SimpleTooltip;
