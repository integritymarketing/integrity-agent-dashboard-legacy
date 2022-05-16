import React, { useEffect, useMemo, useCallback, useState } from "react";
import Pagination from "components/ui/Pagination/pagination";
import Spinner from "components/ui/Spinner/index";
import { usePagination, useTable } from "react-table";
import analyticsService from "services/analyticsService";
import styles from "./ActiveSellingPermissionTable.module.scss";
import clientService from "services/clientsService";


export default function ActiveSellingPermissionTable({ npn }) {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoadings] = useState(true);
  const [error, setError] = useState(null);
  useEffect(
    function () {
      if (!npn) return;

      setIsLoadings(true);
      clientService
        .getAgents(npn)
        .then((resp) => {
          setIsLoadings(false);
          setError(null);
          setAgents(resp);
        })
        .catch((err) => {
          setIsLoadings(false);
          setError(err);
          console.error("Error fetching Agents", err);
        });
    },
    [npn]
  );

  const handleChangeTable = useCallback(function () {}, []);

  const columns = useMemo(
    () => [
      {
        Header: "Carrier",
        accessor: "carrier",
        Cell: ({ value, row }) => {
          return <div className="text-bold">{value}</div>;
        },
      },
      {
        Header: "States",
        accessor: "state",
        Cell: ({ value, row }) => {
          return <div>{value}</div>;
        },
      },
      {
        Header: "Plan type",
        accessor: "product",
        Cell: ({ value, row }) => {
          return <div>{value}</div>;
        },
      },
      {
        Header: "Plan year",
        accessor: "planYear",
        Cell: ({ value, row }) => {
          return <div>{value}</div>;
        },
      },
      {
        Header: "Producer ID",
        accessor: "producerId",
        Cell: ({ value, row }) => {
          return <div>{value}</div>;
        },
      },
    ],
    []
  );

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Error fetching data</div>;
  }

  return (
    <Table
      columns={columns}
      pageCount={Math.ceil(agents.length / 10)}
      data={agents}
      onChangeTableState={handleChangeTable}
      totalResults={agents.length}
    />
  );
}

function Table({
  columns,
  data,
  searchString,
  onChangeTableState,
  pageCount: manualPageCount,
  loading,
  totalResults,
  sort,
  applyFilters,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 1, pageSize: 10 },
      pageCount: manualPageCount + 1,
    },
    usePagination
  );

  useEffect(() => {
    analyticsService.fireEvent("event-content-load", {
      pagePath: "/list-view/",
    });
    onChangeTableState({
      pageSize,
      pageIndex,
      searchString,
      sort,
      applyFilters,
    });
  }, [
    onChangeTableState,
    pageSize,
    pageIndex,
    searchString,
    sort,
    applyFilters,
  ]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <table
        data-gtm="contacts-list-wrapper"
        className={styles.table}
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="text-left">
                  <div className={styles["tb-headers"]}>
                    {column.render("Header")}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className={styles["contact-table"]}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>
                      <div className={styles["tb-cell"]}>
                        {cell.render("Cell")}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        contactsCardPage
        currentPage={pageIndex}
        totalPages={pageCount - 1}
        totalResults={totalResults}
        pageSize={pageSize}
        onPageChange={(pageIndex) => gotoPage(pageIndex)}
      />
    </>
  );
}