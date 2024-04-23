import { useState } from "react";
import PropTypes from "prop-types";
import Label from "../../OverviewContainer/CommonComponents/Label";
import EditIcon from "components/icons/icon-edit";
import { Delete } from "components/ContactDetailsContainer/OverviewContainer/Icons";
import TagIcon from "images/Tag.png";
import styles from "./AssignNewTagModal.module.scss";

const Tag = ({ item, onSelect, onEdit, onDelete, isSelected, isMobile }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`${styles.selectableItemContainer} ${isSelected ? styles.selectedItem : ""}`}
            onMouseOver={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onSelect(item.tagId)}
        >
            <div className={styles.tabLabel}>
                <div className={styles.tagIcon}>
                    <img alt="TagIcon" src={TagIcon} />
                </div>
                <Label value={item.tagLabel} size="16px" color="#434A51" width={"110px"} wordBreak={"break-all"} />
            </div>
            {(hovered || isMobile) && (
                <div className={styles.actionIcons}>
                    <div onClick={() => onEdit(item.tagId, item.tagLabel)}>
                        <EditIcon />
                    </div>
                    <div onClick={() => onDelete(item.id)}>
                        <Delete />
                    </div>
                </div>
            )}
        </div>
    );
};

Tag.propTypes = {
    item: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
};

export default Tag;
