import React from "react";
import { useTable, usePagination, useRowSelect } from "react-table";
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

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
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
      initialState: { pageIndex: 0, pageSize: 100 },
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

  // Render the UI for your table
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
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      {/* <pagination
        currentPage={1}
        totalPages={5}
        onPageChange={(page) =>
          setCurrentPage({
            ...resultParams,
            page,
          })
        }
      /> */}
      <div className={styles.pagination}>
        <span style={{ color: "#70777E", float: "left" }}>
          Showing {pageIndex * pageSize + 1}-{(pageIndex + 1) * pageSize} of{" "}
          {data?.length || 0}
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

function ContactsTable() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "firstName",
      },
      {
        Header: "Stage",
        accessor: "stage",
        Cell: ({ value, row }) => {
          return (
            // <select
            //   value={value}
            //   onChange={(e) => {
            //    //  setPageSize(Number(e.target.value));
            //   }}
            // >
            //   {['NEW', 'SOA SENT', 'APPLIED'].map((stage) => (
            //     <option key={stage} value={stage}>
            //       {stage}
            //     </option>
            //   ))}
            // </select>
            <Select
              options={[
                {
                  label: "Reminder Asc",
                  value: "reminder-asc",
                },
                {
                  label: "Reminder Desc",
                  value: "reminder-desc",
                },
                {
                  label: "Newest First",
                  value: "newest",
                },
                {
                  label: "Olderst Firstc",
                  value: "oldest",
                },
                {
                  label: "Last Name Asc",
                  value: "lastname-asc",
                },
                {
                  label: "Last Name Desc",
                  value: "lastname-desc",
                },
              ]}
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
        accessor: "phone",
      },
      {
        Header: "",
        accessor: "actions",
        Cell: ({ row }) => <a href="">View</a>,
      },
    ],
    []
  );

  const data = React.useMemo(() => makeData(200), []);

  return <Table columns={columns} data={data} />;
}

export default ContactsTable;
