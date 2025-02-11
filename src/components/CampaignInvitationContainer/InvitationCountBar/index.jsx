import { Box } from "@mui/material";
import styles from "./styles.module.scss";
import { useCampaignInvitation } from "providers/CampaignInvitation";
import ClearFilterButton from "./ClearFilterButton";
import { styleActionDescription, styleEventDescription } from "utils/shared-utils/sharedUtility";
import PropTypes from "prop-types";

const InvitationCountBar = ({ readOnly }) => {
    const {
        campaignActionType,
        filteredContentStatus,
        filteredCount,
        totalContactsCount,
        eligibleContactsLength,
        contactName,
        filteredEligibleCount,
        actionDescription,
        resetSecond,
        handleCreateOrUpdateCampaign,
    } = useCampaignInvitation();

    const handleClearFilter = () => {
        resetSecond();
        handleCreateOrUpdateCampaign({
            campaign_ActionType: "empty",
        });
    };

    const showClearFilterButton = () => {
        return (
            (campaignActionType === "a contact" ||
                campaignActionType === "contacts filtered by…" ||
                campaignActionType === "a contact when") &&
            !readOnly
        );
    };

    const sendText = readOnly ? "Sent to" : "Sending to";

    return (
        <Box className={styles.banner}>
            <Box className={styles.colorBar}></Box>
            <Box className={styles.bannerContent}>
                {campaignActionType === "a contact" && (
                    <>
                        {sendText} <span className={styles.count}> 1</span> contact
                    </>
                )}
                {campaignActionType === "all contacts" && (
                    <>
                        {sendText} <span className={styles.count}>{eligibleContactsLength}</span> of{" "}
                        <span className={styles.count}>{totalContactsCount}</span> contacts
                    </>
                )}

                {(campaignActionType === "contacts filtered by…" && 
                    <>
                        {sendText} <span className={styles.count}>{filteredCount}</span> of{" "}
                        <span className={styles.count}>{filteredEligibleCount}</span> contacts
                    </>
                )}
                {campaignActionType === "a contact when"  && (
                    <>
                        {sendText} contacts
                    </>)}

                {campaignActionType !== "contacts filtered by…" &&
                    campaignActionType !== "a contact when" &&
                    campaignActionType !== "a contact" &&
                    campaignActionType !== "all contacts" &&
                    campaignActionType !== "" && (
                        <>
                            {sendText} <span className={styles.count}>{eligibleContactsLength}</span> contacts
                        </>
                    )}
            </Box>
            <Box className={styles.divider} />

            <Box className={styles.filteredContent}>
                {campaignActionType === "a contact" && (contactName ? contactName : "Choose a contact")}

                {campaignActionType === "all contacts" && "All Contacts"}

                {campaignActionType === "contacts filtered by…" && filteredContentStatus && (
                    <span
                        dangerouslySetInnerHTML={{
                            __html: `${filteredContentStatus}`,
                        }}
                    ></span>
                )}
                {campaignActionType === "a contact when" && filteredContentStatus && (
                    <span
                        dangerouslySetInnerHTML={{
                            __html: styleEventDescription(`when<span> ${filteredContentStatus}</span>`),
                        }}
                    ></span>
                )}
                {campaignActionType !== "contacts filtered by…" &&
                    campaignActionType !== "a contact when" &&
                    campaignActionType !== "a contact" &&
                    campaignActionType !== "all contacts" &&
                    campaignActionType !== "" && (
                        <>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: styleActionDescription(actionDescription),
                                }}
                            ></span>
                        </>
                    )}
            </Box>
            {showClearFilterButton() && (
                <Box className={styles.bannerFilter}>
                    <ClearFilterButton onClear={readOnly ? undefined : handleClearFilter} />
                </Box>
            )}
        </Box>
    );
};

InvitationCountBar.propTypes = {
    readOnly: PropTypes.bool,
};

export default InvitationCountBar;
