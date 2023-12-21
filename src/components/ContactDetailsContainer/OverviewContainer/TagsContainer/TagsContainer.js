import React, { useEffect, useMemo, useState } from 'react'
import { TagsList } from './TagsList/TagsList'
import Box from "@mui/material/Box";
import { Button } from "components/ui/Button";
import { ArrowForwardWithCircle } from "../Icons";
import { useLeadDetails, useOverView } from "providers/ContactDetails";
import TextField from "@mui/material/TextField";


import styles from "./TagsContainer.module.scss";


const TagsContainer = function () {

    const { leadDetails } = useLeadDetails();
    const { getLeadTags, tags, editLeadTags, } = useOverView();

    const [tagsList, setTagsList] = useState([])
    const [tempTags, setTempTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])
    const [selectedTempTags, setSelectedTempTags] = useState([])

    const [tagValue, setTagValue] = useState("");
    const [tagId, setTagId] = useState(null);
    const [addNewTag, setAddNewTag] = useState(false);
    const [newTag, setNewTag] = useState("");



    const transformData = (data) => {
        return data.map((category) => ({
            label: category.tagCategoryName,
            items: category.tags.map(tag => ({
                tag,
                label: tag.tagLabel,
                id: tag.tagId
            }))
        }));
    };

    useEffect(() => {
        if (tags?.length > 0) {
            const transformedData = transformData(tags)
            setTagsList(transformedData)
            setTempTags(transformedData)
        }
    }, [tags])


    useEffect(() => {
        getLeadTags()
    }, [])


    useEffect(() => {
        if (leadDetails?.leadTags) {
            const selectedTagIds = leadDetails.leadTags.map(tag => tag.tag.tagId);
            setSelectedTags(selectedTagIds);
            setSelectedTempTags(selectedTagIds);

            if (tempTags.length) {
                const filteredTags = tempTags.map(tagCategory => filterCampaignTags(tagCategory, selectedTagIds));
                setTagsList(filteredTags);
            }
        }
    }, [leadDetails, tempTags]);




    const filterCampaignTags = (tagCategory, selectedIds) => {
        if (tagCategory.label === "Campaigns" && tagCategory.items.length) {
            return {
                ...tagCategory,
                items: tagCategory.items.filter(tag => selectedIds.includes(tag.id))
            };
        }
        return tagCategory;
    };

    const onCancel = () => {
        setSelectedTempTags([])
        setTagsList(tempTags)
        setTagId(null);
        setTagValue("");
        setAddNewTag(false);
        setNewTag("");
    }

    const handleSave = () => {
        const payload = {
            leadId: leadDetails?.leadsId,
            tagIds: selectedTempTags
        }
        editLeadTags(payload)
    }


    const isDisabled = useMemo(() => {
        // Check if the arrays are the same length
        if (selectedTags.length !== selectedTempTags.length) {
            return false;
        }

        // Sort both arrays
        const sortedArr1 = [...selectedTags].sort((a, b) => a - b);
        const sortedArr2 = [...selectedTempTags].sort((a, b) => a - b);

        // Compare the sorted arrays
        for (let i = 0; i < sortedArr1.length; i++) {
            if (sortedArr1[i] !== sortedArr2[i]) {
                return false;
            }
        }

        return true;
    }, [selectedTags, selectedTempTags]);


    return (
        <Box>
            <Box className={styles.title}>Tags</Box>
            <Box className={styles.box}>
                {tagsList?.map(item =>
                    <TagsList
                        leadId={leadDetails?.leadsId}
                        label={item.label}
                        items={item.items}
                        setSelectedTags={setSelectedTempTags}
                        selectedTags={selectedTempTags}
                        tagValue={tagValue}
                        setTagValue={setTagValue}
                        tagId={tagId}
                        setTagId={setTagId}
                        addNewTag={addNewTag}
                        setAddNewTag={setAddNewTag}
                        newTag={newTag}
                        setNewTag={setNewTag}
                    />)}
                <Box className={styles.buttonContainer}>
                    <Button
                        label={"Reset"}
                        className={styles.cancelButton}
                        type="tertiary"
                        onClick={onCancel}
                    />
                    <Button
                        label={"Apply"}
                        className={styles.saveButton}
                        disabled={isDisabled}
                        onClick={handleSave}
                        type="tertiary"
                        icon={<ArrowForwardWithCircle />}
                        iconPosition="right"
                    />
                </Box>
            </Box>

        </Box>
    )
}


export default TagsContainer
