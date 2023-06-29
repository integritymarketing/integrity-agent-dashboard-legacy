import React, { useState } from "react";
import Media from "react-media";
import Grid from "@mui/material/Grid";
import { Button } from "components/ui/Button";
import Person from "components/icons/personLatest";
import ReminderIcon from "images/Reminder.svg";
import Reminder_Overdue from "images/Reminder_Overdue.svg";
import RoundCheck from "components/icons/round-check";
import { dateFormatter } from "utils/dateFormatter";
import { useHistory } from "react-router-dom";
import { isOverDue } from "utils/dates";
import clientsService from "services/clientsService";
import * as Sentry from "@sentry/react";
import useToast from "hooks/useToast";
import "./style.scss";

const RemindersCard = ({ callData, refreshData }) => {
  const [isMobile, setIsMobile] = useState(false);
  const history = useHistory();
  const addToast = useToast();

  const isReminderDue = isOverDue(callData?.taskDate);

  const completeReminder = () => {
    let payload = {
      reminderId: callData?.id,
      leadId: callData?.leadId,
      isComplete: true,
    };

    clientsService
      .updateReminder(payload)
      .then((data) => {
        addToast({
          type: "success",
          message: "Reminder successfully Updated.",
          time: 3000,
        });
        refreshData(callData?.id);
      })
      .catch((e) => {
        Sentry.captureException(e);
      });
  };

  return (
    <div className="reminder-card">
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <Grid container className={"infoContainer"} spacing={2}>
        {!isMobile && (
          <Grid item xs={6} alignSelf={"center"} md={3}>
            <p className="reminder-name">
              {`${callData?.firstName}   ${callData?.lastName}`}
            </p>
          </Grid>
        )}

        {isMobile && (
          <Grid
            sx={{
              textAlign: "right",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 20px 0px 20px",
            }}
          >
            <Grid
              item
              xs={6}
              md={3}
              sx={{
                textAlign: "right",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <p className="reminder-name">
                {`${callData?.firstName}   ${callData?.lastName}`}
              </p>
            </Grid>{" "}
            <Grid
              item
              xs={6}
              md={3}
              alignSelf={"center"}
              sx={{
                textAlign: "right",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <div className="startedIcon">
                {isReminderDue ? (
                  <img src={Reminder_Overdue} alt="rem_due" />
                ) : (
                  <img src={ReminderIcon} alt="rem_new" />
                )}
              </div>
              <div
                className={`reminder-info ${isReminderDue ? "overDue" : ""}`}
              >
                {dateFormatter(callData?.taskDate, "MM/DD/yyyy")}
              </div>
            </Grid>
          </Grid>
        )}

        <Grid item xs={6} md={3} className="reminder-mobile">
          <div className="roundIcon" onClick={completeReminder}>
            <RoundCheck />
          </div>
          <div className="reminder-info" title={callData?.remindersNotes}>
            {callData?.remindersNotes}
          </div>
        </Grid>
        {!isMobile && (
          <Grid
            item
            xs={6}
            md={3}
            alignSelf={"center"}
            sx={{
              textAlign: "right",
              display: "flex",
              alignItems: "center",
              justifyContent: isMobile ? "flex-start" : "center",
            }}
          >
            <div className="startedIcon">
              {isReminderDue ? (
                <img src={Reminder_Overdue} alt="rem_due" />
              ) : (
                <img src={ReminderIcon} alt="rem_new" />
              )}
            </div>
            <div className={`reminder-info ${isReminderDue ? "overDue" : ""}`}>
              {dateFormatter(callData?.taskDate, "MM/DD/yyyy")}
            </div>
          </Grid>
        )}
        <Grid
          item
          xs={6}
          md={3}
          alignSelf={"center"}
          className="reminder-button-mobile"
        >
          <Button
            icon={<Person />}
            label={"View Contact"}
            className={"reminder-card-link-btn"}
            onClick={() => history.push(`/contact/${callData?.leadId}`)}
            type="tertiary"
            style={isMobile ? { padding: "11px 6px" } : {}}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const RemindersList = ({ taskList, refreshData }) => {
  return (
    <>
      <div className="reminder-card-container">
        {taskList?.map((data, i) => {
          return <RemindersCard callData={data} refreshData={refreshData} />;
        })}
      </div>
    </>
  );
};

export default RemindersList;
