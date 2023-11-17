import Box from "@mui/material/Box";

import { Delete } from "./Delete";
import { Export } from "./Export";
import { FilterAndSort } from "./FilterAndSort";
import { Search } from "./Search";
import styles from "./styles.module.scss";

function ContactsListActions() {
    return (
        <Box className={styles.headerWrapper}>
            <Box display="flex" alignItems="flex-end" gap="15px" width="100%">
                <Search />
                <Export />
                <Delete />
            </Box>
            <FilterAndSort />
        </Box>
    );
}

export default ContactsListActions;
