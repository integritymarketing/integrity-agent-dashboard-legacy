import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useOverView, useLeadDetails } from "providers/ContactDetails";
import { AddNewTagModal } from "components/ContactDetailsContainer/ContactDetailsModals/AddNewTagModal/AddNewTagModal";
import { AssignNewTagModal } from "components/ContactDetailsContainer/ContactDetailsModals/AssignNewTagModal/AssignNewTagModal";
import { DeleteTagModal } from "components/ContactDetailsContainer/ContactDetailsModals/DeleteTagModal/DeleteTagModal";
import { Button } from "components/ui/Button";
import useAnalytics from "hooks/useAnalytics";
import styles from "./AssignNewTagContainer.module.scss";

const AssignNewTagContainer = ({ allTags, selectedTags, leadId, categoryID, isMobile }) => {
    const { removeLeadTags, editTagByID, createNewTag, editLeadTags, tags } = useOverView();
    const { getLeadDetails } = useLeadDetails();
    const { fireEvent } = useAnalytics();
    const [isDeleteTagModalOpen, setIsDeleteTagModalOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState(null);
    const [assignNewTagModal, setAssignNewTagModal] = useState(false);
    const [addNewTagModal, setAddNewTagModal] = useState(false);
    const [selectedCustomTags, setSelectedCustomTags] = useState();
    const [editTagId, setEditTagId] = useState(null);
    const [editTagValue, setEditTagValue] = useState("");

    useEffect(() => {
        setSelectedCustomTags(selectedTags);
    }, [selectedTags]);

    const createTag = (label) => {
        const payload = {
            tagLabel: label,
            tagCategoryId: categoryID,
            leadsId: leadId,
            tagId: 0,
        };
        createNewTag(payload);
        setAddNewTagModal(false);
    };

    const deleteTags = async () => {
        await removeLeadTags(tagToDelete);
        setIsDeleteTagModalOpen(false);
        await getLeadDetails(leadId);
    };

    const updateTag = (label) => {
        const payload = {
            tagId: editTagId,
            tagLabel: label,
            tagCategoryId: categoryID,
            leadsId: leadId,
        };
        editTagByID(payload);
        setAddNewTagModal(false);
        setEditTagId(null);
        setEditTagValue("");
    };

    const handleSelectTag = (id) => {
        if (!id) {
            return;
        }
        if (selectedCustomTags?.includes(id)) {
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
        setAssignNewTagModal(false);

        const customTags =
            tags?.find((category) => category.parentTagCategoryId === null && category.tagCategoryName === "Other")
                ?.tags || [];

        const newlySelectedTabLabels = customTags
            .filter(
                (tag) =>
                    (selectedCustomTags.includes(tag.tagId) && !selectedTags.includes(tag.tagId)) ||
                    (!selectedCustomTags.includes(tag.tagId) && selectedTags.includes(tag.tagId))
            )
            .map((tag) => tag.tagLabel);
        fireEvent("Tag Assignment Change", { leadId, tag_name: newlySelectedTabLabels.join(", ") });
    };

    return (
        <div className={styles.container}>
            <Button
                label={"Assign New Tag"}
                className={styles.addNewButton}
                type="tertiary"
                onClick={() => {
                    setAssignNewTagModal(true);
                    fireEvent("Contact Profile Tag Interaction", {
                        leadid: leadId,
                    });
                }}
                icon={<AddCircleOutlineIcon sx={{ color: "#4178ff" }} />}
                iconPosition="left"
            />

            {isDeleteTagModalOpen && (
                <DeleteTagModal
                    open={isDeleteTagModalOpen}
                    onClose={() => setIsDeleteTagModalOpen(false)}
                    onConfirm={deleteTags}
                    label="Delete Tag"
                    body="Would you like to permanently delete this tag?"
                />
            )}

            {assignNewTagModal && (
                <AssignNewTagModal
                    open={assignNewTagModal}
                    onClose={() => {
                        setAssignNewTagModal(false);
                        setSelectedCustomTags(selectedTags);
                        fireEvent("Closed Tag Filter");
                    }}
                    allTags={allTags}
                    onSave={onSave}
                    selectedTags={selectedCustomTags}
                    setAddNewTagModal={() => {
                        setAssignNewTagModal(false);
                        setAddNewTagModal(true);
                    }}
                    setEditTag={(id, label) => {
                        setAssignNewTagModal(false);
                        setEditTagId(id);
                        setEditTagValue(label);
                        setAddNewTagModal(true);
                    }}
                    setDeleteTag={(tag) => {
                        setAssignNewTagModal(false);
                        setTagToDelete(tag);
                        setIsDeleteTagModalOpen(true);
                    }}
                    onSelectTag={handleSelectTag}
                    selectedTempTags={selectedTags}
                    isMobile={isMobile}
                    leadId={leadId}
                />
            )}
            {addNewTagModal && (
                <AddNewTagModal
                    open={setAddNewTagModal}
                    onClose={() => {
                        setAddNewTagModal(false);
                        setEditTagId(null);
                        setEditTagValue("");
                        fireEvent("Closed Tag Filter");
                    }}
                    onSave={editTagId ? updateTag : createTag}
                    isEdit={editTagValue}
                    leadId={leadId}
                />
            )}
        </div>
    );
};

AssignNewTagContainer.propTypes = {
    allTags: PropTypes.array.isRequired,
    selectedTags: PropTypes.array.isRequired,
    leadId: PropTypes.number.isRequired,
    categoryID: PropTypes.number.isRequired,
    isMobile: PropTypes.bool.isRequired,
};

export default AssignNewTagContainer;
