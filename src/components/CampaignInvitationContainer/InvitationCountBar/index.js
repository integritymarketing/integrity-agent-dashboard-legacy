import React from "react";
import { Box } from "@mui/material";
import styles from "./styles.module.scss";
import { useCampaignInvitation } from "providers/CampaignInvitation";
import ClearFilterButton from "./ClearFilterButton";

const InvitationCountBar = () => {
    const {
        filteredContactsType,
        setFilteredContactsType,
        filteredContentStatus,
        filteredCount,
        totalContactsCount,
        eligibleContactsLength,
        contactName,
        createdNewCampaign,
        filteredEligibleCount,
        campaignStatuses
    } = useCampaignInvitation();

    const readOnly = createdNewCampaign?.campaignStatus === campaignStatuses.COMPLETED;

    const handleClearFilter = () => {
        setFilteredContactsType("");
    }

    const showClearFilterButton = () => {
        return filteredContactsType === "a contact" || filteredContactsType === "contacts filtered by ..";
    }

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

                {filteredContactsType === "all contacts" && "All Contacts who have an email address and have not created a PlanEnroll account"}

                {filteredContactsType === "contacts filtered by .." && filteredContentStatus && (
                    <span dangerouslySetInnerHTML={{ __html: `${filteredContentStatus} who have an email address and have not created a PlanEnroll account` }}></span>
                )}
            </Box>
            {showClearFilterButton() && <Box className={`${styles.bannerFilter} ${readOnly ? styles.disabled : ''}`}><ClearFilterButton onClear={readOnly ? undefined : handleClearFilter} /></Box>}
        </Box>
    );
};

export default InvitationCountBar;