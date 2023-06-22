import React, { useState } from "react";
import Media from "react-media";
import Grid from "@mui/material/Grid";
import { Button } from "components/ui/Button";
import Person from "components/icons/personLatest";
import PolicyStarted from "components/icons/policyStarted";
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

const RequestedCallback = () => {
  return (
    <>
      <div className="reminder-card-container">
        {mockData.map((data) => {
          return <RequestedCallbackCard callData={data} />;
        })}
      </div>
    </>
  );
};

export default RequestedCallback;
