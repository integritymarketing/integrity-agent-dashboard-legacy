import Box from "@mui/material/Box";

import useDuplicateLeadIds from "../hooks/useDuplicateLeadIds";

import RoundCloseIcon from "components/icons/round-close";

import styles from "./styles.module.scss";

function DuplicateBanner() {
    const { duplicateIds, removeDuplicateIds } = useDuplicateLeadIds();
    const count = duplicateIds?.length ?? 0;

    if (count === 0) {
        return <></>;
    }

    return (
        <Box className={styles.banner}>
            <Box>{count} duplicates found</Box>
            <Box onClick={removeDuplicateIds} className={styles.clearIcon}>
                <RoundCloseIcon />
            </Box>
        </Box>
    );
}

export default DuplicateBanner;
