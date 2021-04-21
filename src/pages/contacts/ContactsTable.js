import React, { useState, useCallback, useEffect } from "react";
import { useTable, usePagination, useRowSelect } from "react-table";

import clientsService from "services/clientsService";
import { ColorOptionRender } from "./../../utils/shared-utils/sharedUtility";
import { Link } from "react-router-dom";
import ReminderIcon from "../../../src/stories/assets/reminder.svg";
import { Select } from "components/ui/Select";
import useToast from './../../hooks/useToast';

import styles from "./ContactsPage.module.scss";
import Spinner from './../../components/ui/Spinner/index';
import StageSelect from "./contactRecordInfo/StageSelect";

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
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
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

      <div className={styles.pagination}>
        <div>
          Showing {pageIndex * pageSize + 1}-{(pageIndex + 1) * pageSize} of{" "}
          {totalResults || 0}
        </div>
        <div className={styles.right}>
          {Array(Math.min(5, pageOptions.length))
            .fill(null)
            .map((_, index) => (
              <button
                onClick={() => gotoPage(index)}
                className={pageIndex === index ? styles.active : undefined}
              >
                {index + 1}
              </button>
            ))}
          <button
            onClick={() => gotoPage(pageIndex + 1)}
            disabled={!canNextPage}
            className={styles.text}
          >
            Next &nbsp; {">"}
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className={styles.text}
          >
            Last
          </button>{" "}
        </div>
      </div>
    </>
  );
}

const colorCodes = {
  New: "#2082F5",
  Quoted: "#EDB72C",
  Lost: "#565656",
  Enrolled: "#565656",
  Open: "Orange",
  Applied: "#65C15D"
};

function ContactsTable({ searchString, sort }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [allStatuses, setAllStatuses] = useState([]);
  const [tableState, setTableState] = useState({});
  
  const addToast = useToast();

    // load status ids for updates
    useEffect(() => {
      const doFetch = async () => {
        const statuses = await clientsService.getStatuses();
        setAllStatuses(statuses);
      };
  
      doFetch();
    }, []);

  const fetchData = useCallback(({ pageSize, pageIndex, searchString, sort }) => {
    setLoading(true);
    clientsService
      .getList(pageIndex, pageSize,sort,null,searchString || null,)
      .then((list) => {
        setData(
          list.result.map((res) => ({
            ...res,
            reminderNotes: "3/15 Call on Wednesday. Email quotes out.",
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

  useEffect(() => {    
    fetchData(tableState);
  }, [tableState,fetchData]);

  const statusOptions = React.useMemo(() => {
    return allStatuses.map(status => ( {
      value: status.statusName,
      label: status.statusName,
      color: status.colorCode || colorCodes[status.statusName] || "#EDB72C",
    }));
  }, [allStatuses]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "firstName",
        Cell: ({ value, row }) =>
          `${row.original.firstName || ""} ${row.original.lastName || "Williams Mary"}`,
      },
      {
        Header: "Stage",
        accessor: "statusName",
        Cell: ({ value, row }) => {
          
          return (
             <StageSelect value={value} original={row.original} />
          );
        },
      },
      {
        Header: "Reminder",
        accessor: "reminderNotes",
        Cell: (props) => (
          <div className={styles.reminder}>
            <div className={styles.cal}>
              <img src={ReminderIcon} alt="" height="20" className="mr-1" />
              3/15
            </div>
            <div className={styles.reminderText}>
              Call on Wednesday. Email quotes out.
            </div>
          </div>
        ),
      },
      {
        Header: "Primary Contact",
        accessor: "email",
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
    [statusOptions, tableState,addToast,allStatuses,fetchData]
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
