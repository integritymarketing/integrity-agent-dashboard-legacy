import React, { useState } from "react";
import Media from "react-media";
import Grid from "@mui/material/Grid";
import { Button } from "components/ui/Button";
import Person from "components/icons/personLatest";
import PolicyStarted from "components/icons/policyStarted";
import "./style.scss";
const mockData = [
  {
    policyName: "Humana HMO 2343",
    policyId: "252456",
    policyCarrier: "Humana",
    policyHolder: "Anne Polsen",
    policyStatus: "Started",
  },
  {
    policyName: "Humana HMO 2343",
    policyId: "252456",
    policyCarrier: "Humana",
    policyHolder: "Anne Polsen",
    policyStatus: "Started",
  },
];

const UnLinkedCallCard = ({ callData }) => {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <div className="policy-card">
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={6} md={3} sx={{ color: "#434A51" }}>
          <p>{callData.policyName}</p>
          <p>
            <span className="date-time-duration-text">Policy Id:</span>{" "}
            {callData.policyId}
          </p>
          <p>
            <span className="date-time-duration-text">Policy Carrier:</span>{" "}
            {callData.policyCarrier}
          </p>
        </Grid>
        <Grid
          item
          xs={6}
          md={3}
          alignSelf={"center"}
          sx={{ textAlign: "center", color: "#434A51" }}
        >
          <p>{callData.policyHolder} </p>
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
          <p>
            <span className="date-time-duration-text">
              <PolicyStarted />
            </span>
            {callData.policyStatus}
          </p>
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
            icon={<Person />}
            label={"View contact"}
            className={"policy-card-link-btn"}
            onClick={() => console.log("View contact clicked")}
            type="tertiary"
            style={isMobile ? { padding: "11px 6px" } : {}}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const PolicyList = () => {
  console.log(mockData);

  return (
    <>
      <div className="policy-card-container">
        {mockData.map((data) => {
          return <UnLinkedCallCard callData={data} />;
        })}
      </div>
      <div className="jumpList-card">
        <Button type="tertiary" label="Jump to List" className="jumpList-btn" />
      </div>
    </>
  );
};

export default PolicyList;
