import { useState } from "react";
import PropTypes from "prop-types";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import { styled } from "@mui/system";
import useAnalytics from "hooks/useAnalytics";
import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";

import styles from "./styles.module.scss";

const StyledIconButton = styled(CloseIcon)(() => ({
    cursor: "pointer",
    display: "flex",
    width: "25px",
    height: "25px",
    color: "white",
    backgroundColor: "#ccc",
    borderRadius: "100%",
    padding: "5px",
    marginTop: "5px",
    ":hover": {
        backgroundColor: "#bbb",
    },
}));

const StyledPopover = styled(Popover)(() => ({
    ".MuiPopover-paper": {
        marginTop: "10px",
        width: "480px",
        maxWidth: "calc(100vw - 35px) !important",
    },
}));

const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    () => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "transparent",
            color: "#717171",
            boxShadow: "none",
            fontSize: 12,
            border: "none",
        },
    })
);

function Filter({
    heading,
    content,
    open,
    onToggle,
    isDisabled,
    Icon,
    ActiveIcon,
    filtered,
    filterOverrideClass,
    countToDisplay,
    selectedFilterSections,
}) {
    const { filterConditions } = useContactsListContext();
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterToggle, setFilterToggle] = useState(false);
    const { fireEvent } = useAnalytics();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        onToggle(true);
    };

    const handleClose = () => {
        setAnchorEl(null);
        onToggle(false);
        if (selectedFilterSections.length > 0) {
            fireEvent("Tag Filter Selected", {
                tag_filter: filterConditions,
            });
        }
    };

    const id = open ? "simple-popover" : undefined;

    return (
        <Box sx={{ mr: 2 }}>
            <LightTooltip title={isDisabled ? "" : heading} placement="top">
                <div
                    className={`${styles.filter} ${filterOverrideClass} ${isDisabled ? styles.filterDisabled : ""}`}
                    onClick={isDisabled ? null : handleClick}
                >
                    {filterToggle || open || filtered ? (
                        <ActiveIcon onMouseOut={() => setFilterToggle(false)} />
                    ) : (
                        <Icon onMouseOver={() => setFilterToggle(true)} />
                    )}
                    {countToDisplay && <span className={styles.countToDisplaySpan}>{countToDisplay}</span>}
                </div>
            </LightTooltip>
            <StyledPopover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                style={{ maxWidth: "50px" }}
                slotProps={{ paper: { border: "solid 1px red" } }}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Box className={styles.modalContentWrapper}>
                    <Box>
                        <Box className={styles.filterHeader}>
                            <Typography className={styles.heading} variant="h5" sx={{ color: "#052A63" }}>
                                {heading}
                            </Typography>
                            <StyledIconButton onClick={handleClose} />
                        </Box>
                        {content}
                    </Box>
                </Box>
            </StyledPopover>
        </Box>
    );
}

Filter.propTypes = {
    heading: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired,
    open: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool,
    Icon: PropTypes.elementType.isRequired,
    ActiveIcon: PropTypes.elementType.isRequired,
    filtered: PropTypes.bool,
    filterOverrideClass: PropTypes.string,
    countToDisplay: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    selectedFilterSections: PropTypes.arrayOf(PropTypes.string).isRequired,
};

Filter.defaultProps = {
    filtered: false,
    filterOverrideClass: "",
    countToDisplay: null,
    isDisabled: false,
};

export default Filter;
