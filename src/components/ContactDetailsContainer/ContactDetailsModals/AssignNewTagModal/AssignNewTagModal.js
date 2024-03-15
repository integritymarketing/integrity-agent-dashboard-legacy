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

const Tag = React.memo(({ item, onSelect, onEdit, onDelete, isSelected, isMobile }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`${styles.selectableItemContainer} ${isSelected ? styles.selectedItem : ""}`}
            onMouseOver={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onSelect(item.id)}
        >
            <div className={styles.tabLabel}>
                <div className={styles.tagIcon}>
                    <img alt="TagIcon" src={TagIcon} />
                </div>
                <Label value={item.label} size="16px" color="#434A51" width={"110px"} wordBreak={"break-all"} />
            </div>

            {(hovered || isMobile) && (
                <div className={styles.actionIcons}>
                    <div onClick={() => onEdit(item.id, item.label)}>
                        <EditIcon />
                    </div>
                    <div onClick={() => onDelete(item.id)}>
                        <Delete />
                    </div>
                </div>
            )}
        </div>
    );
});

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
    isMobile,
}) => {
    const isDisabled = useMemo(() => {
        const sortedSelectedTags = [...selectedTags].sort();
        const sortedTempTags = [...selectedTempTags].sort();
        return JSON.stringify(sortedSelectedTags) === JSON.stringify(sortedTempTags);
    }, [selectedTags, selectedTempTags]);

    const handleSelectTag = useCallback(
        (tagId) => {
            onSelectTag(tagId);
        },
        [onSelectTag]
    );

    const handleEditTag = useCallback(
        (tagId, label) => {
            setEditTag(tagId, label);
        },
        [setEditTag]
    );

    const handleDeleteTag = useCallback(
        (tagId) => {
            setDeleteTag(tagId);
        },
        [setDeleteTag]
    );

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
                                                key={item.id}
                                                item={item}
                                                onSelect={handleSelectTag}
                                                onEdit={handleEditTag}
                                                onDelete={handleDeleteTag}
                                                isSelected={selectedTags.includes(item.id)}
                                                isMobile={isMobile}
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
                                                key={item.id}
                                                item={item}
                                                onSelect={handleSelectTag}
                                                onEdit={handleEditTag}
                                                onDelete={handleDeleteTag}
                                                isSelected={selectedTags.includes(item.id)}
                                                isMobile={isMobile}
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
        </>
    );
};
