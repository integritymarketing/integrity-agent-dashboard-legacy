import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import Table from "packages/TableWrapper";
import { convertUTCDateToLocalDate } from "utils/dates";
import { dateFormatter } from "utils/dateFormatter";
import { TextButton } from "packages/Button";
import Typography from "@mui/material/Typography";
import ActivitySubjectWithIcon from "pages/ContactDetails/ActivitySubjectWithIcon";
import styles from "./Activities.module.scss";
/* import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
 */
import ActivityButtonIcon from "pages/ContactDetails/ActivityButtonIcon";

const initialState = {
  sortBy: [
    {
      id: "date",
      desc: false,
    },
    {
      id: "activity",
      desc: false,
    },
  ],
};

const buttonTextByActivity = {
  "Incoming Call": "Link to Contact",
  "Call Recording": "Download",
  "Contact's new call log created": "Download",
  "Outbound Call Recorded": "Download",
  "Incoming Call Recorded": "Download",
  "Scope of Appointment Signed": "Complete",
  "Scope of Appointment Completed": "View",
  "Plan Shared": "View PLans",
};

const renderButtons = (activity, handleClick) => {
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
        onClick={(e) => handleClick(activitySubject, activityInteractionURL)}
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

const isCustomActivity = (row) =>
  row.activityId && row.activityTypeName === "Note";

const renderActivtyActions = (row, handleDeleteActivity, setEditActivity) => {
  if (isCustomActivity(row)) {
    const handleEditClick = () => {
      setEditActivity(row);
    };
    return (
      <>
        <button
          className={styles.deleteTextAreaText}
          onClick={() => handleDeleteActivity(row)}
        >
          Delete
        </button>
        <button className={styles.ediTextAreaText} onClick={handleEditClick}>
          Edit
        </button>
      </>
    );
  }
};
export default function ActivitiesTable({
  data = [],
  onShowMore,
  pageHasMoreRows,
  onActivityClick,
  leadId,
  handleDeleteActivity,
  setEditActivity,
}) {
  const history = useHistory();

  const handleClick = useCallback(
    (activitySubject, activityInteractionURL) => {
      switch (activitySubject) {
        case "Scope of Appointment Signed":
        case "Scope of Appointment Completed":
          history.push(
            `/contact/${leadId}/soa-confirm/${activityInteractionURL}`
          );
          break;
        case "Plan Shared":
          // TODO : change it with plan interaction URL
          break;
        case "Call Recording":
        case "Incoming Call Recorded":
        case "Outbound Call Recorded":
          window.open(activityInteractionURL, "_blank");
          break;
        case "Contact's new call log created":
          window.open(activityInteractionURL, "_blank");
          break;
        default:
          break;
      }
    },
    [history, leadId]
  );

  const columns = useMemo(
    () => [
      {
        id: "date",
        Header: "Date",
        accessor: (row) => new Date(row?.original?.createDate),
        Cell: ({ row }) => {
          let date = convertUTCDateToLocalDate(row?.original?.createDate);
          return (
            <span onClick={() => onActivityClick(row?.original)}>
              {dateFormatter(date, "MM/DD/yyyy")}
            </span>
          );
        },
      },
      {
        id: "activity",
        accessor: (row) => row?.original?.activitySubject,
        Header: "Activity",
        Cell: ({ row }) => (
          <div className={styles.activityDataCell}>
            <ActivitySubjectWithIcon
              activitySubject={row?.original?.activitySubject}
            />
            <Typography noWrap onClick={() => onActivityClick(row?.original)}>
              <strong>{row?.original?.activitySubject} </strong>
              <span>{row?.original?.activityBody}</span>
            </Typography>
          </div>
        ),
      },
      {
        id: "status",
        disableSortBy: true,
        Header: "",
        Cell: ({ row }) => <>{renderButtons(row?.original, handleClick)}</>,
      },
      {
        id: "actions",
        disableSortBy: true,
        Header: "",
        Cell: ({ row }) => (
          <>
            {renderActivtyActions(
              row?.original,
              handleDeleteActivity,
              setEditActivity
            )}
          </>
        ),
      },
      /*       { 
        id: "more",
        disableSortBy: true,
        Header: "",
        Cell: ({ row }) => (
          false && <span onClick={() => onActivityClick(row?.original)}>
            <MoreHorizOutlinedIcon />
          </span>
        ),
      }, */
    ],
    [onActivityClick, handleClick, setEditActivity, handleDeleteActivity]
  );

  return (
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
  );
}
