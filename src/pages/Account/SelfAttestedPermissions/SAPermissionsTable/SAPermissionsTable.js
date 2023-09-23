import { useMemo } from "react";
import Box from "@mui/material/Box";

import { dateFormatter } from "utils/dateFormatter";
import { Table } from "./Table";
import useLoadMore from "pages/Account/SelfAttestedPermissions/hooks/useLoadMore";
import { SAPermissionsFilter } from "../SAPermissionsFilter";
import { LoadMoreButton } from "../LoadMoreButton";
import { DeleteButton } from "../DeleteButton";
import { useSAPermissionsContext } from "../SAPermissionProvider";

import styles from "./styles.module.scss";

const ITEM_PER_PAGE = 5;

function SAPermissionsTable({}) {
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
        Cell: ({ value }) => {
          return <Box className={styles.carrierColumn}>{value}</Box>;
        },
      },
      {
        Header: "Product",
        accessor: "product",
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <Box className={styles.productColumn}>
              <Box className={styles.pill}>{value}</Box>
            </Box>
          );
        },
      },
      {
        Header: "State",
        accessor: "state",
        disableSortBy: true,
        Cell: ({ value }) => {
          return <Box className={styles.productColumn}>{value}</Box>;
        },
      },
      {
        Header: "Plan year",
        accessor: "planYear",
        Cell: ({ value }) => {
          return <Box>{value}</Box>;
        },
      },
      {
        Header: "Producer ID",
        accessor: "awn",
        disableSortBy: true,
        Cell: ({ value }) => {
          return <Box className={styles.producerIdColumn}>{value}</Box>;
        },
      },
      {
        Header: "Date Added",
        accessor: "createDate",
        disableSortBy: true,
        Cell: ({ value }) => {
          return <Box>{dateFormatter(value, "MM-DD-YY")}</Box>;
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
    []
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
