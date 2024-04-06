import React from "react";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

// Moved outside to avoid re-creation on every render
const StyledBadge = styled(Badge)({
    "& .MuiBadge-badge": {
        right: -3,
        top: 20,
        background: "transparent",
    },
});

const CardBadge = ({ label, Icon, count = "" }) => {
    return label ? <Box display="flex" flexDirection="column" alignItems="center" className={styles.cardBadgeContainer}>
        <Box className={styles.tag}>{label}</Box>
        <IconButton
            size="small"
            aria-label={label}
            sx={{
                "&.MuiButtonBase-root:hover": {
                    bgcolor: "transparent",
                },
            }}
        >
            <StyledBadge badgeContent={count} color="secondary">
                {Icon}
            </StyledBadge>
        </IconButton>
    </Box> : <StyledBadge badgeContent={count} color="secondary">
        {Icon}
    </StyledBadge>
};

CardBadge.propTypes = {
    label: PropTypes.string.isRequired,
    IconComponent: PropTypes.elementType.isRequired,
    count: PropTypes.string,
};

CardBadge.defaultProps = {
    count: "",
};

export default CardBadge;