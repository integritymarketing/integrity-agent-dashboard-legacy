import { useMemo } from "react";
import Box from "@mui/material/Box";

import { dateFormatter } from "utils/dateFormatter";
import { Table } from "./Table";
import useLoadMore from "pages/Account/SelfAttestedPermissions/hooks/useLoadMore";
import { SAPermissionsFilter } from "../SAPermissionsFilter";
import { LoadMoreButton } from "../LoadMoreButton";
import { DeleteButton } from "../DeleteButton";
import { useSAPermissionsContext } from "../providers/SAPermissionProvider";
import { useSAPModalsContext } from "../providers/SAPModalProvider";
import InfoRedIcon from "components/icons/info-red";

import styles from "./styles.module.scss";

const ITEM_PER_PAGE = 5;

function SAPermissionsTable() {
  const { setIsExpriedModalOpen } = useSAPModalsContext;
  const { filteredData, isCollapsed } = useSAPermissionsContext();
  const { visibleItems, loadMore, hasMore } = useLoadMore(
    filteredData,
    ITEM_PER_PAGE
  );

  const columns = useMemo(
    () => [
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
        Header: "Plan year",
        accessor: "planYear",
        Cell: ({ value, row }) => {
          const isExpired = row.original.isExpired;
          return <Box className={isExpired && styles.expired}>{value}</Box>;
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
                  <Box
                    className={styles.expiredIcon}
                    onClick={() => setIsExpriedModalOpen(true)}
                  >
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
              <DeleteButton attestationId={row.original.attestationId} />
            </Box>
          );
        },
      },
    ],
    [setIsExpriedModalOpen]
  );

  if (isCollapsed) return <></>;

  return (
    <Box className={styles.tableWrapper}>
      <Table columns={columns} data={visibleItems} />
      {hasMore && <LoadMoreButton loadMore={loadMore} />}
    </Box>
  );
}

export default SAPermissionsTable;
