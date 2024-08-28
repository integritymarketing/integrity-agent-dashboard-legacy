import React from "react";
import { Box } from "@mui/material";
import styles from "./styles.module.scss";
import { useCampaignInvitation } from "providers/CampaignInvitation";

const InvitationCountBar = () => {
    const {
        filteredContactsType,
        filteredContentStatus,
        filteredCount,
        totalContactsCount,
        eligibleContactsLength,
        contactName,
        filteredEligibleCount,
    } = useCampaignInvitation();

    return (
        <Box className={styles.banner}>
            <Box className={styles.colorBar}></Box>
            <Box className={styles.bannerContent}>
                {filteredContactsType === "a contact" && (
                    <>
                        Sending to <span className={styles.count}> 1</span> contact
                    </>
                )}
                {filteredContactsType === "all contacts" && (
                    <>
                        Sending to <span className={styles.count}>{eligibleContactsLength}</span> of{" "}
                        <span className={styles.count}>{totalContactsCount}</span> contacts
                    </>
                )}

                {filteredContactsType === "contacts filtered by .." && (
                    <>
                        Sending to <span className={styles.count}>{filteredCount}</span> of{" "}
                        <span className={styles.count}>{filteredEligibleCount}</span> contacts
                    </>
                )}
            </Box>
            <Box className={styles.divider} />

            <Box className={styles.filteredContent}>
                {filteredContactsType === "a contact" && (contactName ? contactName : "Choose a contact")}

                {filteredContactsType === "all contacts" && "All Contacts"}

                {filteredContactsType === "contacts filtered by .." && (
                    <span dangerouslySetInnerHTML={{ __html: filteredContentStatus }}></span>
                )}
            </Box>
        </Box>
    );
};

export default InvitationCountBar;