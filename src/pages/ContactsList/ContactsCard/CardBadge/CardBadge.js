import React from "react";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

// Moved outside to avoid re-creation on every render
const ReminderBadge = styled(Badge)({
    "& .MuiBadge-badge": {
        right: -3,
        top: 20,
        right: 8,
        padding: "2px",
        background: "#F1FAFF",
        border: "2px solid #ffffff",
        color: "#4178FF",
    },
});

const CampaignBadge = styled(Badge)({
    "& .MuiBadge-badge": {
        top: 20,
        right: -3,
        padding: "2px",
        background: "#F1FAFF",
        border: "2px solid #ffffff",
        color: "#4178FF",
    },
});

const AskIntegrityBadge = styled(Badge)({
    "& .MuiBadge-badge": {
        top: 12,
        left: 12,
        padding: "2px",
        background: "#F1FAFF",
        border: "2px solid #ffffff",
        color: "#4178FF",
    },
});

const CardBadge = ({ label, Icon, count = "", name, onClick }) => (
    <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        className={styles.cardBadgeContainer}
        onClick={onClick}
    >
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
            {name === "reminder" && (
                <ReminderBadge badgeContent={count ? count : 0} color="secondary">
                    {Icon}
                </ReminderBadge>
            )}
            {name === "campaign" && (
                <CampaignBadge badgeContent={count ? count : 0} color="secondary">
                    {Icon}
                </CampaignBadge>
            )}
            {name === "askIntegrity" && (
                <AskIntegrityBadge badgeContent={count ? count : 0} color="secondary">
                    {Icon}
                </AskIntegrityBadge>
            )}

            {!name && (
                <ReminderBadge badgeContent={count ? count : 0} color="secondary">
                    {Icon}
                </ReminderBadge>
            )}
        </IconButton>
    </Box>
);

CardBadge.propTypes = {
    label: PropTypes.string.isRequired,
    IconComponent: PropTypes.elementType.isRequired,
    count: PropTypes.string,
};

CardBadge.defaultProps = {
    count: "",
};

export default CardBadge;
