import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import { StageCell } from "pages/ContactsList/ContactsTable/StageCell";

import styles from "./styles.module.scss";

function CardStage({ item }) {
    return (
        <Box className={styles.stage}>
            <Box>Stage</Box>
            <Box>
                <StageCell initialValue={item.statusName} originalData={item} />
            </Box>
        </Box>
    );
}

CardStage.propTypes = {
    item: PropTypes.object,
};

export default CardStage;
