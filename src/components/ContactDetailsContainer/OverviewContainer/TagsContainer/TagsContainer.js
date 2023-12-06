import React, { useEffect, useState } from 'react'
import { TagsList } from './TagsList/TagsList'
import Box from "@mui/material/Box";
import { Button } from "components/ui/Button";
import { ArrowForwardWithCircle } from "../Icons";
import { useLeadDetails, useOverView } from "providers/ContactDetails";


import styles from "./TagsContainer.module.scss";


const TagsContainer = function () {

    const { leadDetails } = useLeadDetails();
    const { getLeadTags, tags, editLeadTags, removeLeadTags, editTagByID } = useOverView();

    const [tagsList, setTagsList] = useState([])
    const [tempTags, setTempTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])

    const transformData = (data) => {
        return data.map((category) => ({
            label: category.tagCategoryName,
            items: category.tags.map(tag => ({
                tag: tag,
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
            const selectedTagIds = leadDetails?.leadTags.map(item => item?.tag?.tagId);
            setSelectedTags(selectedTagIds)
        }
    }, [leadDetails])



    const onCancel = () => {
        setSelectedTags([])
        setTags(tempTags)
    }

    const handleSave = () => {
        const payload = {
            leadId: leadDetails?.leadsId,
            tagIds: selectedTags
        }
        editLeadTags(payload)
    }

    return (
        <Box>
            <Box className={styles.title}>Tags</Box>
            <Box className={styles.box}>
                {tagsList?.map(item => <TagsList leadId={leadDetails?.leadsId} label={item.label} items={item.items} setSelectedTags={setSelectedTags} selectedTags={selectedTags} />)}
                <Box className={styles.buttonContainer} >
                    <Button
                        label={"Cancel"}
                        className={styles.cancelButton}
                        type="tertiary"
                        onClick={onCancel}
                    />
                    <Button
                        label={"Apply"}
                        className={styles.saveButton}
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


//     return <div>
//         <Label value="Tags" />
//         <SectionContainer>
//             {tagsList?.map(item => <TagsList leadId={leadDetails?.leadsId} label={item.label} items={item.items} setSelectedTags={setSelectedTags} selectedTags={selectedTags} />)}
//             <Box className={styles.buttonContainer} >
//                 <Button
//                     label={"Cancel"}
//                     className={styles.cancelButton}
//                     type="tertiary"
//                     onClick={onCancel}
//                 />
//                 <Button
//                     label={"Apply"}
//                     className={styles.saveButton}
//                     onClick={handleSave}
//                     type="tertiary"
//                     icon={<ArrowForwardWithCircle />}
//                     iconPosition="right"
//                 />
//             </Box>
//         </SectionContainer>

//     </div>
// }

export default TagsContainer
