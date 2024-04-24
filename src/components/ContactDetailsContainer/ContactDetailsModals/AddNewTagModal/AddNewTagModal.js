import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import useToast from "hooks/useToast";
import Modal from "components/Modal";
import { AddForward } from "../Icons";
import useAnalytics from "hooks/useAnalytics";
import styles from "./AddNewTagModal.module.scss";

const isValidTag = (tag) => {
    const validTagRegex =
        /^(?=[\w\s-_]{2,18}$)(?!(?:.*[\s]){2,})(?!(?:.*[-]){2,})(?!(?:.*[_]){2,})[^-\s_][\w\s-]*[^-\s_]$/;
    return validTagRegex.test(tag);
};

export const AddNewTagModal = ({ open, onClose, onSave, isEdit, leadId }) => {
    const [newTag, setNewTag] = useState("");
    const showToast = useToast();
    const { fireEvent } = useAnalytics();

    useEffect(() => {
        if (isEdit) {
            setNewTag(isEdit);
        }
    }, [isEdit]);

    const handleCreateTag = () => {
        if (!isValidTag(newTag)) {
            showToast({
                type: "error",
                message: `Tag length should be between 2 and 18, and only allow alphanumeric, single space, single hyphen(-), single underscore(_)`,
            });
        } else {
            onSave(newTag);
            fireEvent("Tag Assignment Change", { leadId, tag_name: newTag });
        }
    };

    return (
        <>
            <Modal
                maxWidth="xs"
                open={open}
                onClose={onClose}
                onCancel={onClose}
                title={isEdit ? "Rename Tag" : "Create New Tag"}
                onSave={handleCreateTag}
                actionButtonName={isEdit ? "Save Tag" : "Create Tag"}
                endIcon={<AddForward />}
            >
                <Box className={styles.connectModalBody}>
                    <Box className={styles.leadTagsList} marginTop={"10px"}>
                        <div className={styles.headerText}>New Tag Name</div>
                        <Box>
                            <Box width={"50%"}>
                                <TextField
                                    id="outlined-basic"
                                    variant="outlined"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    size="small"
                                    placeholder="Name New tag"
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

AddNewTagModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    isEdit: PropTypes.string,
    leadId: PropTypes.string.isRequired,
};
