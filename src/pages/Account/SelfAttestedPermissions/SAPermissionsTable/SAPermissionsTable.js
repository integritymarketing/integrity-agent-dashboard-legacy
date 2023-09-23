import PropTypes from "prop-types";
import { useMemo } from "react";
import Box from "@mui/material/Box";

import { dateFormatter } from "utils/dateFormatter";
import { Table } from "./Table";
import useLoadMore from "pages/Account/SelfAttestedPermissions/hooks/useLoadMore";
import { SAPermissionsFilter } from "../SAPermissionsFilter";
import { LoadMoreButton } from "../LoadMoreButton";
import { DeleteButton } from "../DeleteButton";
import useFilterData from "../hooks/useFilteredData";
import useFilterOptions from "../hooks/useFilterOptions";

import styles from "./styles.module.scss";

const ITEM_PER_PAGE = 5;

function SAPermissionsTable({
  data = [],
  agents,
  isAdding,
  handleCancel,
  fetchTableData,
}) {
  const { setFilters, filteredData, filters } = useFilterData(data);
  const { filterOptions } = useFilterOptions(data);

  const { visibleItems, loadMore, hasMore } = useLoadMore(
    filteredData,
    ITEM_PER_PAGE
  );

  console.log("filteredData", filteredData)

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
        Header: () => (
          <SAPermissionsFilter
            filterOptions={filterOptions}
            setFilters={setFilters}
            filters={filters}
          />
        ),
        accessor: "filter",
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <Box>
              <DeleteButton
                fetchTableData={fetchTableData}
                attestationId={row.original.attestationId}
              />
            </Box>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <Table
        columns={columns}
        data={visibleItems}
        isAdding={isAdding}
        handleCancel={handleCancel}
        agents={agents}
        fetchTableData={fetchTableData}
      />
      {hasMore && <LoadMoreButton loadMore={loadMore} />}
    </>
  );
}

SAPermissionsTable.propTypes = {
  data: PropTypes.array,
  agents: PropTypes.array,
  handleCancel: PropTypes.func,
  isAdding: PropTypes.bool,
  fetchTableData: PropTypes.func,
};

export default SAPermissionsTable;
