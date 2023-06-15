import React, { useState } from "react";
import Media from "react-media";
import Grid from "@mui/material/Grid";
import { Button } from "components/ui/Button";
import TooltipMUI from "packages/ToolTip";
import Dialog from "packages/Dialog";
import { ReactComponent as LinkContactCircle } from "./LinkContactCircle.svg";
import { ReactComponent as DownloadDashboard } from "./DownloadDashboard.svg";
import NoUnlinkedCalls from "images/no-unlinked-calls.svg";

// const mockData = [
//   {
//     date: "04/12/23",
//     time: "2:30 pm",
//     duration: "2:30 pm",
//     contact: "546-555-0812",
//   },
//   {
//     date: "04/28/23",
//     time: "3:24 pm",
//     duration: "5:43",
//     contact: "866-555-3521",
//   },
//   {
//     date: "05/06/23",
//     time: "10:32 am",
//     duration: "10:25",
//     contact: "801-555-8542",
//   },
//   {
//     date: "05/12/23",
//     time: "2:30 am",
//     duration: "0:45",
//     contact: "645-555-5445",
//   },
// ];
const mockData = [];

const UnLinkedCallCard = ({ callData }) => {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <div className="unlink-card">
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={6} md={3} sx={{ color: "#434A51" }}>
          <p>
            <span className="date-time-duration-text">Date:</span>{" "}
            {callData.date}
          </p>
          <p>
            <span className="date-time-duration-text">Time:</span>{" "}
            {callData.time}
          </p>
          <p>
            <span className="date-time-duration-text">Duration:</span>{" "}
            {callData.duration}
          </p>
        </Grid>
        <Grid
          item
          xs={6}
          md={3}
          alignSelf={"center"}
          sx={{ textAlign: "center", color: "#434A51" }}
        >
          <p>8789330638 </p>
        </Grid>
        <Grid
          item
          xs={6}
          md={3}
          alignSelf={"center"}
          sx={{
            textAlign: "right",
            display: "flex",
            justifyContent: isMobile ? "flex-start" : "center",
          }}
        >
          <Button
            icon={<DownloadDashboard />}
            iconOnly={isMobile}
            label={isMobile ? "" : "Download"}
            onClick={() => console.log("Download clicked")}
            className={"unlink-card-download-btn"}
            type="secondary"
            style={isMobile ? { border: "none" } : {}}
          />
        </Grid>
        <Grid
          item
          xs={6}
          md={3}
          alignSelf={"center"}
          sx={{
            textAlign: "right",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            icon={<LinkContactCircle />}
            label={"Link to contact"}
            className={"unlink-card-link-btn"}
            onClick={() => console.log("link to contact clicked")}
            type="tertiary"
          />
        </Grid>
      </Grid>
    </div>
  );
};

const UnLinkedCalls = ({ isError, taskList }) => {
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
          <img
            src={NoUnlinkedCalls}
            className="no-data-icon"
            alt="No policy Data"
          />
        </div>
        <div className="no-data-text-container">
          <p className="no-data-text-heading">
            There are no unlinked calls at this time.
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
      <div className="unlink-card-container">
        {mockData.map((data) => {
          return <UnLinkedCallCard key={data.contact} callData={data} />;
        })}
      </div>
      <div className="show-more-card">
        <Button type="tertiary" label="Show More" className="show-more-btn" />
      </div>
    </>
  );
};

export default UnLinkedCalls;
