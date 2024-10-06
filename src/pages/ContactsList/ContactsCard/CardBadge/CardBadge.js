import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

const ReminderBadge = styled(Badge)({
    "& .MuiBadge-badge": {
        right: -7,
        top: 20,
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
        top: 18,
        left: 26,
        padding: "2px",
        background: "#F1FAFF",
        border: "2px solid #ffffff",
        color: "#4178FF",
    },
});

const CardBadge = ({ label, IconComponent, count = "", name, onClick, classes }) => (
    <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        className={`${styles.cardBadgeContainer} ${classes}`}
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
                    {IconComponent}
                </ReminderBadge>
            )}
            {name === "campaign" && (
                <CampaignBadge badgeContent={count ? count : 0} color="secondary">
                    {IconComponent}
                </CampaignBadge>
            )}
            {name === "askIntegrity" && (
                <AskIntegrityBadge badgeContent={count ? count : 0} color="secondary">
                    {IconComponent}
                </AskIntegrityBadge>
            )}

            {!name &&
                (count > 1 ? (
                    <ReminderBadge badgeContent={count} color="secondary">
                        {IconComponent}
                    </ReminderBadge>
                ) : (
                    <>{IconComponent}</>
                ))}
        </IconButton>
    </Box>
);

CardBadge.propTypes = {
    label: PropTypes.string.isRequired,
    IconComponent: PropTypes.element.isRequired,
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
};

export default CardBadge;
