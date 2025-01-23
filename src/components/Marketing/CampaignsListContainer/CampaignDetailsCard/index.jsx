import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import EmailIcon from "components/icons/Marketing/emailIcon";
import TextMessageIcon from "components/icons/Marketing/textMessageIcon";
import moment from "moment";
import styles from "./styles.module.scss";

const CampaignDetailsCard = ({ type, title, status, date }) => {
    const isValidDate = moment(date).isValid();
    const formattedDate = isValidDate ? moment.utc(date).local().format("MMM D") : "";
    return (
        <Box className={styles.campaignCard}>
            <Box className={styles.cardHeader}>
                {type === "Email" ? <EmailIcon /> : <TextMessageIcon />}

                <Typography
                    sx={{
                        fontSize: "24px",
                        color: "#052A63",
                        marginLeft: "8px",
                    }}
                >
                    {title}
                </Typography>
            </Box>
            <Box className={styles.cardDivider} />
            <Box className={styles.cardDetails}>
                <Box className={styles.cardLabel} marginBottom="4px">
                    Sent to:
                    <span className={styles.cardValue}>{`${status}`}</span>
                </Box>
                {isValidDate && (
                    <Box className={styles.cardLabel}>
                        On:
                        <span className={styles.cardValue}>{formattedDate}</span>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

CampaignDetailsCard.propTypes = {
    title: PropTypes.string.isRequired, // Title of the campaign card
    date: PropTypes.string.isRequired, // Date of the campaign
    status: PropTypes.string.isRequired, // Status of the campaign
    type: PropTypes.string.isRequired, // Type of the campaign
};

export default CampaignDetailsCard;
