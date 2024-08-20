import React from "react";
import { Box, Popper, Paper } from "@mui/material";
import styles from "./styles.module.scss";
import Option from "./option";
import PropTypes from "prop-types";

// Reusable CustomPopover component
const CustomPopover = ({ options, anchorEl, handleAction }) => {
    const open = Boolean(anchorEl);
    return (
        <Popper id={open ? "simple-popper" : undefined} open={open} anchorEl={anchorEl} placement="bottom">
            <Paper className={styles.popper}>
                {options.map((option, index) => (
                    <React.Fragment key={option.optionText}>
                        <Option
                            optionText={option.optionText}
                            icon={option.icon}
                            onClick={() => handleAction(option.value)}
                        />
                        {index < options.length - 1 && <Box className={styles.divider} />}
                    </React.Fragment>
                ))}
            </Paper>
        </Popper>
    );
};

CustomPopover.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            optionText: PropTypes.string.isRequired,
            icon: PropTypes.elementType,
        })
    ).isRequired,
    anchorEl: PropTypes.instanceOf(Element),
    open: PropTypes.bool.isRequired,
    handleAction: PropTypes.func.isRequired,
};

export default CustomPopover;
