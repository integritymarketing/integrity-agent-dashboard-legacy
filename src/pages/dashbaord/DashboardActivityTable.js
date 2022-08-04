import React, { useMemo } from "react";
import "./activitytable.scss";
import Table from "../../packages/TableWrapper";
import { useHistory } from "react-router-dom";

import { dateFormatter } from "utils/dateFormatter";
import { TextButton } from "packages/Button";
import Typography from "@mui/material/Typography";
import ActivitySubjectWithIcon from "pages/ContactDetails/ActivitySubjectWithIcon";
import styles from "./DashboardActivityTable.module.scss";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import Heading2 from "packages/Heading2";
// import Filter from "components/icons/activities/Filter";
// import ActiveFilter from "components/icons/activities/ActiveFilter";
import ActivityButtonIcon from "pages/ContactDetails/ActivityButtonIcon";

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
  "Call Recorded": "Download",
  "Scope of Appointment Signed": "Complete",
  "Scope of Appointment Completed": "View",
  "Plan Shared": "View PLans",
};

const renderButtons = (row, leadsId, onRowClick) => {
  if (!row) return false;
  const {
    activityTypeName = "",
    activityInteractionURL = "",
    activitySubject = "",
  } = row;
  if (
    activityTypeName &&
    activityTypeName === "Triggered" &&
    activityInteractionURL
  ) {
    return (
      <div className={styles.activityDataCell}>
        <ActivityButtonIcon
          activitySubject={activitySubject}
          activityInteractionURL={activityInteractionURL}
          leadsId={leadsId}
        />
        <Typography
          color="#434A51"
          fontSize={"16px"}
          noWrap
          onClick={() => onRowClick(row)}
        >
          {buttonTextByActivity[activitySubject]}
        </Typography>
      </div>
    );
  }
  return false;
};

export default function DashboardActivityTable({
  data = [],
  pageHasMoreRows,
  onShowMore,
  onRowClick,
}) {
  const history = useHistory();
  // const [filterToggle, setFilterToggle] = useState(false); // TODO enable for filter icons

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
        id: "status",
        disableSortBy: true,
        Header: "",
        Cell: ({ row }) => (
          <>
            {renderButtons(
              row?.original?.activities[0],
              row?.original?.leadsId,
              onRowClick
            )}
          </>
        ),
      },
      {
        id: "more",
        disableSortBy: true,
        // Header: () => (
        //   <span
        //     className={
        //       filterToggle
        //         ? `${styles.filterActive} ${styles.filter}`
        //         : styles.filter
        //     }
        //   >
        //     {filterToggle ? (
        //       <ActiveFilter onMouseOut={() => setFilterToggle(false)} />
        //     ) : (
        //       <Filter onMouseOver={() => setFilterToggle(true)} />
        //     )}
        //   </span>
        // ),
        Header: "",
        Cell: ({ row }) => (
          <span onClick={() => onRowClick(row?.original?.activities[0])}>
            <MoreHorizOutlinedIcon />
          </span>
        ),
      },
    ],
    [onRowClick, history] // TODO add filterToggle
  );

  return (
    <>
      <Heading2 className={styles.recentActivity} text="Recent Activity" />
      <Table
        initialState={initialState}
        data={data}
        columns={columns}
        footer={
          pageHasMoreRows ? (
            <TextButton onClick={onShowMore}>Show more</TextButton>
          ) : null
        }
      />
    </>
  );
}
