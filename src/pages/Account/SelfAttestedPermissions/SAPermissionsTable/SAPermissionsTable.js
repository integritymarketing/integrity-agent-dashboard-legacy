import { useMemo } from "react";

import { Button } from "components/ui/Button";

import Filters from "components/icons/filters";
import { Table } from "./Table";
import useLoadMore from "pages/Account/SelfAttestedPermissions/hooks/useLoadMore";

import styles from "./styles.module.scss";

const ITEM_PER_PAGE = 5;

function SAPermissionsTable({ data = [], isAdding }) {
  const columns = useMemo(
    () => [
      {
        Header: "Carrier",
        accessor: "carrier",
        Cell: ({ value }) => {
          return <div className={styles.carrierColumn}>{value}</div>;
        },
      },
      {
        Header: "Product",
        accessor: "product",
        disableSortBy: true,
        Cell: ({ value }) => {
          return <div className={styles.productColumn}>{value}</div>;
        },
      },
      {
        Header: "State",
        accessor: "state",
        disableSortBy: true,
        Cell: ({ value }) => {
          return <div className={styles.productColumn}>{value}</div>;
        },
      },
      {
        Header: "Plan year",
        accessor: "planYear",
        Cell: ({ value }) => {
          return <div className={styles.producerIdColumn}>{value}</div>;
        },
      },
      {
        Header: "Producer ID",
        accessor: "producerId",
        disableSortBy: true,
        Cell: ({ value }) => {
          return <div className={styles.producerIdColumn}>{value}</div>;
        },
      },
      {
        Header: "Date Added",
        accessor: "dateAdded",
        disableSortBy: true,
        Cell: ({ value }) => {
          return <div>{value}</div>;
        },
      },
      {
        Header: () => (
          <Button
            data-gtm="contacts-filter"
            icon={<Filters />}
            type="primary"
          />
        ),
        accessor: "filter",
        disableSortBy: true,
        Cell: () => {
          return <div>Delete</div>;
        },
      },
    ],
    []
  );
  const { visibleData, loadMore, hasMore } = useLoadMore(data, ITEM_PER_PAGE);

  return (
    <>
      <Table columns={columns} data={visibleData} isAdding={isAdding} />
      {hasMore && <button onClick={loadMore}>Show More</button>}
    </>
  );
}

export default SAPermissionsTable;
