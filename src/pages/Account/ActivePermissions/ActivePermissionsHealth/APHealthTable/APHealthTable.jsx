import Media from "react-media";
import { useState } from "react";
import Box from "@mui/material/Box";

import useLoadMore from "../../hooks/useLoadMore";
import useRoles from "hooks/useRoles";

import { NonRTSModal } from "packages/NonRTS-Modal";

import { InforBanner } from "pages/Account/InforBanner";

import { Table } from "./Table";
import styles from "./styles.module.scss";

import { LoadMoreButton } from "../../LoadMoreButton";
import { useAPHealthContext } from "../../providers/APHealthProvider";
import PermissionsMobileView from "./PermissionsMobileView";

const ITEM_PER_PAGE = 5;

function APHealthTable() {
    const { filteredData } = useAPHealthContext();
    const { isNonRTS_User } = useRoles();
    const [isMobile, setIsMobile] = useState(false);
    const { visibleItems, loadMore, hasMore } = useLoadMore(filteredData, ITEM_PER_PAGE);

    if (isNonRTS_User) {
        return <InforBanner PopupModal={NonRTSModal} showModal={true} />;
    }

    return (
        <Box className={visibleItems?.length > 0 ? styles.tableWrapper : styles.noDataWrapper}>
            <Media
                query={"(max-width: 560px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            {isMobile ? <PermissionsMobileView items={visibleItems} /> : <Table data={visibleItems} />}
            {hasMore && <LoadMoreButton loadMore={loadMore} />}
        </Box>
    );
}

export default APHealthTable;
