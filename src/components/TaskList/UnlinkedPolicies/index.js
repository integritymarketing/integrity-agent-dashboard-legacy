import React, { useState } from "react";
import Media from "react-media";
import Grid from "@mui/material/Grid";
import { Button } from "components/ui/Button";
import { ReactComponent as LinkContactCircle } from "pages/dashbaord/LinkContactCircle.svg";

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

const UnlinkedPolicyCard = ({ callData }) => {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <div className="up-card">
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={6} alignSelf={"center"} md={5} sx={{ color: "#434A51" }}>
          <p className="up-name">{callData.policyName}</p>
          <p>
            <span className="up-label">Policy Id:</span>
            <span className="up-info">{callData.policyId}</span>
          </p>
          <p>
            <span className="up-label">Policy Carrier:</span>{" "}
            <span className="up-info"> {callData.policyCarrier}</span>
          </p>
        </Grid>

        <Grid item xs={6} md={3} alignSelf={"center"}>
          <div className="up-label-bold">Policy Holder</div>{" "}
          <div className="up-info-bold">{callData.policyHolder}</div>
        </Grid>
        <Grid
          item
          xs={6}
          md={4}
          alignSelf={"center"}
          sx={{
            textAlign: "right",
            display: "flex",
            justifyContent: "center",
            width: "30%",
          }}
        >
          <Button
            icon={<LinkContactCircle />}
            label={"Link to contact"}
            className={"unlink-card-link-btn"}
            onClick={() => console.log("link to contact clicked")}
            type="tertiary"
            style={isMobile ? { padding: "11px 6px" } : {}}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const UnlinkedPolicyList = () => {
  console.log(mockData);

  return (
    <>
      <div className="up-card-container">
        {mockData.map((data) => {
          return <UnlinkedPolicyCard callData={data} />;
        })}
      </div>
      <div className="jumpList-card">
        <Button type="tertiary" label="Jump to List" className="jumpList-btn" />
      </div>
    </>
  );
};

export default UnlinkedPolicyList;
