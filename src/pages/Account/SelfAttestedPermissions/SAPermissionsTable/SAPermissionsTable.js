import { useMemo } from "react";
import Box from "@mui/material/Box";

import { Table } from "./Table";
import useLoadMore from "pages/Account/SelfAttestedPermissions/hooks/useLoadMore";
import { TableFilter } from "./TableFilter";

import styles from "./styles.module.scss";

const ITEM_PER_PAGE = 5;

function SAPermissionsTable({
  data = [],
  isAdding,
  handleAddNew,
  handleCancel,
}) {
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
          return <Box className={styles.productColumn}>{value}</Box>;
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
        accessor: "producerId",
        disableSortBy: true,
        Cell: ({ value }) => {
          return <Box className={styles.producerIdColumn}>{value}</Box>;
        },
      },
      {
        Header: "Date Added",
        accessor: "dateAdded",
        disableSortBy: true,
        Cell: ({ value }) => {
          return <Box>{value}</Box>;
        },
      },
      {
        Header: () => <TableFilter />,
        accessor: "filter",
        disableSortBy: true,
        Cell: () => {
          return <Box>Delete</Box>;
        },
      },
    ],
    []
  );
  const { visibleData, loadMore, hasMore } = useLoadMore(data, ITEM_PER_PAGE);

  return (
    <>
      <Table
        columns={columns}
        data={visibleData}
        isAdding={isAdding}
        handleCancel={handleCancel}
        handleAddNew={handleAddNew}
      />
      {hasMore && <button onClick={loadMore}>Show More</button>}
    </>
  );
}

export default SAPermissionsTable;
