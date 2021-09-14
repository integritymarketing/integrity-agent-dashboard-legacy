import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from "react";
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
import ContactContext from "contexts/contacts";
import useToast from "hooks/useToast";
import analyticsService from "services/analyticsService";
import More from "components/icons/more";
import ActionsDropdown from "components/ui/ActionsDropdown";
import { MORE_ACTIONS } from "utils/moreActions";

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
    const item = window.localStorage.getItem(key);
    const val = item ? JSON.parse(item) : initialValue;
    window.localStorage.removeItem(key);
    return val;
  } catch (error) {
    Sentry.captureException(error);
    window.localStorage.removeItem(key);
    return initialValue;
  }
};

function ContactsTable({ searchString, sort, duplicateIdsLength }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [tableState, setTableState] = useState({});
  const [showAddModal, setShowAddModal] = useState(null);
  const [showAddNewModal, setShowAddNewModal] = useState(false);
  const { deleteLeadId, setDeleteLeadId, setLeadName, leadName } = useContext(
    DeleteLeadContext
  );
  const { setNewSoaContactDetails } = useContext(ContactContext);
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
      const duplicateIds = getAndResetItemFromLocalStorage("duplicateLeadIds");
      clientsService
        .getList(
          pageIndex,
          pageSize,
          sort,
          null,
          searchString || null,
          duplicateIds
        )
        .then((list) => {
          setData(
            list.result.map((res) => ({
              ...res,
              contactRecordType:
                res.contactRecordType === ("Client" || "client") &&
                !res.statusName
                  ? "Enrolled"
                  : res.contactRecordType,
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
  }, [tableState, fetchData, duplicateIdsLength]);

  const navigateToSOANew = () => {
    history.push("/new-soa");
  };

  const handleDropdownActions = (contact) => (value, leadId) => {
    switch (value) {
      case "addnewreminder":
        setShowAddModal(leadId);
        setShowAddNewModal(true);
        break;
      case "addnewsoa":
        setNewSoaContactDetails(contact);
        navigateToSOANew();
        break;
      default:
        break;
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "firstName",
        Cell: ({ value, row }) => {
          const name = [
            row.original.firstName || "",
            row.original.middleName || "",
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
              showAddModal={showAddModal === row.original.leadsId}
              setShowAddModal={(value) => {
                setShowAddModal(value ? row.original.leadsId : null);
                if (!value) {
                  setShowAddNewModal(false);
                }
              }}
              showAddNewModal={showAddNewModal}
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
        Cell: ({ value, row }) => (
          <ActionsDropdown
            className={styles["more-icon"]}
            options={MORE_ACTIONS}
            id={row.original.leadsId}
            onClick={handleDropdownActions(row.original)}
            postalCode={row?.original?.addresses[0]?.postalCode}
            county={row?.original?.addresses[0]?.county}
          >
            <More />
          </ActionsDropdown>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleRefresh, showAddModal, showAddNewModal]
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
