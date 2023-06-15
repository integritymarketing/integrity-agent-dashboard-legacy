import React, { useState } from "react";
import Media from "react-media";
import Grid from "@mui/material/Grid";
import TooltipMUI from "packages/ToolTip";
import { Button } from "components/ui/Button";
import Person from "components/icons/personLatest";
import Dialog from "packages/Dialog";
import PolicyStarted from "components/icons/policyStarted";
import NoRequestedCallback from 'images/no-requested-callback.svg';
import "./style.scss";

// const mockData = [
//   {
//     name: "Amber Smith",
//     reminder: "Call client to discuss plans shared.",
//     date: "04/20/23",
//     policyHolder: "Anne Polsen",
//     policyStatus: "Started",
//   },
//   {
//     name: "Robert Paulson",
//     reminder: "Check on SOA.",
//     date: "08/20/23",
//     policyHolder: "Anne Polsen",
//     policyStatus: "Started",
//   },
// ];

const mockData = [];

const RequestedCallbackCard = ({ callData }) => {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <div className="reminder-card">
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={6} alignSelf={"center"} md={3} sx={{ color: "#434A51" }}>
          <p className="reminder-name">{callData.name}</p>
        </Grid>

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
          <div className="startedIcon">
            <PolicyStarted />
          </div>
          <div className="reminder-info">{callData.reminder}</div>
        </Grid>
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
            <PolicyStarted />
          </div>
          <div className="reminder-info">{callData.date}</div>
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
            width: "30%",
          }}
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

const RequestedCallback = ({ isError }) => {

  const [dialogOpen, setDialogOpen] = useState(false);

  if(isError) {

    return (
        <div className="error-container">
          <p className="error-text">Status Temporarily Unavailable</p>
          <TooltipMUI 
            titleData={"Service partner is not returning current status. Please try again later."} 
            onClick={() => setDialogOpen(true)}
          />
          <Dialog
            title='ERROR'
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            titleWithIcon={false}
          >
            <p>Service partner is not returning current status. Please try again later.</p>
          </Dialog>
        </div>
    );
  } else if(mockData.length === 0) {

    return (

      <div className="no-data-container">
            <div className="no-data-icon-container">
              <img src={NoRequestedCallback} className="no-data-icon" alt="No policy Data" />
            </div>
            <div className="no-data-text-container">
              <p className="no-data-text-heading">There are no requested callbacks at this time..</p>
              <p className="no-data-text-desc">To learn more about how you can receive leads through consumer callback requests, 
              <a href="/MedicareCENTER-Requested-Callbacks-Guide.pdf" className="click-here-link">click here.</a></p>
            </div>
          </div>
    )
  }

  return (
    <>
      <div className="reminder-card-container">
        {mockData.map((data) => {
          return <RequestedCallbackCard callData={data} />;
        })}
      </div>
      <div className="jumpList-card">
        <Button type="tertiary" label="Jump to List" className="jumpList-btn" />
      </div>
    </>
  );
};

export default RequestedCallback;
