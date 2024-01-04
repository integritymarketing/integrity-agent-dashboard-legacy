import Box from "@mui/material/Box";

import useLoadMore from "../../hooks/useLoadMore";
import useRoles from "hooks/useRoles";

import { NonRTSModal } from "packages/NonRTS-Modal";

import { InforBanner } from "pages/Account/InforBanner";

import { Table } from "./Table";
import styles from "./styles.module.scss";

import { LoadMoreButton } from "../../LoadMoreButton";
import { useAPHealthContext } from "../../providers/APHealthProvider";

const ITEM_PER_PAGE = 5;

function APHealthTable() {
    const { filteredData } = useAPHealthContext();
    const { isNonRTS_User } = useRoles();
    const { visibleItems, loadMore, hasMore } = useLoadMore(filteredData, ITEM_PER_PAGE);

    if (isNonRTS_User) {
        return <InforBanner PopupModal={NonRTSModal} showModal={true} />;
    }

    return (
        <Box className={styles.tableWrapper}>
            <Table data={visibleItems} />
            {hasMore && <LoadMoreButton loadMore={loadMore} />}
        </Box>
    );
}

export default APHealthTable;
