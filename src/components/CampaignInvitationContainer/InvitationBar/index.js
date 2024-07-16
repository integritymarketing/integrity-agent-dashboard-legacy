import React, { useState } from "react";
import { Box, Typography, Popper, Paper } from "@mui/material";
import ArrowDownBig from "components/icons/version-2/ArrowDownBig";
import styles from "./styles.module.scss";
import EmailIcon from "components/icons/Marketing/emailIcon";
import CircleAdd from "components/icons/Marketing/circleAdd";
import TextMessageIcon from "components/icons/Marketing/textMessageIcon";
import Option from "./option";

const InvitationBar = () => {
    const [emailOrTextOptionsOpen, setEmailOrTextOptionsOpen] = useState(null);
    const [contactOptionOpen, setContactOptionOpen] = useState(null);

    const handleEmailOrTextOptions = (event) => {
        setEmailOrTextOptionsOpen(emailOrTextOptionsOpen ? null : event.currentTarget);
    };

    const handleContactOptions = (event) => {
        setContactOptionOpen(contactOptionOpen ? null : event.currentTarget);
    };

    const isEmailOrTextOpen = Boolean(emailOrTextOptionsOpen);
    const isContactOpen = Boolean(contactOptionOpen);

    return (
        <Box className={styles.emailOptions}>
            <Box>
                <Typography className={styles.optionText}>I want to send an</Typography>
            </Box>
            <Box className={styles.option} onClick={handleEmailOrTextOptions}>
                <Typography className={styles.optionLink}>email</Typography>
                <ArrowDownBig width="40px" height="40px" />

                <Popper
                    id={isEmailOrTextOpen ? "simple-popper" : undefined}
                    open={isEmailOrTextOpen}
                    anchorEl={emailOrTextOptionsOpen}
                    placement="bottom"
                >
                    <Paper className={styles.popper}>
                        <Option optionText="Email" icon={EmailIcon} />
                        <Box className={styles.divider} />
                        <Option optionText="Text Message" icon={TextMessageIcon} />
                    </Paper>
                </Popper>
            </Box>

            <Box>
                <Typography className={styles.optionText}>to</Typography>
            </Box>
            <Box className={styles.option} onClick={handleContactOptions}>
                <Typography className={styles.optionLink}>all my contacts</Typography>
                <ArrowDownBig width="40px" height="40px" />

                <Popper
                    id={isContactOpen ? "simple-popper" : undefined}
                    open={isContactOpen}
                    anchorEl={contactOptionOpen}
                    placement="bottom"
                >
                    <Paper className={styles.popper}>
                        <Option optionText="all my contacts" />
                        <Box className={styles.divider} />
                        <Option optionText="Filter my contacts" icon={CircleAdd} />
                    </Paper>
                </Popper>
            </Box>
            <Box>
                <Typography className={styles.optionText}>if</Typography>
            </Box>
            <Box>
                <Typography className={styles.optionText}>they don’t have a PlanEnroll account.</Typography>
            </Box>
        </Box>
    );
};

export default InvitationBar;
