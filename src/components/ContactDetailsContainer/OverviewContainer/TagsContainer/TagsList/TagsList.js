import React, { useState, useEffect, useCallback } from 'react'
import styles from './TagsList.module.scss'
import { Chevron, Delete, Info, LeadCenter, PlanEnroll, DataCenter, LifeIcon, CrossIcon, Complete } from '../../Icons'
import Label from '../../CommonComponents/Label'
import EditIcon from "components/icons/icon-edit";
import Check from "components/icons/check-blue";
import RecommendationIcon from "images/recommendation.png";
import TagIcon from "images/Tag.png";
import TextField from "@mui/material/TextField";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useOverView } from "providers/ContactDetails";
import Box from "@mui/material/Box";
import { Button } from "components/ui/Button";

const getIconName = (label, itemLabel) => {
    switch (label) {
        case "Products":
            if (itemLabel === "FE") {
                return <LifeIcon />
            } else {
                return <CrossIcon />
            }
        case "Campaigns":
            if (itemLabel === "LEADCENTER") {
                return <LeadCenter />
            } else if (itemLabel.includes("PE")) {
                return <PlanEnroll />
            } else if (itemLabel === "DATA LEAD") {
                return <DataCenter />
            } else {
                return <img alt="TagIcon" src={TagIcon} />
            }
        case "Ask Integrity Recommendations":
            return <img alt="RecommendationIcon" src={RecommendationIcon} />

        default:
            return <img alt="TagIcon" src={TagIcon} />
    }
}





export const TagsList = function (
    {
        label,
        items,
        setSelectedTags,
        selectedTags,
        leadId,
        tagValue,
        setTagValue,
        tagId,
        setTagId,
        addNewTag,
        setAddNewTag,
        newTag,
        setNewTag
    }) {

    const { removeLeadTags, editTagByID, createNewTag } = useOverView();


    const [open, setOpen] = useState(false);


    useEffect(() => {
        setTagId(null)
        setTagValue("")
    }, [])

    useEffect(() => {
        if (label === "Ask Integrity Recommendations") {
            setOpen(true)
        }
    }, [label])

    const editTag = (value, id) => {
        setTagValue(value)
        setTagId(id)
    }

    const editCancel = () => {
        setTagValue("")
        setTagId(null)
    }

    const onSelectTag = (id) => {
        if (!id || label === "Ask Integrity Recommendations") return;
        if (selectedTags.includes(id)) {
            setSelectedTags(selectedTags.filter(item => item !== id))
        } else {
            setSelectedTags([...selectedTags, id])
        }
    }


    const deleteTags = (tagId) => {
        removeLeadTags(tagId)
    }

    const updateTag = () => {
        const payload = {
            tagId: tagId,
            tagLabel: tagValue,
            tagCategoryId: 8,
            leadsId: leadId,
        }
        editTagByID(payload);
        setTagId(null)
        setTagValue("")
    }

    const addTagCancel = () => {
        setAddNewTag(false)
        setNewTag("")
    }

    const createTag = () => {
        const payload = {
            tagLabel: newTag,
            tagCategoryId: 9,
            leadsId: leadId.toString(),
            tagId: 0
        }
        createNewTag(payload);
        setAddNewTag(false)
        setNewTag("")
    }


    const handleTagValueChange = useCallback((event) => {
        setTagValue(event.target.value);
    }, [setTagValue]);

    const handleNewTagChange = useCallback((event) => {
        setNewTag(event.target.value);
    }, [setNewTag]);


    const AddNewTag = () => {
        return (
            <>
                {addNewTag ?
                    <div className={styles.editTagContainer}>
                        <Box width={"50%"} marginLeft={"10px"}>
                            <TextField
                                id="outlined-basic"
                                variant="outlined"
                                value={newTag}
                                onChange={handleNewTagChange}
                                size="small"
                                placeholder='Tag Name'
                            />
                        </Box>
                        <div className={styles.createActionIcons}>
                            <div onClick={addTagCancel}><HighlightOffIcon sx={{ color: "#F44336", cursor: "pointer" }} /></div>
                            <div onClick={createTag}><AddCircleOutlineIcon color="primary" sx={{ cursor: "pointer", }} /></div>
                        </div>
                    </div> :
                    <Box marginLeft={"10px"}>
                        <Button
                            label={"Create"}
                            className={styles.addNewButton}
                            type="tertiary"
                            onClick={() => setAddNewTag(true)}
                            icon={<AddCircleOutlineIcon sx={{ color: "#4178ff" }} />}
                            iconPosition="right"
                        />
                    </Box>
                }
            </>

        )
    }




    const OtherTags = ({ item, }) => {
        return (
            <>
                {tagId === item?.id ?
                    <div className={styles.editTagContainer} key={item.label}   >
                        <Box width={"50%"} marginLeft={"10px"}>
                            <TextField
                                id="outlined-basic"
                                variant="outlined"
                                value={tagValue}
                                onChange={handleTagValueChange}
                                size="small"
                            />
                        </Box>
                        <div className={styles.createActionIcons}>
                            <div onClick={editCancel}><HighlightOffIcon sx={{ color: "#F44336", cursor: "pointer" }} /></div>
                            <div onClick={updateTag}><AddCircleOutlineIcon color="primary" sx={{ cursor: "pointer", }} /></div>
                        </div>
                    </div>
                    :
                    <div className={styles.itemContainer} key={item.label} >
                        <div className={styles.tabLabel} onClick={() => onSelectTag(item.id)} >
                            <div className={styles.tagIcon}>
                                {getIconName(label, item.label)}
                            </div>
                            <Label value={item.label} size="16px" color="#434A51" />
                        </div>

                        <div className={styles.actionIcons}>
                            <div onClick={() => deleteTags(item.id)}> <Delete /></div>

                            <div onClick={() => editTag(item.label, item.id)}><EditIcon /></div>
                            {selectedTags.includes(item.id) &&
                                <div>
                                    <CheckCircleOutlineIcon color="primary" />
                                </div>
                            }
                        </div>


                    </div>
                }

            </>
        )
    }

    const Tag = ({ item, }) => {
        return (
            <div className={styles.itemContainer} key={item.label}    >
                <div className={styles.tabLabel} onClick={() => onSelectTag(item.id)} >
                    <div className={styles.tagIcon}>
                        {getIconName(label, item.label)}
                    </div>
                    <Label value={item.label} size="16px" color="#434A51" />
                </div>
                <div>
                    {selectedTags.includes(item.id) && <CheckCircleOutlineIcon color="primary" />}
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.labelContainer} >
                <div className={`${styles.chevronIcon} ${open ? '' : styles.rotateIcon}`} onClick={() => setOpen(value => !value)} >
                    <Chevron />
                </div>
                <Label value={label} size="16px" color="#052A63" fontWeight="bold" />
                {/* <Info /> */}

            </div>

            {open && <div className={styles.itemsContainer}>
                {items.map(item => {
                    return (
                        <>
                            {label === "Other" ? (
                                <OtherTags item={item} />
                            )
                                :
                                <Tag item={item} />
                            }
                        </>
                    )
                }
                )}
            </div>
            }
            {label === "Other" && open &&
                <Box sx={{ padding: "9px 12px" }}>
                    <AddNewTag />
                </Box>
            }
        </div >
    )
}

