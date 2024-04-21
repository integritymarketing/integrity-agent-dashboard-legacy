import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./TagsList.module.scss";
import Label from "../../CommonComponents/Label";
import renderTagsIcon from "./renderTagsIcons";
import { Delete } from "../../Icons";

const OtherTags = ({ item, label, isMobile, openDeleteTagModal }) => {
    const [hovered, setHovered] = useState(null);

    return (
        <div
            className={`${styles.selectableItemContainer} ${styles.itemContainer}`}
            key={item?.label}
            onMouseEnter={() => setHovered(item?.label)}
            onMouseLeave={() => setHovered(null)}
        >
            <div className={styles.tabLabel}>
                <div className={styles.tagIcon}>
                    {renderTagsIcon(label, item.label, item?.tag?.metadata, item.tag?.tagIconUrl)}
                </div>
                <Label value={item?.label} size="16px" color="#434A51" width={"140px"} wordBreak={"break-all"} />
            </div>
            <div className={styles.actionIcons}>
                {((hovered === item?.label && !isMobile) || isMobile) && (
                    <div onClick={() => openDeleteTagModal(item?.id)}>
                        <Delete />
                    </div>
                )}
            </div>
        </div>
    );
};

OtherTags.propTypes = {
    item: PropTypes.shape({
        label: PropTypes.string.isRequired,
        tag: PropTypes.shape({
            metadata: PropTypes.any,
            tagIconUrl: PropTypes.string,
        }),
    }).isRequired,
    label: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,
    openDeleteTagModal: PropTypes.func.isRequired,
};

export default OtherTags;
