import { useMemo } from "react";

import Box from "@mui/material/Box";

import { dateFormatter } from "utils/dateFormatter";

import useLoadMore from "pages/Account/SelfAttestedPermissions/hooks/useLoadMore";

import InfoRedIcon from "components/icons/info-red";

import { Table } from "./Table";
import styles from "./styles.module.scss";

import { DeleteButton } from "../DeleteButton";
import { LoadMoreButton } from "../LoadMoreButton";
import { SAPermissionsFilter } from "../SAPermissionsFilter";
import { useSAHealthProductContext } from "../providers/SAHealthProductProvider";
import { useSAPModalsContext } from "../providers/SAPModalProvider";

const ITEM_PER_PAGE = 5;

function SAPermissionsTable() {
    const { setIsExpriedModalOpen } = useSAPModalsContext();
    const { filteredData } = useSAHealthProductContext();
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

    return (
        <Box className={styles.tableWrapper}>
            <Table columns={columns} data={visibleItems} />
            {hasMore && <LoadMoreButton loadMore={loadMore} />}
        </Box>
    );
}

export default SAPermissionsTable;
