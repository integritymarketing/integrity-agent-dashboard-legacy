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

import { DeleteTagModal } from "components/ContactDetailsContainer/ContactDetailsModals/DeleteTagModal/DeleteTagModal";
import EditIcon from "components/icons/icon-edit";
import { Button } from "components/ui/Button";

import { AssignNewTagContainer } from "./AssignNewTagsContainer/AssignNewTagContainer";
import styles from "./TagsList.module.scss";

import Label from "../../CommonComponents/Label";
import { Chevron, CrossIcon, DataCenter, Delete, LeadCenter, LifeIcon, PlanEnroll } from "../../Icons";

const isTagValid = (tag) => {
    // Regular expression to match the tag against the criteria
    const validTagRegex = /^(?=[\w\s-]{2,10}$)(?!.*[\s-]{2})[^-\s_][\w\s-]*[^-\s_]$/;

    // \w matches any word character (equivalent to [a-zA-Z0-9_])
    // \s matches any whitespace character (spaces)
    // The lookahead (?=[\w\s-]{2,10}$) checks the length and allowed characters
    // The negative lookahead (?!.*[\s-]{2}) ensures no consecutive spaces or hyphens
    // [^-\s_] at the beginning and end asserts the string does not start or end with hyphen, space, or underscore

    return validTagRegex.test(tag);
};

const getIconName = (label, itemLabel) => {
    switch (label) {
        case "Products":
            if (itemLabel === "FE") {
                return <LifeIcon />;
            } else {
                return <CrossIcon />;
            }
        case "Campaigns":
            if (itemLabel === "LEADCENTER") {
                return <LeadCenter />;
            } else if (itemLabel.includes("PE")) {
                return <PlanEnroll />;
            } else if (itemLabel === "DATA LEAD") {
                return <DataCenter />;
            } else {
                return <img alt="TagIcon" src={TagIcon} />;
            }
        case "Ask Integrity Recommendations":
            return <img alt="RecommendationIcon" src={RecommendationIcon} />;

        default:
            return <img alt="TagIcon" src={TagIcon} />;
    }
};

export const TagsList = ({ label, items, selectedTags, leadId, setTagValue, tagId, setTagId }) => {
    const { removeLeadTags, editLeadTags } = useOverView();
    const [isDeleteTagModalOpen, setIsDeleteTagModalOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState(null);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        setTagId(null);
        setTagValue("");
    }, []);

    useEffect(() => {
        if (label === "Ask Integrity Recommendations") {
            setOpen(true);
        }
    }, [label]);

    const onSelectTag = (id) => {
        if (!id || label === "Ask Integrity Recommendations") return;
        if (selectedTags.includes(id)) {
            const payload = {
                leadId: leadId,
                tagIds: selectedTags.filter((item) => item !== id),
            };
            editLeadTags(payload);
        } else {
            const payload = {
                leadId: leadId,
                tagIds: [...selectedTags, id],
            };
            editLeadTags(payload);
        }
    };

    const openDeleteTagModal = (tagId) => {
        setTagToDelete(tagId);
        setIsDeleteTagModalOpen(true);
    };

    const deleteTags = () => {
        removeLeadTags(tagToDelete);
        setIsDeleteTagModalOpen(false);
    };

    const Tag = ({ item }) => {
        return (
            <div
                key={item.label}
                className={`${styles.itemContainer} ${
                    selectedTags?.includes(item?.id) && label === "Products" ? styles.selectedItem : ""
                } ${label === "Products" ? styles.hoverEffect : ""}`}
                onClick={() => onSelectTag(item.id)}
            >
                <div className={styles.tabLabel}>
                    <div className={styles.tagIcon}>{getIconName(label, item.label)}</div>
                    <Label value={item.label} size="16px" color="#434A51" />
                </div>
            </div>
        );
    };

    const OtherTags = ({ item }) => {
        const [hovered, setHovered] = useState(null);

        return (
            <>
                <div
                    className={styles.itemContainer}
                    key={item?.label}
                    onMouseOver={() => setHovered(item?.label)}
                    onMouseLeave={() => setHovered(null)}
                >
                    <div className={styles.tabLabel}>
                        <div className={styles.tagIcon}>{getIconName(label, item?.label)}</div>
                        <Label value={item?.label} size="16px" color="#434A51" />
                    </div>

                    <div className={styles.actionIcons}>
                        {hovered === item?.label && (
                            <div onClick={() => openDeleteTagModal(item?.id)}>
                                <Delete />
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.labelContainer}>
                <div
                    className={`${styles.chevronIcon} ${open ? "" : styles.rotateIcon}`}
                    onClick={() => setOpen((value) => !value)}
                >
                    <Chevron />
                </div>
                <Label
                    value={label === "Other" ? "Custom tags" : label}
                    size="16px"
                    color="#052A63"
                    fontWeight="bold"
                />
                {/* <Info /> */}
            </div>

            {open && (
                <div className={styles.itemsContainer}>
                    {items.map((item) => {
                        return (
                            <>
                                {label === "Other" ? (
                                    <>{selectedTags.includes(item.id) && <OtherTags item={item} tagId={tagId} />}</>
                                ) : (
                                    <Tag item={item} />
                                )}
                            </>
                        );
                    })}
                </div>
            )}

            {isDeleteTagModalOpen && (
                <DeleteTagModal
                    open={isDeleteTagModalOpen}
                    onClose={() => setIsDeleteTagModalOpen(false)}
                    onConfirm={deleteTags}
                    label="Remove Tag"
                    body="Would you like to remove this tag from this contact?"
                />
            )}
            {label === "Other" && items?.length < 11 && open && (
                <AssignNewTagContainer allTags={items} selectedTags={selectedTags} leadId={leadId} />
            )}
        </div>
    );
};
