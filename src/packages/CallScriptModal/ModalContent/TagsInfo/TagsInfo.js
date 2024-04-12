import { Box } from "@mui/material";
import { useMemo } from "react";
import PropTypes from "prop-types";
import { useLeadDetails } from "providers/ContactDetails";
import Styles from "./TagsInfo.module.scss";
import { toSentenceCase } from "utils/toSentenceCase";
import Icon from "components/Icon";

function TagsInfo() {
    const { leadDetails } = useLeadDetails();

    const { askIntegrityTags, campaignTags } = useMemo(
        () => ({
            askIntegrityTags: leadDetails?.leadTags?.filter(
                (tag) => tag?.tag?.tagCategory?.tagCategoryName === "Ask Integrity Recommendations"
            ),
            campaignTags: leadDetails?.leadTags?.filter((tag) =>
                tag?.tag?.tagCategory?.tagCategoryName?.includes("Campaign")
            ),
        }),
        [leadDetails]
    );

    const removePrefix = (str) => {
        return str?.replace("Campaign ", "");
    };

    const renderTag = (tagInfo) => (
        <Box className={Styles.askIntegrityCard}>
            <Box className={Styles.askIntegrityInfo}>
                <Box>
                    <img src={tagInfo.tag.tagIconUrl} />
                </Box>
                <Box className={Styles.tagInfo}>
                    {campaignTags.length > 0 ? (
                        <Box display="flex" alignItems="center">
                            <Box className={Styles.tagCategoryLabelCampaign}>
                                {toSentenceCase(removePrefix(tagInfo.tag.tagCategory.tagCategoryName))}:
                            </Box>
                            <Box className={Styles.tagNameCampaign}>{tagInfo.tag.tagLabel}</Box>
                        </Box>
                    ) : (
                        <>
                            <Box className={Styles.tagName}>{tagInfo.tag.tagLabel}</Box>
                            <Box className={Styles.tagName}>{tagInfo.tag.tagLabel}</Box>
                        </>
                    )}
                    <Box className={Styles.tagMetaData}>{tagInfo.tag.metadata}</Box>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box marginTop="20px">
            {campaignTags.length > 0 && (
                <Box marginBottom="10px">
                    <Box className={Styles.tagCategoryLabel}>Campaign Tags</Box>
                    <Box>{campaignTags.map((tagInfo) => renderTag(tagInfo))}</Box>
                </Box>
            )}
            {askIntegrityTags.length > 0 && (
                <Box marginBottom="10px">
                    <Box className={Styles.tagCategoryLabel}>Ask Integrity Suggests</Box>
                    <Box>{askIntegrityTags.map((tagInfo) => renderTag(tagInfo))}</Box>
                </Box>
            )}
        </Box>
    );
}

TagsInfo.propTypes = {
    leadDetails: PropTypes.shape({
        leadTags: PropTypes.arrayOf(
            PropTypes.shape({
                tag: PropTypes.shape({
                    tagLabel: PropTypes.string,
                    metadata: PropTypes.string,
                    tagCategory: PropTypes.shape({
                        tagCategoryName: PropTypes.string,
                    }),
                }),
            })
        ),
    }),
};

export default TagsInfo;
