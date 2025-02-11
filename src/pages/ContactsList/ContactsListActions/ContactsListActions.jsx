import Box from "@mui/material/Box";

import { Delete } from "./Delete";
import { Export } from "./Export";
import { FilterAndSort } from "./FilterAndSort";
import FilterResultBanner from "./FilterAndSort/FilterResultBanner";
import { Search } from "./Search";
import styles from "./styles.module.scss";

function ContactsListActions({ isMobile }) {
    return (
        <Box>
            <Box className={styles.headerWrapper}>
                <Box display="flex" alignItems="flex-end" gap="15px" width="100%">
                    <Search isMobile={isMobile} />
                    <Export />
                    <Delete />
                </Box>
                <FilterAndSort />
            </Box>
            <FilterResultBanner />
        </Box>
    );
}

export default ContactsListActions;
