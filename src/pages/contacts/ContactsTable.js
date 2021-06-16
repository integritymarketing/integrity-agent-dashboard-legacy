import React, { useState, useCallback, useEffect, useContext } from "react";
import { useTable, usePagination } from "react-table";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import * as Sentry from "@sentry/react";
import clientsService from "services/clientsService";
import styles from "./ContactsPage.module.scss";
import Spinner from "components/ui/Spinner/index";
import StageSelect from "./contactRecordInfo/StageSelect";
import Pagination from "components/ui/pagination";
import { ShortReminder } from "./contactRecordInfo/reminder/Reminder";
import { getPrimaryContact } from "utils/primaryContact";
import DeleteLeadContext from "contexts/deleteLead";
import useToast from "hooks/useToast";
import analyticsService from "services/analyticsService";

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
    usePagination
  );

  useEffect(() => {
    analyticsService.fireEvent("event-content-load", {
      pagePath: "/list-view/",
    });
    onChangeTableState({ pageSize, pageIndex, searchString, sort });
  }, [onChangeTableState, pageSize, pageIndex, searchString, sort]);

  // Render the UI for the table

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <table data-gtm="contacts-list-wrapper" {...getTableProps()}>
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

const getAndResetItemFromLocalStorage = (key, initialValue) => {
  try {
    // Get from local storage by key
    const item = window.localStorage.getItem(key);
    // Parse stored json or if none return initialValue
    const val = item ? JSON.parse(item) : initialValue;
    window.localStorage.removeItem(key);
    return val;
  } catch (error) {
    // If error also return initialValue
    Sentry.captureException(error);
    window.localStorage.removeItem(key);
    return initialValue;
  }
}

function ContactsTable({ searchString, sort }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [tableState, setTableState] = useState({});
  const { deleteLeadId, setDeleteLeadId, setLeadName, leadName } = useContext(
    DeleteLeadContext
  );
  const addToast = useToast();
  const history = useHistory();
  
  const deleteContact = useCallback(() => {
    if (deleteLeadId !== null) {
      const clearTimer = () =>
        setTimeout(() => {
          clearContext();
        }, 10000);
      clearTimer();
      const clearContext = () => {
        setDeleteLeadId(null);
        setLeadName(null);
      };
      const unDODelete = async () => {
        let response = await clientsService.reActivateClients([deleteLeadId]);
        if (response.ok) {
          clearContext();
          history.push(`/contact/${deleteLeadId}`);
        } else if (response.status === 400) {
          addToast({
            type: "error",
            message: "Error while reactivating contact",
          });
        }
      };

      addToast({
        type: "success",
        message: leadName + " Deleted",
        time: 10000,
        link: "UNDO",
        onClickHandler: unDODelete,
        closeToastRequired: true,
        onCloseCallback: clearContext,
      });
    }
  }, [deleteLeadId, addToast, leadName, setDeleteLeadId, setLeadName, history]);

  useEffect(() => {
    deleteContact();
  }, [deleteLeadId, deleteContact]);

  const fetchData = useCallback(
    ({ pageSize, pageIndex, searchString, sort }) => {
      if (pageIndex === undefined) {
        return;
      }
      setLoading(true);
      const duplicateIds = getAndResetItemFromLocalStorage('duplicateLeadIds')
      clientsService
        .getList(pageIndex, pageSize, sort, null, searchString || null, duplicateIds)
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
  }, [tableState, fetchData]);

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
            data-gtm="contact-list-view"
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
