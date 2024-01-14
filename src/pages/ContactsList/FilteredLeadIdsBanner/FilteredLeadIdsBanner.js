import Box from "@mui/material/Box";

import useFilteredLeadIds from "../hooks/useFilteredLeadIds";

import RoundCloseIcon from "components/icons/round-close";
import { useContactsListContext } from "../providers/ContactsListProvider";
import styles from "./styles.module.scss";

function FilteredLeadIdsBanner() {
    const { refreshData } = useContactsListContext();
    const { filteredIds, removeFilteredLeadIds, filteredInfo } = useFilteredLeadIds();
    const count = filteredIds?.length ?? 0;
    const text = count > 1 ? "Policies" : "Policy";

    const onClickHandle = () => {
        removeFilteredLeadIds();
        refreshData();
    };

    if (count === 0) {
        return <></>;
    }

    return (
        <Box className={styles.banner}>
            <Box className={`${styles.colorBar} ${styles[filteredInfo?.status]}`}></Box>
            <Box>
                {count} {filteredInfo?.status} {text}
            </Box>
            <Box onClick={onClickHandle} className={styles.clearIcon}>
                <RoundCloseIcon />
            </Box>
        </Box>
    );
}

export default FilteredLeadIdsBanner;
