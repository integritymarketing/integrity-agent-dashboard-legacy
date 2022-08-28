import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import "./activitytable.scss";
import Table from "../../packages/TableWrapper";
import { useHistory } from "react-router-dom";
import { dateFormatter } from "utils/dateFormatter";
import { TextButton } from "packages/Button";
import Typography from "@mui/material/Typography";
import ActivitySubjectWithIcon from "pages/ContactDetails/ActivitySubjectWithIcon";
import styles from "./DashboardActivityTable.module.scss";
import Heading2 from "packages/Heading2";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import ActivityButtonIcon from "pages/ContactDetails/ActivityButtonIcon";
import Filter from "packages/Filter/Filter";
import FilterOptions from "packages/Filter/FilterOptions";
import { MORE_ACTIONS, PLAN_ACTION } from "utils/moreActions";
import ActionsDropdown from "components/ui/ActionsDropdown";
import ContactContext from "contexts/contacts";
import { ShortReminder } from "pages/contacts/contactRecordInfo/reminder/Reminder";
import useCallRecordings from "hooks/useCallRecordings";
import FixedRow from "./FixedRow";

const initialState = {
  sortBy: [
    {
      id: "date",
      desc: false,
    },
  ],
};

const getActivitySubject = (activitySubject) => {
  switch (activitySubject) {
    case "Scope of Appointment Sent":
    case "Scope of Appointment Signed":
    case "Scope of Appointment Completed":
      let text = activitySubject.replace("Scope of Appointment", "SOA");
      return text;
    case "Stage Change":
      return "Stage Changed";

    default:
      return activitySubject;
  }
};

const buttonTextByActivity = {
  "Incoming Call": "Link To Contact",
  "Call Recording": "Download",
  "Contact's new call log created": "Download",
  "Scope of Appointment Signed": "Complete",
  "Scope of Appointment Completed": "View",
  "Plan Shared": "View PLans",
};

const renderButtons = (activity, leadsId, handleClick) => {
  if (!activity) return false;
  const {
    activityTypeName = "",
    activityInteractionURL = "",
    activitySubject = "",
  } = activity;

  if (
    activityTypeName &&
    activityTypeName === "Triggered" &&
    activityInteractionURL
  ) {
    return (
      <div
        className={styles.activityDataCell}
        onClick={() =>
          handleClick(activitySubject, activityInteractionURL, leadsId)
        }
      >
        <ActivityButtonIcon activitySubject={activitySubject} />
        <Typography color="#434A51" fontSize={"16px"} noWrap>
          {buttonTextByActivity[activitySubject]}
        </Typography>
      </div>
    );
  }
  return false;
};

