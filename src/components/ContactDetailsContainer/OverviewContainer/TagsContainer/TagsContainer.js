import { useEffect, useState } from "react";

import Box from "@mui/material/Box";

import { useLeadDetails, useOverView } from "providers/ContactDetails";

import styles from "./TagsContainer.module.scss";
import { TagsList } from "./TagsList/TagsList";
import ArrowDownBig from "components/icons/version-2/ArrowDownBig";
import useDeviceType from "hooks/useDeviceType";

const TagsContainer = () => {
    const { leadDetails } = useLeadDetails();
    const { getLeadTags, tags } = useOverView();
    const { isMobile } = useDeviceType();
    const [tagsList, setTagsList] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagValue, setTagValue] = useState("");
    const [tagId, setTagId] = useState(null);
    const [addNewTag, setAddNewTag] = useState(false);
    const [newTag, setNewTag] = useState("");
    const [isCollapsed, setCollapsed] = useState(false);

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
        }
    }, [leadDetails]);

    const handleToggle = () => {
        setCollapsed(!isCollapsed);
    };

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

    return (
        <Box>
            <Box className={`${styles.iconWithTitle}  ${isCollapsed ? styles.underLine : ""}`}>
                {isMobile && (
                    <div className={`${styles.icon} ${isCollapsed ? styles.iconRotate : ""}`} onClick={handleToggle}>
                        <ArrowDownBig />
                    </div>
                )}
                <Box className={styles.title}>Tags</Box>
            </Box>
            {(!isCollapsed || !isMobile) && (
                <Box className={styles.box}>
                    {tagsList?.map((item, index) => (
                        <TagsList
                            key={index}
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
            )}
        </Box>
    );
};

export default TagsContainer;
