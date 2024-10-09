import Box from "@mui/material/Box";

import useFilteredLeadIds from "../hooks/useFilteredLeadIds";

import RoundCloseIcon from "components/icons/round-close";
import { useContactsListContext } from "../providers/ContactsListProvider";
import styles from "./styles.module.scss";

function DuplicateBanner() {
    const { refreshData } = useContactsListContext();
    const { duplicateIds, removeFilteredLeadIds } = useFilteredLeadIds();
    const count = duplicateIds?.length ?? 0;

    const onClickHandle = () => {
        removeFilteredLeadIds();
        refreshData();
    };

    if (count === 0) {
        return <></>;
    }

    return (
        <Box className={styles.banner}>
            <Box>{count} duplicates found</Box>
            <Box onClick={onClickHandle} className={styles.clearIcon}>
                <RoundCloseIcon />
            </Box>
        </Box>
    );
}

export default DuplicateBanner;
