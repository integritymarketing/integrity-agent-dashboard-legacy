import PropTypes from "prop-types";
import Label from "../../CommonComponents/Label";
import renderTagsIcon from "./renderTagsIcons";
import styles from "./TagsList.module.scss";

const Tag = ({ item, label }) => (
    <div className={styles.itemContainer}>
        <div className={styles.tabLabel}>
            <div className={styles.tagIcon}>
                {renderTagsIcon(label, item.label, item?.tag?.metadata, item.tag?.tagIconUrl)}
            </div>
            <Label value={item.label} size="16px" color="#434A51" />
        </div>
    </div>
);

Tag.propTypes = {
    item: PropTypes.shape({
        label: PropTypes.string.isRequired,
        tag: PropTypes.shape({
            metadata: PropTypes.any,
            tagIconUrl: PropTypes.string,
        }),
    }).isRequired,
    label: PropTypes.string.isRequired,
};

export default Tag;
