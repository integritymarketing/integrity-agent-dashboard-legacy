import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from "react";
import PropTypes from "prop-types";
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
import StageStatusContext from "contexts/stageStatus";
import { ColorOptionRender } from "utils/shared-utils/sharedUtility";
import SOAModal from "pages/contacts/contactRecordInfo/soaList/SOAModal";

function Table({
  columns,
  data,
  pageCount: manualPageCount,
  loading,
  totalResults,
  onRowSelected,
  isMobile,
  layout,
  pageSize,
  setPageSize,
  pageIndex,
  setPageIndex,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageCount,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data,
      manualPagination: true,
      initialState: { pageIndex: pageIndex, pageSize: pageSize },
      pageCount: manualPageCount + 1,
    },
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <Checkbox label="" id="" {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <Checkbox label="" id="" {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  useEffect(() => {
    analyticsService.fireEvent("event-content-load", {
      pagePath: "/list-view/",
    });
  }, []);

  useEffect(() => {
    onRowSelected(selectedFlatRows);
  }, [onRowSelected, selectedFlatRows]);

  const onPageSizeChange = (value) => {
    setPageSize(value);
    setPageIndex(0);
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
      {!(isMobile && layout === "list") && (
        <Pagination
          contactsCardPage
          currentPage={pageIndex}
          totalPages={pageCount - 1}
          totalResults={totalResults}
          pageSize={pageSize}
          onPageChange={(pageIndex) => setPageIndex(pageIndex)}
          onResetPageSize={true}
          setPageSize={(value) => onPageSizeChange(value)}
        />
      )}
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
  filteredLeadIdsLength,
  handleRowSelected,
  deleteCounter,
  handleGetAllLeadIds,
  isMobile,
  layout,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [pageIndex, setPageIndex] = useState(1);

  const [showAddModal, setShowAddModal] = useState(null);
  const [showAddNewModal, setShowAddNewModal] = useState(false);
  const { deleteLeadId, setDeleteLeadId, setLeadName, leadName } =
    useContext(DeleteLeadContext);

  const { setNewSoaContactDetails } = useContext(ContactContext);
  const [leadId, setLeadId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { statusOptions } = useContext(StageStatusContext);

  const showToast = useToast();
  const history = useHistory();
  const location = useLocation();

  const queryParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const applyFilters = useMemo(() => {
    const stages = queryParams.get("Stage");
    const tags = queryParams.get("Tags");
    const contactRecordType = queryParams.get("ContactRecordType");
    const hasReminder = queryParams.get("HasReminder");
    const hasOverdueReminder = queryParams.get("HasOverdueReminder");
    return {
      contactRecordType,
      hasReminder,
      stages: stages ? stages.split(",") : [],
      tags: tags ? tags.split(",") : [],
      hasOverdueReminder,
    };
  }, [queryParams]);

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
          showToast({
            type: "error",
            message: "Error while reactivating contact",
          });
        }
      };

      showToast({
        type: "success",
        message: leadName + " Deleted",
        time: 10000,
        link: "UNDO",
        onClickHandler: unDODelete,
        closeToastRequired: true,
        onCloseCallback: clearContext,
      });
    }
  }, [deleteLeadId, showToast, leadName, setDeleteLeadId, setLeadName, history]);

  useEffect(() => {
    deleteContact();
  }, [deleteLeadId, deleteContact]);

  const fetchData = useCallback(
    ({ pageSize, pageIndex, searchString, sort, applyFilters }) => {
      if (pageIndex === undefined) {
        return;
      }
      setLoading(true);
      const duplicateIds = getAndResetItemFromLocalStorage("duplicateLeadIds");
      const filterLeadIds = getAndResetItemFromLocalStorage("filterLeadIds");
      const leadIds = filterLeadIds
        ? filterLeadIds
        : duplicateIds
        ? duplicateIds
        : null;

      const returnAll = isMobile && layout === "list";
      clientsService
        .getList(
          pageIndex,
          pageSize,
          sort,
          searchString || null,
          leadIds,
          applyFilters?.contactRecordType,
          applyFilters?.stages,
          applyFilters?.hasReminder,
          applyFilters.hasOverdueReminder,
          applyFilters.tags,
          returnAll
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
    [handleGetAllLeadIds, isMobile, layout]
  );

  const handleRefresh = useCallback(() => {
    fetchData({
      pageIndex: 1,
      pageSize,
      searchString,
      sort,
      applyFilters,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData({ pageIndex, pageSize, searchString, sort, applyFilters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filteredLeadIdsLength,
    pageIndex,
    pageSize,
    searchString,
    sort,
    applyFilters,
  ]);

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
        setNewSoaContactDetails(contact);
        setLeadId(leadId);
        setOpenModal(true);
        break;
      case "plans":
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
            <div className={styles.contactPersonNameWrapper}>
              <Link
                to={`/contact/${row.original.leadsId}`}
                className={styles.contactPersonName}
              >
                {name}
              </Link>
              {row.original.leadSource === "Import" && (
                <div className={styles.visualIndicator}>MARKETING LEAD</div>
              )}
            </div>
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
      {
        Header: "Tag",
        accessor: (row) => {
          return (
            <div>
              {row.leadTags?.slice(0, 3).map((lt) => (
                <span key={lt?.tag?.tagLabel} className={styles.tagBadge}>
                  {lt.tag.tagLabel}
                </span>
              ))}
              {row.leadTags?.length > 3 && (
                <span className={styles.tagBadge}>
                  <span className={styles.tagBadgeDot}>...</span>
                </span>
              )}
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
  const mobile_columns = useMemo(
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
            <div className={styles.contactPersonNameWrapper}>
              <Link
                to={`/contact/${row.original.leadsId}`}
                className={styles.contactPersonName}
              >
                {name}
              </Link>
              {row.original.leadSource === "Import" && (
                <div className={styles.visualIndicator}>MARKETING LEAD</div>
              )}
            </div>
          );
        },
      },
      {
        Header: "Stage",
        accessor: "statusName",
        Cell: ({ value, row }) => {
          const data =
            statusOptions.filter((x) => x?.value === value)?.[0] || undefined;
          if (data) {
            return (
              <ColorOptionRender
                {...data}
                filter={true}
                className={styles.stageOption}
              />
            );
          } else return value;
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleRefresh, showAddModal, showAddNewModal, statusOptions]
  );

  return (
    <>
      <Table
        onRowSelected={handleRowSelected}
        columns={isMobile && layout === "list" ? mobile_columns : columns}
        data={data}
        searchString={searchString}
        loading={loading}
        pageCount={pageCount}
        totalResults={totalResults}
        sort={sort}
        applyFilters={applyFilters}
        isMobile={isMobile}
        layout={layout}
        pageSize={pageSize}
        setPageSize={setPageSize}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
      />

      {openModal && (
        <SOAModal
          id={leadId}
          openSOAModal={openModal}
          setOpenSOAModal={setOpenModal}
        />
      )}
    </>
  );
}

ContactsTable.propTypes = {
  searchString: PropTypes.string,
  sort: PropTypes.string,
  filteredLeadIdsLength: PropTypes.number,
  handleRowSelected: PropTypes.func,
  deleteCounter: PropTypes.number,
  handleGetAllLeadIds: PropTypes.func,
  isMobile: PropTypes.bool,
  layout: PropTypes.string,
};

export default ContactsTable;
