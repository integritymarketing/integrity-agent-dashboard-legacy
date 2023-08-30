import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import Table from "packages/TableWrapper";
import { convertUTCDateToLocalDate } from "utils/dates";
import { dateFormatter } from "utils/dateFormatter";
import { TextButton } from "packages/Button";
import Typography from "@mui/material/Typography";
import ActivitySubjectWithIcon from "pages/ContactDetails/ActivitySubjectWithIcon";
import ActivityButtonIcon from "pages/ContactDetails/ActivityButtonIcon";
import styles from "./Activities.module.scss";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { useRecoilState } from "recoil";
import state from "./state";
import comparePlansService from "services/comparePlansService";
import useUserProfile from "hooks/useUserProfile";

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
  "Plan Shared": "View Plans",
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
    (activityTypeName === "Triggered" ||
      activitySubject === "Meeting Recorded") &&
    activityInteractionURL
  ) {
    return (
      <div
        className={styles.activityDataCell}
        onClick={(e) => handleClick(activitySubject, activityInteractionURL)}
      >
        <ActivityButtonIcon
          activitySubject={activitySubject}
          route="contactDetail"
        />
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
  isMobile,
}) {
  const history = useHistory();
  const [fullList, setFullList] = useState([]);

  const [, setActivitiesSortBy] = useRecoilState(
    state.atoms.activitiesSortingByDateAtom
  );

  const userProfile = useUserProfile();
  const { npn } = userProfile;

  useEffect(() => {
    setFullList([...data]);
  }, [data]);

  const handleClick = useCallback(
    async (activitySubject, activityInteractionURL) => {
      const splitViewPlansURL = activityInteractionURL.split("/");

      switch (activitySubject) {
        case "Scope of Appointment Signed":
        case "Scope of Appointment Completed":
          history.push(
            `/contact/${leadId}/soa-confirm/${activityInteractionURL}`
          );
          break;
        case "Plan Shared":
          history.push(
            `/plans/${leadId}/compare/${splitViewPlansURL[7]}/${splitViewPlansURL[8]}`
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
          let link = await comparePlansService?.getPdfSource(
            activityInteractionURL,
            npn
          );
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
    },
    [history, leadId, npn]
  );

  const webColumns = useMemo(
    () => [
      {
        id: "date",
        Header: "Date",
        accessor: (row) =>
          row?.original?.modifyDate
            ? row?.original?.modifyDate
            : row?.original?.createDate,
        Cell: ({ row }) => {
          let date = convertUTCDateToLocalDate(
            row?.original?.modifyDate
              ? row?.original?.modifyDate
              : row?.original?.createDate
          );
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
      {
        id: "more",
        disableSortBy: true,
        Header: "",
        Cell: ({ row }) => (
          <span onClick={() => onActivityClick(row?.original)}>
            <MoreHorizOutlinedIcon />
          </span>
        ),
      },
    ],
    [onActivityClick, handleClick, setEditActivity, handleDeleteActivity]
  );

  const mobileColumns = useMemo(
    () => [
      {
        id: "date",
        Header: "Date",
        accessor: (row) =>
          row?.original?.modifyDate
            ? row?.original?.modifyDate
            : row?.original?.createDate,
        Cell: ({ row }) => {
          let date = convertUTCDateToLocalDate(
            row?.original?.modifyDate
              ? row?.original?.modifyDate
              : row?.original?.createDate
          );
          return (
            <span onClick={() => onActivityClick(row?.original)}>
              {dateFormatter(date, "MM/DD/YY")}
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
              <strong>
                {row?.original?.activitySubject?.length > 15
                  ? `${row?.original?.activitySubject?.slice(0, 13)}...`
                  : row?.original?.activitySubject}
              </strong>
            </Typography>
          </div>
        ),
      },
      {
        id: "more",
        disableSortBy: true,
        Header: "",
        Cell: ({ row }) => (
          <span onClick={() => onActivityClick(row?.original)}>
            <MoreHorizOutlinedIcon />
          </span>
        ),
      },
    ],
    [onActivityClick]
  );

  let columns = isMobile ? mobileColumns : webColumns;

  const handleSortUpdate = (value) => {
    switch (value) {
      case "Date":
        setActivitiesSortBy((sort) => {
          return {
            column: "createDate",
            order: sort.order === "desc" ? "asc" : "desc",
          };
        });
        break;
      case "Activity":
        setActivitiesSortBy((sort) => {
          return {
            column: "activitySubject",
            order: sort.order === "desc" ? "asc" : "desc",
          };
        });
        break;
      default:
        setActivitiesSortBy((sort) => {
          return {
            column: "createDate",
            order: "desc",
          };
        });
    }
  };

  return (
    <Table
      handleSort={handleSortUpdate}
      initialState={initialState}
      data={fullList}
      columns={columns}
      footer={
        pageHasMoreRows ? (
          <TextButton onClick={onShowMore}>Show more</TextButton>
        ) : null
      }
    />
  );
}
