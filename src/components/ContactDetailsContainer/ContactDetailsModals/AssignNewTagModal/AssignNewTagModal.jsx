import PropTypes from "prop-types";
import { useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Modal from "components/Modal";
import { useOverView } from "providers/ContactDetails";
import Tag from "./Tag";
import { Button } from "components/ui/Button";
import { Add, AddForward } from "../Icons";
import styles from "./AssignNewTagModal.module.scss";

export const AssignNewTagModal = ({
    open,
    onClose,
    onSave,
    selectedTags,
    setAddNewTagModal,
    setEditTag,
    setDeleteTag,
    onSelectTag,
    selectedTempTags,
    isMobile,
    leadId,
}) => {
    const { tags } = useOverView();
    const allTags =
        tags?.find((category) => category.parentTagCategoryId === null && category.tagCategoryName === "Other")?.tags ||
        [];

    const isDisabled = useMemo(() => {
        const sortedSelectedTags = [...selectedTags].sort();
        const sortedTempTags = [...selectedTempTags].sort();
        return JSON.stringify(sortedSelectedTags) === JSON.stringify(sortedTempTags);
    }, [selectedTags, selectedTempTags]);

    const handleSelectTag = useCallback((tagId) => onSelectTag(tagId), [onSelectTag]);
    const handleEditTag = useCallback((tagId, label) => setEditTag(tagId, label), [setEditTag]);
    const handleDeleteTag = useCallback((tagId) => setDeleteTag(tagId), [setDeleteTag]);

    return (
        <Modal
            maxWidth="sm"
            open={open}
            onClose={onClose}
            onCancel={onClose}
            title={"Assign Tag to Contact"}
            onSave={onSave}
            actionButtonName={"Save"}
            actionButtonDisabled={isDisabled}
            endIcon={<AddForward />}
        >
            <Box className={styles.connectModalBody}>
                <Box className={styles.headerText} marginTop={"20px"}>
                    Select from the tags below to assign to contact
                </Box>
                <Box className={styles.leadTagsList} marginTop={"10px"}>
                    <div className={styles.headerText}>Agent Custom Tags</div>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            justifyContent: "space-between",
                            width: "100%",
                            marginTop: "10px",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: isMobile ? "100%" : "48%",
                            }}
                        >
                            {allTags?.map((item, i) => {
                                if (i >= 0 && i < allTags.length / 2) {
                                    return (
                                        <Tag
                                            key={item.tagId}
                                            item={item}
                                            onSelect={handleSelectTag}
                                            onEdit={handleEditTag}
                                            onDelete={handleDeleteTag}
                                            isSelected={selectedTags.includes(item.tagId)}
                                            isMobile={isMobile}
                                            leadId={leadId}
                                        />
                                    );
                                }
                            })}
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: isMobile ? "100%" : "48%",
                            }}
                        >
                            {allTags?.map((item, j) => {
                                if (j >= allTags.length / 2 && j <= allTags.length - 1) {
                                    return (
                                        <Tag
                                            key={item.tagId}
                                            item={item}
                                            onSelect={handleSelectTag}
                                            onEdit={handleEditTag}
                                            onDelete={handleDeleteTag}
                                            isSelected={selectedTags.includes(item.tagId)}
                                            isMobile={isMobile}
                                            leadId={leadId}
                                        />
                                    );
                                }
                            })}
                        </Box>
                    </Box>
                    <Box marginTop={"10px"}>
                        <Button
                            label={"Create New Tag"}
                            className={styles.addNewButton}
                            type="tertiary"
                            onClick={setAddNewTagModal}
                            icon={<Add color="#4178ff" />}
                            iconPosition="left"
                        />
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

AssignNewTagModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    selectedTags: PropTypes.array.isRequired,
    setAddNewTagModal: PropTypes.func.isRequired,
    setEditTag: PropTypes.func.isRequired,
    setDeleteTag: PropTypes.func.isRequired,
    onSelectTag: PropTypes.func.isRequired,
    selectedTempTags: PropTypes.array.isRequired,
    isMobile: PropTypes.bool.isRequired,
    leadId: PropTypes.string.isRequired,
};
