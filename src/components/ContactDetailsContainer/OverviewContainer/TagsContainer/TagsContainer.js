import React, { useEffect, useMemo, useState } from "react";

import Box from "@mui/material/Box";

import { useLeadDetails, useOverView } from "providers/ContactDetails";

import styles from "./TagsContainer.module.scss";
import { TagsList } from "./TagsList/TagsList";

const TagsContainer = ({ isMobile }) => {
    const { leadDetails } = useLeadDetails();

    const { getLeadTags, tags } = useOverView();

    const [tagsList, setTagsList] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    const [tagValue, setTagValue] = useState("");
    const [tagId, setTagId] = useState(null);
    const [addNewTag, setAddNewTag] = useState(false);
    const [newTag, setNewTag] = useState("");

    const transformData = (data) => {
        return data.map((category) => ({
            label: category.tagCategoryName,
            items: category.tags.map((tag) => ({
                tag,
                label: tag.tagLabel,
                id: tag.tagId,
            })),
            categoryID: category.tagCategoryId,
        }));
    };

    useEffect(() => {
        if (tags?.length > 0) {
            const transformedData = transformData(tags);
            setTagsList(transformedData);
        }
    }, [tags]);

    useEffect(() => {
        getLeadTags();
    }, []);

    useEffect(() => {
        if (leadDetails?.leadTags) {
            const selectedTagIds = leadDetails.leadTags.map((tag) => tag.tag.tagId);
            setSelectedTags(selectedTagIds);

            // if (tagsList?.length) {
            //     const filteredTags = tagsList.map((tagCategory) => filterCampaignTags(tagCategory, selectedTagIds));
            //     setTagsList(filteredTags);
            // }
        }
    }, [leadDetails]);

    const filterCampaignTags = (tagCategory, selectedIds) => {
        if (
            (tagCategory.label === "Campaigns" || tagCategory.label === "Ask Integrity Recommendations") &&
            tagCategory?.items?.length
        ) {
            return {
                ...tagCategory,
                items: tagCategory?.items?.filter((tag) => selectedIds?.includes(tag?.id)),
            };
        }
        return tagCategory;
    };

    const selectedTagIds = leadDetails?.leadTags?.map((tagItem) => tagItem?.tag?.tagId);

    const filteredTags = tagsList?.map((tagCategory) => filterCampaignTags(tagCategory, selectedTagIds));

    return (
        <Box>
            <Box className={styles.title}>Tags</Box>
            <Box className={styles.box}>
                {filteredTags?.map((item) => (
                    <TagsList
                        leadId={leadDetails?.leadsId}
                        label={item.label}
                        items={item.items}
                        categoryID={item.categoryID}
                        selectedTags={selectedTags}
                        tagValue={tagValue}
                        setTagValue={setTagValue}
                        tagId={tagId}
                        setTagId={setTagId}
                        addNewTag={addNewTag}
                        setAddNewTag={setAddNewTag}
                        newTag={newTag}
                        setNewTag={setNewTag}
                        isMobile={isMobile}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default TagsContainer;
