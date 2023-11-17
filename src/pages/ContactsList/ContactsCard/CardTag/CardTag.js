import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import { TagCell } from "pages/ContactsList/ContactsTable/TagCell";

import styles from "./styles.module.scss";

function CardTag({ item }) {
    return (
        <Box>
            <Box className={styles.tag}>Tags</Box>
            <TagCell row={item} />
        </Box>
    );
}

CardTag.propTypes = {
    item: PropTypes.object,
};

export default CardTag;
