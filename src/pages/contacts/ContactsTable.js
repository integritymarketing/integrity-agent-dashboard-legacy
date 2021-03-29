import React, { useState, useCallback, useEffect } from "react";
import { useTable, usePagination, useRowSelect } from "react-table";
import clientsService from "services/clientsService";
import { Select, DefaultOption } from "components/ui/Select";

import makeData from "./makeData";

import styles from "./ContactsPage.module.scss";

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

const ColorOptionRender = ({ value, label, color, onClick }) => {
  const handleClick = (ev) => {
    onClick && onClick(ev, value);
  };
  return (
    <div className="option" onClick={handleClick}>
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 5,
        }}
      />
      <span>{label}</span>
    </div>
  );
};

function Table({
  columns,
  data,
  fetchData,
  pageCount: manualPageCount,
  loading,
  totalResults,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      manualPagination: true,
      initialState: { pageIndex: 0, pageSize: 100 },
      pageCount: manualPageCount,
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
    fetchData({ pageSize, pageIndex });
  }, [fetchData, pageSize, pageIndex]);

  // Render the UI for the table
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
        <tbody {...getTableBodyProps()}>
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

      <div className={styles.pagination}>
        <span style={{ color: "#70777E", float: "left" }}>
          Showing {pageIndex * pageSize + 1}-{(pageIndex + 1) * pageSize} of{" "}
          {totalResults || 0}
        </span>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {"Next >"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          Last
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
      </div>
    </>
  );
}

const colorCodes = {
  New: "green",
};

function ContactsTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    setLoading(true);
    clientsService
      .getList(pageIndex, pageSize)
      .then((list) => {
        // setData(list.result);
        setData(
          list.result.map((res) => ({
            ...res,
            notes: "test note",
          }))
        );
        setPageCount(list.pageResult.totalPages);
        setTotalResults(list.pageResult.total);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const statusOptions = React.useMemo(() => {
    const options = {};
    data.forEach((d) => {
      if (!options[d.statusName]) {
        options[d.statusName] = {
          value: d.statusName,
          label: d.statusName,
          color: colorCodes[d.statusName] || "gray",
        };
      }
    });
    return Object.values(options);
  }, [data]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "firstName",
      },
      {
        Header: "Stage",
        accessor: "statusName",
        Cell: ({ value, row }) => {
          return (
            <Select
              Option={ColorOptionRender}
              initialValue={value}
              options={statusOptions}
            />
          );
        },
      },
      {
        Header: "Reminder",
        accessor: "reminder",
      },
      {
        Header: "Primary Contact",
        accessor: "email",
      },
      {
        Header: "",
        accessor: "actions",
        Cell: ({ row }) => <a href="">View</a>,
      },
    ],
    [statusOptions]
  );

  return (
    <Table
      columns={columns}
      data={data}
      fetchData={fetchData}
      loading={loading}
      pageCount={pageCount}
      totalResults={totalResults}
    />
  );
}

export default ContactsTable;
