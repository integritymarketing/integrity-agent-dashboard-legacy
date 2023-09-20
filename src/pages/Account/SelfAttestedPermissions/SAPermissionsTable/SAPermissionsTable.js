import PropTypes from "prop-types";
import { useMemo } from "react";
import Box from "@mui/material/Box";

import { dateFormatter } from "utils/dateFormatter";
import { Table } from "./Table";
import useLoadMore from "pages/Account/SelfAttestedPermissions/hooks/useLoadMore";
import { TableFilter } from "./TableFilter";
import { LoadMoreButton } from "./LoadMoreButton";

import styles from "./styles.module.scss";

const ITEM_PER_PAGE = 5;

function SAPermissionsTable({
  data = [],
  agents,
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
          return <Box>{dateFormatter(value, 'M-DD-YY')}</Box>;
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

  const { visibleItems, loadMore, hasMore } = useLoadMore(data, ITEM_PER_PAGE);

  return (
    <>
      <Table
        columns={columns}
        data={visibleItems}
        isAdding={isAdding}
        handleCancel={handleCancel}
        handleAddNew={handleAddNew}
        agents={agents}
      />
      {hasMore && <LoadMoreButton loadMore={loadMore} />}
    </>
  );
}



SAPermissionsTable.propTypes = {
  data: PropTypes.array,
  agents: PropTypes.array,
  handleAddNew: PropTypes.func,
  handleCancel: PropTypes.func,
  isAdding: PropTypes.bool,
};

export default SAPermissionsTable;
