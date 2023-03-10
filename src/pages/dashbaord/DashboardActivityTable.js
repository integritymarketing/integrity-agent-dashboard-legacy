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
import FilterIcon from "components/icons/activities/Filter";
import ActiveFilter from "components/icons/activities/ActiveFilter";
import ActivityDetails from "pages/ContactDetails/ActivityDetails";
import clientsService from "services/clientsService";
import { convertUTCDateToLocalDate } from "utils/dates";
import useToast from "hooks/useToast";
import * as Sentry from "@sentry/react";
import CallDetails from "./CallDetails";
import ComparePlansService from "services/comparePlansService";
import useUserProfile from "hooks/useUserProfile";

const getActivitySubject = (activitySubject) => {
  switch (activitySubject) {
    case "Scope of Appointment Sent":
    case "Scope of Appointment Signed":
    case "Scope of Appointment Completed":
      let text = activitySubject.replace("Scope of Appointment", "SOA");
      return text;
    case "Stage Change":
      return "Stage Changed";
    case "Contact's new call log created":
      return "Call Recording";
    default:
      return activitySubject;
  }
};

const buttonTextByActivity = {
  "Incoming Call": "Link to Contact",
  "Call Recording": "Download",
  "Contact's new call log created": "Download",
  "Outbound Call Recorded": "Download",
  "Incoming Call Recorded": "Download",
  "Scope of Appointment Signed": "Complete",
  "Scope of Appointment Completed": "View",
  "Plan Shared": "View Plans",
  "Application Submitted": "View",
  "Meeting Recorded": "Download",
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
    (activityTypeName === "Triggered" ||
      activitySubject === "Meeting Recorded") &&
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

export default function DashboardActivityTable({
  activityData,
  realoadActivityData,
  setPage,
  page,
  showMore,
  setSelectedFilterValues,
  selectedFilterValues,
  setFilterValues,
  filterValues,
  setSort,
  sort,
}) {
  const history = useHistory();
  const addToast = useToast();

  const callRecordings = useCallRecordings();
  const { setNewSoaContactDetails } = useContext(ContactContext);
  const [filterToggle, setFilterToggle] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const [showAddModal, setShowAddModal] = useState(null);
  const [showAddNewModal, setShowAddNewModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedCall, setSelectedCall] = useState(null);
  const [selectedLead, setSelectedLead] = useState();

  const userProfile = useUserProfile();
  const { npn } = userProfile;

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

  const handleClick = async (
    activitySubject,
    activityInteractionURL,
    leadsId
  ) => {
    const splitViewPlansURL = activityInteractionURL.split("/");
    switch (activitySubject) {
      case "Scope of Appointment Signed":
      case "Scope of Appointment Completed":
        history.push(
          `/contact/${leadsId}/soa-confirm/${activityInteractionURL}`
        );
        break;
      case "Plan Shared":
        history.push(
          `/plans/${leadsId}/compare/${splitViewPlansURL[7]}/${splitViewPlansURL[8]}`
        );
        break;
      case "Call Recording":
      case "Incoming Call Recorded":
      case "Outbound Call Recorded":
      case "Contact's new call log created":
      case "Meeting Recorded":
        window.open(activityInteractionURL, "_blank");
        break;
      case "Application Submitted":
        let link = await ComparePlansService?.getPdfSource(
          activityInteractionURL,
          npn
        );
        console.log("MOBILE TESTING ....:", link);
        var url = await window.URL.createObjectURL(link);

        if (url && url !== "") {
          window.open(url, "_blank");
        } else {
          console.log("NO PDF SOURCE AVAILABLE", url);
        }
        break;
      default:
        break;
    }
  };

  const handleTableRowClick = useCallback(
    (row) => {
      setSelectedLead({
        fullName: `${row?.firstName} ${row?.lastName}`,
        ...row,
      });
      setSelectedActivity(row.activities[0]);
    },
    [setSelectedActivity, setSelectedLead]
  );

  const columns = useMemo(
    () => [
      {
        id: "date",
        Header: "Date",
        accessor: (row) =>
          new Date(
            row?.original?.activities[0]?.modifyDate
              ? row?.original?.activities[0]?.modifyDate
              : row?.original?.activities[0]?.createDate
          ),
        Cell: ({ row }) => {
          let date = convertUTCDateToLocalDate(
            row?.original?.activities[0]?.modifyDate
              ? row?.original?.activities[0]?.modifyDate
              : row?.original?.activities[0]?.createDate
          );
          return (
            <Typography color="#434A51" fontSize="16px">
              {dateFormatter(date, "MM/DD/yyyy")}
            </Typography>
          );
        },
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
              onClick={(event) => {
                event.stopPropagation();
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
        accessor: (row) => `${row?.original?.activities[0]?.activitySubject}`,
        Cell: ({ row }) => (
          <div className={styles.activityDataCell}>
            <ActivitySubjectWithIcon
              activitySubject={row?.original?.activities[0]?.activitySubject}
            />
            <Typography
              color="#434A51"
              fontSize={"16px"}
              noWrap
              onClick={() => {
                handleTableRowClick(row?.original);
              }}
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
    [history, showAddModal]
  );

  const onFilterApply = (filterValues) => {
    setFilterValues([...filterValues]);
    let data = filterValues
      .filter((item) => item.selected)
      .map((item) => item.name);

    setSelectedFilterValues([...data]);
    setPage(1);
    setFilterToggle(false);
  };

  const onResetFilter = () => {
    setFilterValues((values) => {
      return values.map((v) => ({ ...v, selected: false }));
    });
    setSelectedFilterValues([]);
    setPage(1);
  };

  const handleAddActivtyNotes = useCallback(
    async (activity, activityNote) => {
      const { activitySubject, activityId, activityBody } = activity;
      const leadsId = selectedLead.leadsId;
      const payload = {
        activityBody,
        activitySubject,
        activityId,
        activityNote,
      };
      try {
        await clientsService.updateActivity(payload, leadsId);
        realoadActivityData && (await realoadActivityData());
        setSelectedActivity(null);
        addToast({
          type: "success",
          message: "Activity notes added successfully",
          time: 3000,
        });
      } catch (e) {
        Sentry.captureException(e);
      }
    },
    [setSelectedActivity, addToast, selectedLead, realoadActivityData]
  );

  return (
    <>
      <div className={styles.headerWithFilter}>
        <Heading2 className={styles.recentActivity} text="Recent Activity" />
        <div className={styles.filterButton}>
          <Filter
            Icon={FilterIcon}
            ActiveIcon={ActiveFilter}
            heading={"Filter by Activity Type"}
            open={filterToggle}
            onToggle={setFilterToggle}
            filtered={selectedFilterValues.length > 0 ? true : false}
            content={
              <FilterOptions
                values={[...filterValues]}
                multiSelect={true}
                onApply={onFilterApply}
                onReset={onResetFilter}
              />
            }
          />
        </div>
      </div>
      <Table
        handleSort={setSort}
        sort={sort}
        initialState={{}}
        data={filteredData}
        columns={columns}
        footer={
          showMore ? (
            <TextButton onClick={() => setPage(page + 1)}>Show more</TextButton>
          ) : (
            ""
          )
        }
        fixedRows={callRecordings.map((unAssosiatedCallRecord, index) => (
          <FixedRow
            index={index}
            onSelect={(call) => {
              setSelectedCall(call);
            }}
            unAssosiatedCallRecord={unAssosiatedCallRecord}
          />
        ))}
      />
      {selectedActivity && (
        <ActivityDetails
          open={true}
          onSave={handleAddActivtyNotes}
          onClose={() => setSelectedActivity(null)}
          leadFullName={selectedLead?.fullName}
          activityObj={selectedActivity}
          leadsId={selectedLead?.leadsId}
        />
      )}
      {selectedCall && (
        <CallDetails
          open={true}
          onClose={() => setSelectedCall(null)}
          callObj={selectedCall}
        />
      )}
    </>
  );
}
