import { Box } from "@mui/material";

import { useLeadDetails } from "providers/ContactDetails";
import AskIntegrity from "components/icons/version-2/AskIntegrity";
import CampaignStatus from "components/icons/version-2/CampaignStatus";

import styles from "./TagsInfo.module.scss";

function TagsInfo() {
    const { leadDetails } = useLeadDetails();
    const askIntegrityTags = leadDetails?.leadTags?.filter(
        (tag) => tag?.tag?.tagCategory?.tagCategoryName === "Ask Integrity Recommendations"
    );
    const campaignTags = leadDetails?.leadTags?.filter((tag) => tag?.tag?.tagCategory?.tagCategoryName === "Campaigns");

    return (
        <Box marginTop={"20px"}>
            {campaignTags?.length > 0 && (
                <Box marginBottom={"10px"}>
                    <Box className={styles.tagCategoryLabel}> Campaign Tags</Box>
                    <Box>
                        {campaignTags?.map((tagInfo) => {
                            const tagLabel = tagInfo?.tag?.tagLabel;
                            const metadata = tagInfo?.tag?.metadata;
                            return (
                                <Box className={styles.askIntegrityCard}>
                                    <Box className={styles.askIntegrityInfo}>
                                        <Box>
                                            <CampaignStatus />
                                        </Box>
                                        <Box className={styles.tagInfo}>
                                            <Box className={styles.tagName}>{tagLabel}</Box>
                                            <Box className={styles.tagMetaData}>{metadata}</Box>
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            )}

            {askIntegrityTags?.length > 0 && (
                <Box marginBottom={"10px"}>
                    <Box className={styles.tagCategoryLabel}> Ask Integrity Suggests</Box>
                    <Box>
                        {askIntegrityTags?.map((tagInfo) => {
                            const tagLabel = tagInfo?.tag?.tagLabel;
                            const metadata = tagInfo?.tag?.metadata;
                            return (
                                <Box className={styles.askIntegrityCard}>
                                    <Box className={styles.askIntegrityInfo}>
                                        <Box>
                                            <AskIntegrity />
                                        </Box>
                                        <Box className={styles.tagInfo}>
                                            <Box className={styles.tagName}>{tagLabel}</Box>
                                            <Box className={styles.tagMetaData}>{metadata}</Box>
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default TagsInfo;
