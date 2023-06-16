import React, { useState } from "react";
import Media from "react-media";
import Grid from "@mui/material/Grid";
import { Button } from "components/ui/Button";
import Person from "components/icons/personLatest";
import ReminderIcon from "images/Reminder.svg";
import Reminder_Overdue from "images/Reminder_Overdue.svg";
import RoundCheck from "components/icons/round-check";
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
