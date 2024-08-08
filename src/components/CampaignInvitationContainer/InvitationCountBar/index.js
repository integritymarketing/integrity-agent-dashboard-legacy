import React from "react";
import { Box } from "@mui/material";
import styles from "./styles.module.scss";
import { useCampaignInvitation } from "providers/CampaignInvitation";

const InvitationCountBar = ({}) => {
    const {
        filteredContactsType,
        filteredContentStatus,
        filteredCount = 0,
        totalContactsCount = 0,
    } = useCampaignInvitation();

    return (
        <Box className={styles.banner}>
            <Box className={styles.colorBar}></Box>
            <Box className={styles.bannerContent}>
                Sending to <span className={styles.count}>{filteredCount ? filteredCount : totalContactsCount}</span> of{" "}
                <span className={styles.count}>{totalContactsCount}</span> contacts
            </Box>
            <Box className={styles.divider} />

            <Box>
                {filteredContactsType === "all my contacts" || (!filteredContentStatus && !filteredCount) ? (
                    "All Contacts"
                ) : (
                    <span dangerouslySetInnerHTML={{ __html: filteredContentStatus }}></span>
                )}
            </Box>
        </Box>
    );
};

export default InvitationCountBar;
