import React, { useState } from "react";
import { Box, Typography, Popper, Paper } from "@mui/material";
import ArrowDownBig from "components/icons/version-2/ArrowDownBig";
import styles from "./styles.module.scss";
import EmailIcon from "components/icons/Marketing/emailIcon";
import CircleAdd from "components/icons/Marketing/circleAdd";
import TextMessageIcon from "components/icons/Marketing/textMessageIcon";
import Option from "./option";
import { useCampaignInvitation } from "providers/CampaignInvitation";

const InvitationBar = () => {
    const {
        invitationSendType,
        filteredContactsType,
        filteredCount,
        handleInvitationSendType,
        handleFilteredContactsTypeChange,
        invitationName,
    } = useCampaignInvitation();

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
                <Typography className={styles.optionLink}>{invitationSendType}</Typography>
                <ArrowDownBig width="40px" height="40px" />

                <Popper
                    id={isEmailOrTextOpen ? "simple-popper" : undefined}
                    open={isEmailOrTextOpen}
                    anchorEl={emailOrTextOptionsOpen}
                    placement="bottom"
                >
                    <Paper className={styles.popper}>
                        <Option optionText="Email" icon={EmailIcon} onClick={() => handleInvitationSendType("email")} />
                        <Box className={styles.divider} />
                        <Option
                            optionText="Text Message"
                            icon={TextMessageIcon}
                            onClick={() => handleInvitationSendType("text")}
                        />
                    </Paper>
                </Popper>
            </Box>

            <Box>
                <Typography className={styles.optionText}>to</Typography>
            </Box>
            <Box className={styles.option} onClick={handleContactOptions}>
                <Typography className={styles.optionLink}>
                    {filteredCount ? `${filteredCount} Contacts` : filteredContactsType}
                </Typography>
                <ArrowDownBig width="40px" height="40px" />

                <Popper
                    id={isContactOpen ? "simple-popper" : undefined}
                    open={isContactOpen}
                    anchorEl={contactOptionOpen}
                    placement="bottom"
                >
                    <Paper className={styles.popper}>
                        <Option
                            optionText="all my contacts"
                            onClick={() => handleFilteredContactsTypeChange("all my contacts")}
                        />
                        <Box className={styles.divider} />
                        <Option
                            optionText="Filter my contacts"
                            icon={CircleAdd}
                            onClick={() => handleFilteredContactsTypeChange("Filter my contacts")}
                        />
                    </Paper>
                </Popper>
            </Box>
            <Box>
                <Typography className={styles.optionText}>if</Typography>
            </Box>
            <Box>
                <Typography
                    className={styles.optionTextGrey}
                >{`they don’t have a ${invitationName} account.`}</Typography>
            </Box>
        </Box>
    );
};

export default InvitationBar;
