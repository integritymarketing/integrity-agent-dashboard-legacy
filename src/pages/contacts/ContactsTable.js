import React, { useState, useCallback, useEffect } from "react";
import { useTable, usePagination, useRowSelect } from "react-table";

import clientsService from "services/clientsService";
import { Link } from "react-router-dom";
import styles from "./ContactsPage.module.scss";
import Spinner from "components/ui/Spinner/index";
import StageSelect from "./contactRecordInfo/StageSelect";
import Pagination from "components/ui/pagination";
import { ShortReminder } from "./contactRecordInfo/reminder/Reminder";
import { getPrimaryContact } from "utils/primaryContact";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

function Table({
  columns,
  data,
  searchString,
  onChangeTableState,
  pageCount: manualPageCount,
  loading,
  totalResults,
  sort,
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
      manualPagination: true,
      initialState: { pageIndex: 1, pageSize: 50 },
      pageCount: manualPageCount + 1,
    },
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  useEffect(() => {
    onChangeTableState({ pageSize, pageIndex, searchString, sort });
  }, [onChangeTableState, pageSize, pageIndex, searchString, sort]);

  // Render the UI for the table

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
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
        currentPage={pageIndex}
        totalPages={pageCount - 1}
        totalResults={totalResults}
        pageSize={pageSize}
        onPageChange={(pageIndex) => gotoPage(pageIndex)}
      />
    </>
  );
}

function ContactsTable({ searchString, sort }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [tableState, setTableState] = useState({});

  const fetchData = useCallback(
    ({ pageSize, pageIndex, searchString, sort }) => {
      if (pageIndex === undefined) {
        return;
      }
      setLoading(true);
      clientsService
        .getList(pageIndex, pageSize, sort, null, searchString || null)
        .then((list) => {
          setData(
            list.result.map((res) => ({
              ...res,
            }))
          );
          setPageCount(list.pageResult.totalPages);
          setTotalResults(list.pageResult.total);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    },
    []
  );

  const handleRefresh = useCallback(() => {
    fetchData({ pageIndex: 1, ...(tableState || {}) });
  }, [fetchData, tableState]);

  useEffect(() => {
    fetchData(tableState);
  }, [tableState, fetchData]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "firstName",
        Cell: ({ value, row }) => {
          const name = [
            row.original.firstName || "",
            row.original.lastName || "",
          ]
            .join(" ")
            .trim();

          if (!name) {
            return "--";
          }
          return (
            <Link
              to={`/contact/${row.original.leadsId}`}
              className={styles.contactPersonName}
            >
              {name}
            </Link>
          );
        },
      },
      {
        Header: "Stage",
        accessor: "statusName",
        Cell: ({ value, row }) => {
          return <StageSelect value={value} original={row.original} />;
        },
      },
      {
        Header: "Reminder",
        accessor: "reminders",
        Cell: ({ value, row }) => {
          return (
            <ShortReminder
              reminders={value || []}
              leadId={row.original.leadsId}
              onRefresh={handleRefresh}
            />
          );
        },
      },
      {
        Header: "Primary Contact",
        accessor: (row) => {
          return getPrimaryContact(row);
        },
      },
      {
        Header: "",
        accessor: "actions",
        Cell: ({ row }) => (
          <Link
            to={`/contact/${row.original.leadsId}`}
            className={styles.viewLink}
          >
            View
          </Link>
        ),
      },
    ],
    [handleRefresh]
  );

  return (
    <Table
      columns={columns}
      data={data}
      searchString={searchString}
      loading={loading}
      pageCount={pageCount}
      totalResults={totalResults}
      sort={sort}
      onChangeTableState={setTableState}
    />
  );
}

export default ContactsTable;
