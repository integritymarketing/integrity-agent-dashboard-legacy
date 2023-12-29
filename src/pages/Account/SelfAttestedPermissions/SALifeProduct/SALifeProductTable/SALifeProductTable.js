import Box from "@mui/material/Box";

import useLoadMore from "../../hooks/useLoadMore";

import { Table } from "./Table";
import styles from "./styles.module.scss";

import { LoadMoreButton } from "../LoadMoreButton";
import { useSALifeProductContext } from "../providers/SALifeProductProvider";

const ITEM_PER_PAGE = 5;

function SALifeProductTable() {
    const { tableData } = useSALifeProductContext();
    const { visibleItems, loadMore, hasMore } = useLoadMore(tableData, ITEM_PER_PAGE);

    return (
        <Box className={styles.tableWrapper}>
            <Table data={visibleItems} />
            {hasMore && <LoadMoreButton loadMore={loadMore} />}
        </Box>
    );
}

export default SALifeProductTable;
