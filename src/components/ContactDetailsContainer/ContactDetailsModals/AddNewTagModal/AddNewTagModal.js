import React, { useCallback, useEffect, useMemo, useState } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import useToast from "hooks/useToast";

import Modal from "components/Modal";

import styles from "./AddNewTagModal.module.scss";

import Label from "../../OverviewContainer/CommonComponents/Label";
import { Add, AddForward } from "../Icons";

/**
 * Validates if the given tag meets specific criteria.
 *
 * Criteria:
 * - Length between 2 to 10 characters.
 * - Can include alphanumeric characters, single spaces, single hyphens (-), and single underscores (_).
 * - Cannot start or end with a hyphen, space, or underscore.
 * - No consecutive spaces or hyphens are allowed.
 *
 * @param {string} tag The tag to validate.
 * @returns {boolean} True if the tag is valid, false otherwise.
 */
const isValidTag = (tag) => {
    // Regular expression to match the tag against the criteria
    const validTagRegex =
        /^(?=[\w\s-_]{2,10}$)(?!(?:.*[\s]){2,})(?!(?:.*[-]){2,})(?!(?:.*[_]){2,})[^-\s_][\w\s-]*[^-\s_]$/;

    // \w matches any word character (equivalent to [a-zA-Z0-9_])
    // \s matches any whitespace character (spaces)
    // The lookahead (?=[\w\s-]{2,10}$) checks the length and allowed characters
    // The negative lookahead (?!.*[\s-]{2}) ensures no consecutive spaces or hyphens
    // [^-\s_] at the beginning and end asserts the string does not start or end with hyphen, space, or underscore

    return validTagRegex.test(tag);
};

export const AddNewTagModal = ({ open, onClose, onSave, isEdit }) => {
    const [newTag, setNewTag] = useState("");
    const showToast = useToast();

    useEffect(() => {
        if (isEdit) {
            setNewTag(isEdit);
        }
    }, [isEdit]);

    const handleCreateTag = () => {
        if (!isValidTag(newTag)) {
            showToast({
                type: "error",
                message: `Tag length should be between 2 and 10, and only allow alphanumeric, single space, single hyphen(-), single underscore(_)`,
            });
        } else {
            onSave(newTag);
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
                            <Box width={"50%"} marginLeft={"10px"}>
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
