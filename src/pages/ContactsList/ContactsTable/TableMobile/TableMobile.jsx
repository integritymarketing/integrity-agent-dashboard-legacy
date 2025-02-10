import Box from "@mui/material/Box";

import { ActionsCell } from "pages/ContactsList/ContactsTable/ActionsCell";

import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@awesome.me/kit-7ab3488df1/icons/duotone/solid";
import { NameCell } from "./NameCell";
import { HealthLifeCell } from "./HealthLifeCell";

import styles from "./styles.module.scss";

import { LoadMoreButton } from "pages/ContactsList/LoadMoreButton";

function TableMobile() {
    const { tableData, isFetchingTableData, isStartedSearching } = useContactsListContext();

    return (
        <Box className={styles.tableWrapper}>
            {isFetchingTableData || isStartedSearching ? (
                <div className={styles.loaderContainer}>
                    <FontAwesomeIcon
                        icon={faSpinnerThird}
                        color="#4178FF"
                        secondaryColor="#C4C8CF"
                        size="10x"
                        spin
                        secondaryOpacity={0.5}
                    />
                </div>
            ) : (
                tableData.map((row) => (
                    <Box key={row.leadsId} className={styles.tableRow}>
                        <NameCell row={row} />
                        <HealthLifeCell row={row} />
                        <ActionsCell item={row} isCard={true} />
                    </Box>
                ))
            )}
            <LoadMoreButton />
        </Box>
    );
}

export default TableMobile;
