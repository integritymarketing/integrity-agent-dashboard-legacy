import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";

import styles from "./styles.module.scss";

function TagCell({ row }) {
    const { layout } = useContactsListContext();

    return (
        <Box display="flex" gap="7px" flexWrap="wrap" alignItems={layout === "card" ? "center" : "left"}>
            {row.leadTags?.map((lt) => (
                <Box key={lt?.tag?.tagLabel} className={styles.tag}>
                    {lt.tag.tagLabel}
                </Box>
            ))}
        </Box>
    );
}

TagCell.propTypes = {
    row: PropTypes.shape({
        leadTags: PropTypes.array,
    }),
};

export default TagCell;
