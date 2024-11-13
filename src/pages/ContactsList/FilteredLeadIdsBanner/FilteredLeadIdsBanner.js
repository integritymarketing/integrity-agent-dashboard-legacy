import Box from "@mui/material/Box";

import useFilteredLeadIds from "../hooks/useFilteredLeadIds";

import RoundCloseIcon from "components/icons/round-close";
import { useContactsListContext } from "../providers/ContactsListProvider";
import styles from "./styles.module.scss";

function FilteredLeadIdsBanner() {
    const { refreshData } = useContactsListContext();
    const { filteredIds, removeFilteredLeadIds, filteredInfo } = useFilteredLeadIds();

    const onClickHandle = () => {
        removeFilteredLeadIds();
        refreshData();
    };

    if (!filteredIds?.length) {
        return <></>;
    }

    return (
        <Box className={styles.banner}>
            <Box className={`${styles.colorBar} ${styles[filteredInfo?.status]}`}></Box>
            <Box>
                {count} {filteredInfo?.status} {filteredIds?.length > 1 ? "Policies" : "Policy"}
            </Box>
            <Box onClick={onClickHandle} className={styles.clearIcon}>
                <span>{'Clear Filter'}</span>
                <RoundCloseIcon />
            </Box>
        </Box>
    );
}

export default FilteredLeadIdsBanner;