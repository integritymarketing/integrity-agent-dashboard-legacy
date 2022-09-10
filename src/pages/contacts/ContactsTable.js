import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { useTable, usePagination, useRowSelect } from "react-table";
import { useHistory, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import * as Sentry from "@sentry/react";
import clientsService from "services/clientsService";
import styles from "./ContactsPage.module.scss";
import Spinner from "components/ui/Spinner/index";
import StageSelect from "./contactRecordInfo/StageSelect";
import Pagination from "components/ui/Pagination/pagination";
import Checkbox from "components/ui/Checkbox";
import { ShortReminder } from "./contactRecordInfo/reminder/Reminder";
import { getPrimaryContact } from "utils/primaryContact";
import DeleteLeadContext from "contexts/deleteLead";
import ContactContext from "contexts/contacts";
import useToast from "hooks/useToast";
import analyticsService from "services/analyticsService";
import More from "components/icons/more";
import ActionsDropdown from "components/ui/ActionsDropdown";
import { MORE_ACTIONS, PLAN_ACTION } from "utils/moreActions";

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
  onRowSelected,
}) {
  const [pageSize, setPageSize] = useState(25);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    state: { pageIndex },
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data,
      manualPagination: true,
      initialState: { pageIndex: 1, pageSize: pageSize },
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
              <Checkbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <Checkbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  useEffect(() => {
    onRowSelected(selectedFlatRows);
  }, [onRowSelected, selectedFlatRows]);

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

  const onPageSizeChange = (value) => {
    setPageSize(value);
    gotoPage(0);
  };

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
        contactsCardPage
        currentPage={pageIndex}
        totalPages={pageCount - 1}
        totalResults={totalResults}
        pageSize={pageSize}
        onPageChange={(pageIndex) => gotoPage(pageIndex)}
        onResetPageSize={true}
        setPageSize={(value) => onPageSizeChange(value)}
      />
    </>
  );
}

const getAndResetItemFromLocalStorage = (key, initialValue) => {
  try {
    const item = window.localStorage.getItem(key);
    const val = item ? JSON.parse(item) : initialValue;
    return val;
  } catch (error) {
    Sentry.captureException(error);
    window.localStorage.removeItem(key);
    return initialValue;
  }
};

function ContactsTable({
  searchString,
  sort,
  duplicateIdsLength,
  handleRowSelected,
  deleteCounter,
  handleGetAllLeadIds,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const [tableState, setTableState] = useState({});
  const [showAddModal, setShowAddModal] = useState(null);
  const [showAddNewModal, setShowAddNewModal] = useState(false);
  const { deleteLeadId, setDeleteLeadId, setLeadName, leadName } =
    useContext(DeleteLeadContext);
  const [applyFilters, setApplyFilters] = useState({});
  const { setNewSoaContactDetails } = useContext(ContactContext);
  const addToast = useToast();
  const history = useHistory();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    const stages = queryParams.get("Stage");
    const tags = queryParams.get("Tags");
    const contactRecordType = queryParams.get("ContactRecordType");
    const hasReminder = queryParams.get("HasReminder");
    const hasOverdueReminder = queryParams.get("HasOverdueReminder");
    const applyFilters = {
      contactRecordType,
      hasReminder,
      stages: stages ? stages.split(",") : [],
      tags: tags ? tags.split(",") : [],
      hasOverdueReminder,
    };
    setApplyFilters(applyFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    if (deleteCounter) {
      handleRefresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteCounter]);

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
          searchString || null,
          duplicateIds,
          applyFilters?.contactRecordType,
          applyFilters?.stages,
          applyFilters?.hasReminder,
          applyFilters.hasOverdueReminder,
          applyFilters.tags
        )
        .then((list) => {
          const listData = list.result.map((res) => ({
            ...res,
            contactRecordType:
              res.contactRecordType === ("Client" || "client") &&
              !res.statusName
                ? "Enrolled"
                : res.contactRecordType,
          }));
          handleGetAllLeadIds(listData);
          setData(listData);
          setPageCount(list.pageResult.totalPages);
          setTotalResults(list.pageResult.total);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [applyFilters, handleGetAllLeadIds]
  );

  const handleRefresh = useCallback(() => {
    fetchData({ pageIndex: 1, ...(tableState || {}) });
  }, [tableState, fetchData]);

  useEffect(() => {
    fetchData(tableState);
  }, [tableState, fetchData, duplicateIdsLength]);

  const navigateToPage = (leadId, page) => {
    history.push(`/${page}/${leadId}`);
  };
  const handleDropdownActions = (contact) => (value, leadId) => {
    switch (value) {
      case "addnewreminder":
        setShowAddModal(leadId);
        setShowAddNewModal(true);
        break;
      case "new-soa":
      case "plans":
        if (value === "new-soa") {
          setNewSoaContactDetails(contact);
        }
        navigateToPage(leadId, value);
        break;
      case "contact":
        navigateToPage(leadId, value);
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
            <>
              <Link
                to={`/contact/${row.original.leadsId}`}
                className={styles.contactPersonName}
              >
                {name}
              </Link>
              {row.original.leadSource === "Import" && (
                <div className={styles.visualIndicator}>MARKETING LEAD</div>
              )}
            </>
          );
        },
      },
      {
        Header: "Stage",
        accessor: "statusName",
        Cell: ({ value, row }) => {
          return (
            <StageSelect
              value={value}
              original={row.original}
              onRefresh={handleRefresh}
            />
          );
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
    //   /*
    // process.env.REACT_APP_FEATURE_FLAG === "show"     
  {
        Header: "Tag",
        accessor: (row) => {
          return (
            <div>
              {row.leadTags?.slice(0, 3).map(lt => (
                <span className={styles.tagBadge}>{lt.tag.tagLabel}</span>
              ))}              
              {row.leadTags?.length > 3 && <span className={styles.tagBadgeDot}>...</span>}
            </div>
          );
        },
      }, 
      // */
      {
        Header: "Tag",
        accessor: (row) => {
          return (
            <div>
              {row.leadTags?.slice(0, 3).map(lt => (
                <span className={styles.tagBadge}>{lt.tag.tagLabel}</span>
              ))}              
              {row.leadTags?.length > 3 && <span className={styles.tagBadgeDot}>...</span>}
            </div>
          );
        },
      },
      {
        Header: "Primary Contact",
        accessor: (row) => {
          return (
            <div className={styles.primaryContact}>
              {getPrimaryContact(row)}
            </div>
          );
        },
      },
      {
        Header: "",
        accessor: "actions",
        Cell: ({ value, row }) => {
          const options = MORE_ACTIONS.slice(0);
          if (
            row?.original?.addresses[0]?.postalCode &&
            row?.original?.addresses[0]?.county &&
            row?.original?.addresses[0]?.stateCode
          ) {
            options.splice(1, 0, PLAN_ACTION);
          }
          return (
            <ActionsDropdown
              className={styles["more-icon"]}
              options={options}
              id={row.original.leadsId}
              onClick={handleDropdownActions(row.original)}
            >
              <More />
            </ActionsDropdown>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleRefresh, showAddModal, showAddNewModal]
  );

  return (
    <Table
      onRowSelected={handleRowSelected}
      columns={columns}
      data={data}
      searchString={searchString}
      loading={loading}
      pageCount={pageCount}
      totalResults={totalResults}
      sort={sort}
      applyFilters={applyFilters}
      onChangeTableState={setTableState}
    />
  );
}

export default ContactsTable;
