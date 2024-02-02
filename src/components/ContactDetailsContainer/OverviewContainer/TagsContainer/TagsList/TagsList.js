import React, { useEffect, useState } from "react";


import TagIcon from "images/Tag.png";
import RecommendationIcon from "images/recommendation.png";
import { useOverView } from "providers/ContactDetails";



import { DeleteTagModal } from "components/ContactDetailsContainer/ContactDetailsModals/DeleteTagModal/DeleteTagModal";


import { AssignNewTagContainer } from "./AssignNewTagsContainer/AssignNewTagContainer";
import styles from "./TagsList.module.scss";

import Label from "../../CommonComponents/Label";
import { Chevron, CrossIcon, DataCenter, Delete, LeadCenter, LifeIcon, PlanEnroll } from "../../Icons";

const getIconName = (label, itemLabel, metadata) => {
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
            } else if (itemLabel?.includes("PE") || metadata?.includes("PlanEnroll")) {
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

export const TagsList = ({ label, items, selectedTags, leadId, setTagValue, tagId, setTagId, categoryID }) => {
    const { editLeadTags } = useOverView();
    const [isDeleteTagModalOpen, setIsDeleteTagModalOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState(null);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        setTagId(null);
        setTagValue("");
    }, []);

    useEffect(() => {
        if (label === "Ask Integrity Recommendations" || label === "Campaigns") {
            setOpen(true);
        }
    }, [label]);

    const onSelectTag = (id) => {
        if (!id || label === "Ask Integrity Recommendations" || label === "Campaigns") return;
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
        const payload = {
            leadId: leadId,
            tagIds: selectedTags.filter((item) => item !== tagToDelete),
        };
        editLeadTags(payload);
        setIsDeleteTagModalOpen(false);
    };

    const Tag = ({ item }) => {
        return (
            <div key={item.label} className={styles.itemContainer}>
                <div className={styles.tabLabel}>
                    <div className={styles.tagIcon}>{getIconName(label, item.label, item?.tag?.metadata)}</div>
                    <Label value={item.label} size="16px" color="#434A51" />
                </div>
            </div>
        );
    };

    const ProductTags = ({ item }) => {
        return (
            <div
                key={item.label}
                className={`${styles.selectableItemContainer} ${selectedTags?.includes(item?.id) ? styles.selectedItem : ""
                    }`}
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
                    className={styles.selectableItemContainer}
                    key={item?.label}
                    onMouseEnter={() => setHovered(item?.label)}
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
                    value={label === "Other" ? "Custom Tags" : label}
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
                                {label === "Other" && (
                                    <>{selectedTags.includes(item.id) && <OtherTags item={item} tagId={tagId} />}</>
                                )}

                                {label === "Products" && <ProductTags item={item} />}
                                {label !== "Products" && label !== "Other" && <Tag item={item} />}
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
            {label === "Other" && open && (
                <AssignNewTagContainer
                    allTags={items}
                    selectedTags={selectedTags}
                    leadId={leadId}
                    categoryID={categoryID}
                />
            )}
        </div>
    );
};
