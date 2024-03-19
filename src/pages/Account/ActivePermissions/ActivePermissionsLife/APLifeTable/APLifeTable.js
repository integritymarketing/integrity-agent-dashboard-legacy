import Box from "@mui/material/Box";

import useLoadMore from "../../hooks/useLoadMore";

import { InforBanner } from "pages/Account/InforBanner";

import { Table } from "./Table";
import styles from "./styles.module.scss";

import { LoadMoreButton } from "../../LoadMoreButton";
import { useAPLifeContext } from "../../providers/APLifeProvider";
import useDeviceType from "hooks/useDeviceType";
import MobileActiveSA from "./MobileActiveSA";

const ITEM_PER_PAGE = 5;

const APLifeTable = () => {
    const { tableData } = useAPLifeContext();
    const { isMobile } = useDeviceType();
    const { visibleItems, loadMore, hasMore } = useLoadMore(tableData, ITEM_PER_PAGE);
    const hasItem = tableData.length > 0;

    if (!hasItem) {
        return (
            <InforBanner
                title=""
                description="Integrity does not currently have Final Expense Selling Permission Data on file for your account. Please use the Self-Attestation section below to review and update your Active Selling Permissions for Final Expense."
            />
        );
    }

    return (
        <Box className={visibleItems.length > 0 ? styles.tableWrapper : styles.noDataWrapper}>
            {isMobile ? (
                <MobileActiveSA items={visibleItems} />
            ) : (
                <Table data={visibleItems} />
            )}
            {hasMore && <LoadMoreButton loadMore={loadMore} />}
        </Box>
    );
};

export default APLifeTable;
