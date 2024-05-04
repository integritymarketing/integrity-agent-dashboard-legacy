import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useOverView } from "providers/ContactDetails";
import { DeleteTagModal } from "components/ContactDetailsContainer/ContactDetailsModals/DeleteTagModal/DeleteTagModal";
import AssignNewTagContainer from "./AssignNewTagsContainer/AssignNewTagContainer";
import { InfoModal } from "../InfoModal/InfoModal";
import Label from "../../CommonComponents/Label";
import { Chevron, Info } from "../../Icons";
import Tags from "./Tags";
import ProductTags from "./ProductTags";
import OtherTags from "./OtherTags";
import useAnalytics from "hooks/useAnalytics";
import styles from "./TagsList.module.scss";

const labelMap = {
    Other: "Custom Tags",
    "Ask Integrity Recommendations": "Ask Integrity Suggests",
};

const labelMapAmplitude = {
    Other: "custom_tags",
    "Ask Integrity Recommendations": "ask_Integrity_suggestions",
    Products: "products",
    Campaigns: "campaigns",
};

export const TagsList = ({ label, items, selectedTags, leadId, setTagValue, setTagId, categoryID, isMobile }) => {
    const { editLeadTags } = useOverView();
    const { fireEvent } = useAnalytics();
    const [isDeleteTagModalOpen, setIsDeleteTagModalOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState(null);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [infoTag, setInfoTag] = useState(null);
    const [open, setOpen] = useState(false);

    const prettyLabel = labelMap[label] || label;
    const prettyLabelAmplitude = labelMapAmplitude[label] || label;

    useEffect(() => {
        setTagId(null);
        setTagValue("");
    }, []);

    useEffect(() => {
        setOpen(label === "Ask Integrity Recommendations" || label === "Campaigns");
    }, [label]);

    const openDeleteTagModal = useCallback((tagId) => {
        setTagToDelete(tagId);
        setIsDeleteTagModalOpen(true);
    }, []);

    const deleteTags = useCallback(() => {
        editLeadTags({
            leadId,
            tagIds: selectedTags.filter((item) => item !== tagToDelete),
        });
        setIsDeleteTagModalOpen(false);
    }, [editLeadTags, leadId, selectedTags, tagToDelete]);

    const toggleOpen = useCallback(() => {
        setOpen((prevOpen) => {
            const action = prevOpen ? "collapsed" : "expanded";
            fireEvent("Tag Section Interaction", {
                leadId,
                tagSection: prettyLabelAmplitude,
                action,
            });
            return !prevOpen;
        });
    }, [fireEvent, leadId, prettyLabelAmplitude]);

    const renderItems = useCallback(
        (item) => {
            if (label === "Other" && selectedTags.includes(item.id)) {
                return (
                    <OtherTags item={item} label={label} isMobile={isMobile} openDeleteTagModal={openDeleteTagModal} />
                );
            } else if (label === "Products") {
                return <ProductTags item={item} label={label} />;
            }
            return <Tags item={item} label={label} />;
        },
        [label, selectedTags, isMobile, openDeleteTagModal]
    );

    return (
        <div className={styles.container}>
            <div className={styles.labelContainer}>
                <div className={styles.chevronLabelContainer}>
                    <div className={`${styles.chevronIcon} ${open ? "" : styles.rotateIcon}`} onClick={toggleOpen}>
                        <Chevron />
                    </div>
                    <Label value={prettyLabel} size="16px" color="#052A63" fontWeight="bold" />
                </div>
                <div
                    className={styles.infoIcon}
                    onClick={() => {
                        setInfoTag(label);
                        setInfoModalOpen(true);
                        fireEvent("Contact Profile Tag Interaction", {
                            leadid: leadId,
                        });
                    }}
                    style={{ cursor: "pointer" }}
                >
                    <Info />
                </div>
            </div>

            {open && <div className={styles.itemsContainer}>{items.map(renderItems)}</div>}

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
                    isMobile={isMobile}
                />
            )}
            {infoModalOpen && (
                <InfoModal
                    leadId={leadId}
                    open={infoModalOpen}
                    onClose={() => setInfoModalOpen(false)}
                    label={infoTag}
                />
            )}
        </div>
    );
};

TagsList.propTypes = {
    label: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    selectedTags: PropTypes.arrayOf(PropTypes.string).isRequired,
    leadId: PropTypes.string.isRequired,
    setTagValue: PropTypes.func.isRequired,
    setTagId: PropTypes.func.isRequired,
    categoryID: PropTypes.string,
    isMobile: PropTypes.bool.isRequired,
};
