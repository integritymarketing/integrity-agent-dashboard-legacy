import PropTypes from "prop-types";
import styles from "./TagsList.module.scss";
import Label from "../../CommonComponents/Label";
import renderTagsIcon from "./renderTagsIcons";

const ProductTags = ({ item, label }) => (
    <div key={item.label} className={styles.itemContainer}>
        <div className={styles.tabLabel}>
            <div className={styles.tagIcon}>
                {renderTagsIcon(label, item.label, item?.tag?.metadata, item.tag?.tagIconUrl)}
            </div>
            <Label value={item.label} size="16px" color="#434A51" />
        </div>
    </div>
);

ProductTags.propTypes = {
    item: PropTypes.shape({
        label: PropTypes.string.isRequired,
        tag: PropTypes.shape({
            metadata: PropTypes.any,
            tagIconUrl: PropTypes.string,
        }),
    }).isRequired,
    label: PropTypes.string.isRequired,
};

export default ProductTags;