export default function DashboardActivityTable({ activityData, onRowClick }) {
  const history = useHistory();
  const callRecordings = useCallRecordings();
  const { setNewSoaContactDetails } = useContext(ContactContext);
  const [filterToggle, setFilterToggle] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilterValues, setSelectedFilterValues] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [showAddModal, setShowAddModal] = useState(null);
  const [showAddNewModal, setShowAddNewModal] = useState(false);

  const pagedData = useMemo(() => {
    return [...filteredData].splice(0, pageSize);
  }, [pageSize, filteredData]);

  const pageHasMoreRows = useMemo(
    () => filteredData.length > pagedData.length,
    [pagedData.length, filteredData.length]
  );

  const onShowMore = useCallback(() => setPageSize((ps) => ps + 10), [
    setPageSize,
  ]);

  useEffect(() => {
    setFilteredData([...activityData]);
  }, [activityData]);

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

  const handleClick = (activitySubject, activityInteractionURL, leadsId) => {
    switch (activitySubject) {
      case "Scope of Appointment Signed":
      case "Scope of Appointment Completed":
        history.push(
          `/contact/${leadsId}/soa-confirm/${activityInteractionURL}`
        );
        break;
      case "Plan Shared":
        // TODO : change it with plan interaction URL
        break;
      case "Call Recording":
        window.open(activityInteractionURL, "_blank");
        break;
      case "Contact's new call log created":
        window.open(activityInteractionURL, "_blank");
        break;
      default:
        break;
    }
  };

  const columns = useMemo(
    () => [
      {
        id: "date",
        Header: "Date",
        accessor: (row) => new Date(row?.original?.createDate),
        Cell: ({ row }) => (
          <Typography
            color="#434A51"
            fontSize="16px"
            onClick={() => onRowClick(row?.original?.activities[0])}
          >
            {dateFormatter(row?.original?.activities[0]?.createDate, "MM/DD")}
          </Typography>
        ),
      },
      {
        id: "name",
        Header: "Name",
        accessor: (row) =>
          `${row?.original?.firstName} ${row?.original?.lastName}`,
        Cell: ({ row }) => (
          <div className={styles.activityDataCell}>
            <Typography
              noWrap
              fontWeight="bold"
              fontSize="16px"
              color="#0052CE"
              onClick={() => {
                history.push(`/contact/${row?.original?.leadsId}`);
              }}
            >
              <strong>
                {`${row?.original?.firstName} ${row?.original?.lastName}`}{" "}
              </strong>
            </Typography>
          </div>
        ),
      },
      {
        id: "activity",
        Header: "Activity",
        Cell: ({ row }) => (
          <div className={styles.activityDataCell}>
            <ActivitySubjectWithIcon
              activitySubject={row?.original?.activities[0]?.activitySubject}
            />
            <Typography
              color="#434A51"
              fontSize={"16px"}
              noWrap
              onClick={() => onRowClick(row?.original?.activities[0])}
            >
              {getActivitySubject(
                row?.original?.activities[0]?.activitySubject
              )}
            </Typography>
          </div>
        ),
      },
      {
        id: "inboundcall",
        disableSortBy: true,
        Header: "",
        Cell: () => null,
      },
      {
        id: "status",
        disableSortBy: true,
        Header: "",
        Cell: ({ row }) => (
          <>
            {renderButtons(
              row?.original?.activities[0],
              row?.original?.leadsId,
              handleClick
            )}
          </>
        ),
      },
      {
        Header: "",
        id: "more",
        disableSortBy: true,
        accessor: "reminders",
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
            <>
              <ActionsDropdown
                options={options}
                id={row.original.leadsId}
                onClick={handleDropdownActions(row.original)}
              >
                <MoreHorizOutlinedIcon />
              </ActionsDropdown>
              {showAddNewModal && (
                <ShortReminder
                  reminders={value || []}
                  leadId={row.original.leadsId}
                  showAddModal={showAddModal === row.original.leadsId}
                  setShowAddModal={(value) => {
                    setShowAddModal(value ? row.original.leadsId : null);
                    if (!value) {
                      setShowAddNewModal(false);
                    }
                  }}
                  showAddNewModal={showAddNewModal}
                  hideIcon={true}
                />
              )}
            </>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onRowClick, history, showAddModal]
  );

  const getFilterValues = () => {
    const allValues = (activityData || [])
      .filter((row) => {
        return row.activities && row.activities.length > 0;
      })
      .map((row) => {
        return row.activities[0]?.activitySubject;
      });

    return [...new Set(allValues)].map((name) => {
      return {
        name,
        selected:
          selectedFilterValues.filter(
            (selectedFilterValue) =>
              selectedFilterValue.name === name &&
              !!selectedFilterValue.selected
          ).length > 0,
      };
    });
  };

  const onFilterApply = (filterValues) => {
    setSelectedFilterValues([...filterValues]);

    if (filterValues.length === 0) {
      return setFilteredData(activityData);
    }

    const newFilteredRows = activityData.filter((row) => {
      if (row.activities && row.activities.length > 0) {
        return (
          filterValues.filter((f) => {
            return f.selected && f.name === row.activities[0].activitySubject;
          }).length > 0
        );
      }
      return false;
    });
    setFilteredData(newFilteredRows);
    setFilterToggle(false);
  };

  return (
    <>
      <div className={styles.headerWithFilter}>
        <Heading2 className={styles.recentActivity} text="Recent Activity" />
        <Filter
          heading={"Filter by Activity Type"}
          open={filterToggle}
          onToggle={setFilterToggle}
          content={
            <FilterOptions
              values={getFilterValues()}
              multiSelect={true}
              onApply={onFilterApply}
            />
          }
        />
      </div>
      <Table
        initialState={initialState}
        data={pagedData}
        columns={columns}
        footer={
          pageHasMoreRows ? (
            <TextButton onClick={onShowMore}>Show more</TextButton>
          ) : null
        }
        fixedRows={callRecordings.map((unAssosiatedCallRecord, index) => (
          <FixedRow
            index={index}
            unAssosiatedCallRecord={unAssosiatedCallRecord}
          />
        ))}
      />
    </>
  );
}
