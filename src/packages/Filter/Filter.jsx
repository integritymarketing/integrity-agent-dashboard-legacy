import React, { useState } from "react";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import { styled } from "@mui/system";

import styles from "./styles.module.scss";

const StyledIconButton = styled(CloseIcon)(({ theme }) => ({
    cursor: "pointer",
    display: "flex",
    width: "30px",
    height: "30px",
    color: "#2175F4",
}));

const StyledPopover = styled(Popover)(() => ({
    ".MuiPopover-paper": {
        marginTop: "10px",
    },
}));

const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "transparent",
        color: '#717171',
        boxShadow: "none",
        fontSize: 12,
        border: "none"
    },
}));

export default function Filter({ heading, content, open, onToggle, Icon, ActiveIcon, filtered }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterToggle, setFilterToggle] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        onToggle(true);
    };

    const handleClose = () => {
        setAnchorEl(null);
        onToggle(false);
    };

    //const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    return (
        <Box sx={{ mr: 2 }}>
            <LightTooltip title={heading} placement="top">
                <div className={styles.filter} onClick={handleClick}>
                    {filterToggle || open || filtered ? (
                        <ActiveIcon onMouseOut={() => setFilterToggle(false)} />
                    ) : (
                        <Icon onMouseOver={() => setFilterToggle(true)} />
                    )}
                </div>
            </LightTooltip>
            <StyledPopover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <Box className={styles.modalContentWrapper}>
                    <Box sx={{ py: 3, px: 3, backgroundColor: "#F4F8FB" }}>
                        <Box className={styles.filterHeader}>
                            <Typography variant="h5" sx={{ color: "#093577" }}>
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