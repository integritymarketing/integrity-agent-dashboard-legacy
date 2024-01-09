import React, { useEffect, useState } from "react";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import TagIcon from "images/Tag.png";
import RecommendationIcon from "images/recommendation.png";
import { useOverView } from "providers/ContactDetails";

import useToast from "hooks/useToast";

import { AddNewTagModal } from "components/ContactDetailsContainer/ContactDetailsModals/AddNewTagModal/AddNewTagModal";
import { AssignNewTagModal } from "components/ContactDetailsContainer/ContactDetailsModals/AssignNewTagModal/AssignNewTagModal";
import { DeleteTagModal } from "components/ContactDetailsContainer/ContactDetailsModals/DeleteTagModal/DeleteTagModal";
import EditIcon from "components/icons/icon-edit";
import { Button } from "components/ui/Button";

import styles from "./AssignNewTagContainer.module.scss";

import { Chevron, CrossIcon, DataCenter, Delete, LeadCenter, LifeIcon, PlanEnroll } from "../../../Icons";

export const AssignNewTagContainer = ({ allTags, selectedTags, leadId }) => {
    const { removeLeadTags, editTagByID, createNewTag, editLeadTags } = useOverView();
    const [isDeleteTagModalOpen, setIsDeleteTagModalOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState(null);
    const [assignNewTagModal, setAssignNewTagModal] = useState(false);
    const [addNewTagModal, setAddNewTagModal] = useState(false);

    const [selectedCustomTags, setSelectedCustomTags] = useState([]);
    const [selectedTempTags, setSelectedTempTags] = useState([]);

    useEffect(() => {
        setSelectedTempTags(selectedTags);
        setSelectedCustomTags(selectedTags);
    }, [selectedTags]);

    const [editTag, setEditTag] = useState(null);

    const createTag = (label) => {
        const payload = {
            tagLabel: label,
            tagCategoryId: 9,
            leadsId: leadId,
            tagId: 0,
        };
        createNewTag(payload);
        setAddNewTagModal(false);
    };

    const deleteTags = () => {
        removeLeadTags(tagToDelete);
        setIsDeleteTagModalOpen(false);
    };

    const updateTag = (label, id) => {
        const payload = {
            tagId: id,
            tagLabel: label,
            tagCategoryId: 9,
            leadsId: leadId,
        };
        editTagByID(payload);
        setEditTag("");
    };

    const handleSelectTag = (id) => {
        if (!id) return;
        if (selectedCustomTags.includes(id)) {
            setSelectedCustomTags(selectedCustomTags.filter((item) => item !== id));
        } else {
            setSelectedCustomTags([...selectedCustomTags, id]);
        }
    };

    const onSave = () => {
        const payload = {
            leadId: leadId,
            tagIds: [...selectedCustomTags],
        };
        editLeadTags(payload);
    };

    return (
        <div className={styles.container}>
            <Box marginLeft={"10px"}>
                <Button
                    label={"Assign New Tag"}
                    className={styles.addNewButton}
                    type="tertiary"
                    onClick={() => setAssignNewTagModal(true)}
                    icon={<AddCircleOutlineIcon sx={{ color: "#4178ff" }} />}
                    iconPosition="left"
                />
            </Box>

            {isDeleteTagModalOpen && (
                <DeleteTagModal
                    open={isDeleteTagModalOpen}
                    onClose={() => setIsDeleteTagModalOpen(false)}
                    onConfirm={deleteTags}
                    label="Delete Tag"
                    body="This tag is assigned to you. Would you like to permanently delete this tag?"
                />
            )}

            {assignNewTagModal && (
                <AssignNewTagModal
                    open={assignNewTagModal}
                    onClose={() => {
                        setAssignNewTagModal(false);
                        setSelectedCustomTags(selectedTempTags);
                    }}
                    allTags={allTags}
                    onSave={onSave}
                    selectedTags={selectedCustomTags}
                    setAddNewTagModal={() => {
                        setAssignNewTagModal(false);
                        setAddNewTagModal(true);
                    }}
                    setEditTag={(tag) => {
                        setAssignNewTagModal(false);
                        setEditTag(tag);
                        setAddNewTagModal(true);
                    }}
                    setDeleteTag={(tag) => {
                        setAssignNewTagModal(false);
                        setTagToDelete(tag);
                        setIsDeleteTagModalOpen(true);
                    }}
                    onSelectTag={handleSelectTag}
                    selectedTempTags={selectedTempTags}
                />
            )}
            {addNewTagModal && (
                <AddNewTagModal
                    open={setAddNewTagModal}
                    onClose={() => {
                        setAddNewTagModal(false);
                        setEditTag(null);
                    }}
                    onSave={editTag ? updateTag : createTag}
                    isEdit={editTag}
                />
            )}
        </div>
    );
};
