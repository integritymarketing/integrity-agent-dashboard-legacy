import React, { useState } from "react";
import Media from "react-media";
import Grid from "@mui/material/Grid";
import TooltipMUI from "packages/ToolTip";
import { Button } from "components/ui/Button";
import Person from "components/icons/personLatest";
import ReminderIcon from "images/Reminder.svg";
import Reminder_Overdue from "images/Reminder_Overdue.svg";
import RoundCheck from "components/icons/round-check";
import Dialog from "packages/Dialog";
import NoReminder from "images/no-reminder.svg";
import "./style.scss";

const mockData = [
  {
    name: "Amber Smith",
    reminder: "Call client to discuss plans shared.",
    date: "04/20/23",
    policyHolder: "Anne Polsen",
    policyStatus: "Started",
    isReminderDue: false,
  },
  {
    name: "Robert Paulson",
    reminder: "Check on SOA.",
    date: "08/20/23",
    policyHolder: "Anne Polsen",
    policyStatus: "Started",
    isReminderDue: true,
  },
];

const RemindersCard = ({ callData }) => {
  const [isMobile, setIsMobile] = useState(false);

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
            <p className="reminder-name">{callData.name}</p>
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
              <p className="reminder-name">{callData.name}</p>
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
                {callData?.isReminderDue ? (
                  <img src={Reminder_Overdue} alt="rem_due" />
                ) : (
                  <img src={ReminderIcon} alt="rem_new" />
                )}
              </div>
              <div
                className={`reminder-info ${
                  callData?.isReminderDue ? "overDue" : ""
                }`}
              >
                {callData.date}
              </div>
            </Grid>
          </Grid>
        )}

        <Grid item xs={6} md={3} className="reminder-mobile">
          <div className="roundIcon">
            <RoundCheck />
          </div>
          <div className="reminder-info">{callData.reminder}</div>
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
              {callData?.isReminderDue ? (
                <img src={Reminder_Overdue} alt="rem_due" />
              ) : (
                <img src={ReminderIcon} alt="rem_new" />
              )}
            </div>
            <div
              className={`reminder-info ${
                callData?.isReminderDue ? "overDue" : ""
              }`}
            >
              {callData.date}
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
            onClick={() => console.log("View Contact Clicked")}
            type="tertiary"
            style={isMobile ? { padding: "11px 6px" } : {}}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const RemindersList = ({ isError }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isError) {
    return (
      <div className="error-container">
        <p className="error-text">Status Temporarily Unavailable</p>
        <TooltipMUI
          titleData={
            "Service partner is not returning current status. Please try again later."
          }
          onClick={() => setDialogOpen(true)}
        />
        <Dialog
          title="ERROR"
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          titleWithIcon={false}
        >
          <p>
            Service partner is not returning current status. Please try again
            later.
          </p>
        </Dialog>
      </div>
    );
  } else if (mockData.length === 0) {
    return (
      <div className="no-data-container">
        <div className="no-data-icon-container">
          <img src={NoReminder} className="no-data-icon" alt="No policy Data" />
        </div>
        <div className="no-data-text-container">
          <p className="no-data-text-heading">
            There are no reminders to display at this time.
          </p>
          <p className="no-data-text-desc">
            To learn more about how you can receive leads through consumer
            callback requests,
            <a
              href="/MedicareCENTER-Requested-Callbacks-Guide.pdf"
              className="click-here-link"
            >
              click here.
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="reminder-card-container">
        {mockData.map((data) => {
          return <RemindersCard callData={data} />;
        })}
      </div>
      <div className="jumpList-card">
        <Button type="tertiary" label="Show More" className="jumpList-btn" />
      </div>
    </>
  );
};

export default RemindersList;
