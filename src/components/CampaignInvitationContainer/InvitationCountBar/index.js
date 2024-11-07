import { Box } from "@mui/material";
import styles from "./styles.module.scss";
import { useCampaignInvitation } from "providers/CampaignInvitation";
import ClearFilterButton from "./ClearFilterButton";

const InvitationCountBar = () => {
    const {
        campaignActionType,
        filteredContentStatus,
        filteredCount,
        totalContactsCount,
        eligibleContactsLength,
        contactName,
        campaignStatus,
        filteredEligibleCount,
        campaignStatuses,
        actionDescription,
        resetSecond,
    } = useCampaignInvitation();

    const readOnly = campaignStatus === campaignStatuses.COMPLETED;

    const handleClearFilter = () => {
        resetSecond();
    };

    const showClearFilterButton = () => {
        return (
            (campaignActionType === "a contact" ||
                campaignActionType === "contacts filtered by…" ||
                campaignActionType === "a contact when") &&
            !readOnly
        );
    };

    // Define the words to be styled in black
    const blackWords = ["if", "is", "not"]; // Replace with your specific words

    // Function to style the actionDescription
    const styleActionDescription = (description) => {
        if (!description) {return description;}
        return description
            ?.split(" ")
            ?.map((word, index) => {
                const cleanWord = word.replace(/[.,?!;:()]/g, ""); // Remove punctuation for accurate matching
                if (blackWords.includes(cleanWord.toLowerCase())) {
                    return `<span class="${styles.blackWord}">${word}</span>`;
                } else {
                    return `<span class="${styles.blueWord}">${word}</span>`;
                }
            })
            .join(" ");
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

                {(campaignActionType === "contacts filtered by…" || campaignActionType === "a contact when") && (
                    <>
                        {sendText} <span className={styles.count}>{filteredCount}</span> of{" "}
                        <span className={styles.count}>{filteredEligibleCount}</span> contacts
                    </>
                )}
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

                {(campaignActionType === "contacts filtered by…" || campaignActionType === "a contact when") &&
                    filteredContentStatus && (
                        <span
                            dangerouslySetInnerHTML={{
                                __html: `${filteredContentStatus}`,
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

export default InvitationCountBar;
