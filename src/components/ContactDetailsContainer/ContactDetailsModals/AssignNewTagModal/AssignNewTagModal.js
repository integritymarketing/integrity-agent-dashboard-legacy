import React, { useCallback, useEffect, useMemo, useState } from "react";

import Box from "@mui/material/Box";

import TagIcon from "images/Tag.png";

import {
    Chevron,
    CrossIcon,
    DataCenter,
    Delete,
    LeadCenter,
    LifeIcon,
    PlanEnroll,
} from "components/ContactDetailsContainer/OverviewContainer/Icons";
import Modal from "components/Modal";
import EditIcon from "components/icons/icon-edit";
import { Button } from "components/ui/Button";

import styles from "./AssignNewTagModal.module.scss";

import Label from "../../OverviewContainer/CommonComponents/Label";
import { Add, AddForward } from "../Icons";

const tags = [{ label: "One" }, { label: "two" }, { label: "three" }, { label: "four" }];

export const AssignNewTagModal = ({
    open,
    onClose,
    onSave,
    allTags = [],
    selectedTags,
    setAddNewTagModal,
    setEditTag,
    setDeleteTag,
    onSelectTag,
    selectedTempTags,
}) => {
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

    const Tag = ({ item }) => {
        const [hovered, setHovered] = useState(null);
        return (
            <div
                className={`${styles.itemContainer} ${selectedTags?.includes(item?.id) ? styles.selectedItem : ""}`}
                key={item?.label}
                onMouseOver={() => setHovered(item?.label)}
                onMouseLeave={() => setHovered(null)}
            >
                <div className={styles.tabLabel} onClick={() => onSelectTag(item?.id)}>
                    <div className={styles.tagIcon}>
                        <img alt="TagIcon" src={TagIcon} />
                    </div>
                    <Label value={item?.label} size="16px" color="#434A51" />
                </div>

                <div className={styles.actionIcons}>
                    {hovered === item?.label && (
                        <>
                            <div onClick={() => setEditTag(item?.id, item.label)}>
                                <EditIcon />
                            </div>
                            <div onClick={() => setDeleteTag(item?.id)}>
                                <Delete />
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
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
                                flexDirection: "row",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                                width: "100%",
                                marginTop: "10px",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    width: "45%",
                                }}
                            >
                                {allTags?.map((item, i) => {
                                    if (i >= 0 && i < allTags.length / 2) {
                                        return <Tag item={item} />;
                                    }
                                })}
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    width: "45%",
                                }}
                            >
                                {allTags?.map((item, j) => {
                                    if (j >= allTags.length / 2 && j <= allTags.length - 1) {
                                        return <Tag item={item} />;
                                    }
                                })}
                            </Box>
                        </Box>
                        <Box>
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
        </>
    );
};
