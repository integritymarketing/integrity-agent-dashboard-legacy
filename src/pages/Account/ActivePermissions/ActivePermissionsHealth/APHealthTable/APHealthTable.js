import Box from "@mui/material/Box";

import useLoadMore from "../../hooks/useLoadMore";

import { Table } from "./Table";
import styles from "./styles.module.scss";

import { LoadMoreButton } from "../../LoadMoreButton";
import { useAPHealthContext } from "../../providers/APHealthProvider";

const ITEM_PER_PAGE = 5;

function APHealthTable() {
    const { filteredData } = useAPHealthContext();
    const { visibleItems, loadMore, hasMore } = useLoadMore(filteredData, ITEM_PER_PAGE);

    return (
        <Box className={styles.tableWrapper}>
            <Table data={visibleItems} />
            {hasMore && <LoadMoreButton loadMore={loadMore} />}
        </Box>
    );
}

export default APHealthTable;
