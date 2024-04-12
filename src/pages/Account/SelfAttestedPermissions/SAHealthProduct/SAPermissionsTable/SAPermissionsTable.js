/* eslint-disable max-lines-per-function */
import { useMemo } from "react";

import Box from "@mui/material/Box";

import { dateFormatter } from "utils/dateFormatter";

import useRoles from "hooks/useRoles";
import useDeviceType from "hooks/useDeviceType";

import { NonRTSModal } from "packages/NonRTS-Modal";

import { InforBanner } from "pages/Account/InforBanner";

import useLoadMore from "pages/Account/SelfAttestedPermissions/hooks/useLoadMore";

import InfoRedIcon from "components/icons/info-red";

import { Table } from "./Table";
import styles from "./styles.module.scss";

import { DeleteButton } from "../DeleteButton";
import { LoadMoreButton } from "../LoadMoreButton";
import { SAPermissionsFilter } from "../SAPermissionsFilter";
import { SAAddPermissionRow } from "../SAAddPermissionRow";
import { SAPermissionsList } from "../SAPermissionsList";
import { useSAHealthProductContext } from "../providers/SAHealthProductProvider";
import { useSAPModalsContext } from "../providers/SAPModalProvider";

const ITEM_PER_PAGE = 5;

function SAPermissionsTable() {
    const { isNonRTS_User } = useRoles();
    const { isMobile } = useDeviceType();
    const { setIsExpriedModalOpen } = useSAPModalsContext();
    const { agents, filteredData } = useSAHealthProductContext();
    const { visibleItems, loadMore, hasMore } = useLoadMore(filteredData, ITEM_PER_PAGE);

    const columns = useMemo(
        () => [
            {
                Header: "Plan year",
                accessor: "planYear",
                Cell: ({ value, row }) => {
                    const isExpired = row.original.isExpired;
                    return <Box className={isExpired && styles.expired}>{value}</Box>;
                },
            },
            {
                Header: "Carrier",
                accessor: "carrier",
                Cell: ({ value, row }) => {
                    const isExpired = row.original.isExpired;
                    return (
                        <Box className={styles.carrierColumn}>
                            <Box className={isExpired && styles.expired}>{value}</Box>
                        </Box>
                    );
                },
            },
            {
                Header: "State",
                accessor: "state",
                disableSortBy: true,
                Cell: ({ value, row }) => {
                    const isExpired = row.original.isExpired;
                    return (
                        <Box className={styles.productColumn}>
                            <Box className={isExpired && styles.expired}>{value}</Box>
                        </Box>
                    );
                },
            },
            {
                Header: "Product",
                accessor: "product",
                disableSortBy: true,
                Cell: ({ value, row }) => {
                    const isExpired = row.original.isExpired;
                    return (
                        <Box className={styles.productColumn}>
                            <Box className={styles.pill}>
                                <Box className={isExpired && styles.expired}>{value}</Box>
                            </Box>
                        </Box>
                    );
                },
            },
            {
                Header: "Producer ID",
                accessor: "awn",
                disableSortBy: true,
                Cell: ({ value, row }) => {
                    const isExpired = row.original.isExpired;
                    return (
                        <Box className={styles.producerIdColumn}>
                            <Box className={isExpired && styles.expired}>{value}</Box>
                        </Box>
                    );
                },
            },
            {
                Header: "Date Added",
                accessor: "createDate",
                disableSortBy: true,
                Cell: ({ value, row }) => {
                    const isExpired = row.original.isExpired;
                    return (
                        <Box>
                            {isExpired ? (
                                <Box className={styles.expiredColumn}>
                                    <Box className={styles.expiredIcon} onClick={() => setIsExpriedModalOpen(true)}>
                                        <InfoRedIcon />
                                    </Box>
                                    <Box>Expired</Box>
                                </Box>
                            ) : (
                                dateFormatter(value, "MM-DD-YY")
                            )}
                        </Box>
                    );
                },
            },
            {
                Header: () => <SAPermissionsFilter />,
                accessor: "filter",
                disableSortBy: true,
                Cell: ({ row }) => {
                    return (
                        <Box>
                            <DeleteButton attestationId={row.original.attestationId} row={row} />
                        </Box>
                    );
                },
            },
        ],
        [setIsExpriedModalOpen]
    );

    if (isNonRTS_User || (agents.length === 0 && visibleItems.length === 0)) {
        return <InforBanner PopupModal={NonRTSModal} showModal={true} />;
    }

    return (
        <Box className={styles.tableWrapper}>
            {!isMobile && <Table columns={columns} data={visibleItems} />}
            {isMobile && (
                <>
                    <SAPermissionsFilter />
                    <SAPermissionsList />
                </>
            )}
            <SAAddPermissionRow />

            {hasMore && <LoadMoreButton loadMore={loadMore} />}
        </Box>
    );
}

export default SAPermissionsTable;
