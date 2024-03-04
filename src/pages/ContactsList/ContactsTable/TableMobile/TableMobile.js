import Box from "@mui/material/Box";

import { ActionsCell } from "pages/ContactsList/ContactsTable/ActionsCell";

import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";

import { NameCell } from "./NameCell";
import { HealthLifeCell } from "./HealthLifeCell";

import styles from "./styles.module.scss";

import { LoadMoreButton } from "pages/ContactsList/LoadMoreButton";

function TableMobile() {
    const { tableData } = useContactsListContext();

    return (
        <Box className={styles.tableWrapper}>
            {tableData.map((row) => {
                return (
                    <Box key={row.leadsId} className={styles.tableRow}>
                        <NameCell row={row} />
                        <HealthLifeCell row={row} />
                        <ActionsCell item={row} isCard={true} />
                    </Box>
                );
            })}
            <LoadMoreButton />
        </Box>
    );
}

export default TableMobile;
