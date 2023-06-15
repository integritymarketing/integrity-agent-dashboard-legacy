import React, { useState } from "react";
import Media from "react-media";
import Grid from "@mui/material/Grid";
import TooltipMUI from "packages/ToolTip";
import { Button } from "components/ui/Button";
import Dialog from "packages/Dialog";
import { ReactComponent as LinkContactCircle } from "pages/dashbaord/LinkContactCircle.svg";
import NoUnlinkedPolicy from "images/no-unlinked-policies.svg";

import "./style.scss";
const mockData = [
  {
    policyName: "Humana HMO 2343",
    policyId: "252456",
    policyCarrier: "Humana",
    lastName: "Polsen",
    firstName: "Anne",
    policyStatus: "Started",
  },
  {
    policyName: "Humana HMO 2343",
    policyId: "252456",
    policyCarrier: "Humana",
    lastName: "Polsen",
    firstName: "Anne",
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
      <Grid container className={"infoContainer"} spacing={2}>
        <Grid
          item
          xs={6}
          alignSelf={!isMobile ? "center" : ""}
          md={5}
          className="policy-mobile"
        >
          <p className="up-name">{callData?.policyName}</p>
          <p>
            <span className="up-label">Policy Id:</span>
            <span className="up-info">{callData?.policyId}</span>
          </p>
          <p>
            <span className="up-label">Policy Carrier:</span>
            <span className="up-info"> {callData?.policyCarrier}</span>
          </p>
        </Grid>

        <Grid
          item
          xs={6}
          md={3}
          alignSelf={!isMobile ? "center" : ""}
          className="policy-holder-mobile"
        >
          <div className="up-label-bold">
            Policy Holder {isMobile ? ":" : ""}
          </div>
          <div className="up-info-bold">
            {callData?.firstName + callData?.lastName}
          </div>
        </Grid>
        <Grid
          item
          xs={6}
          md={4}
          alignSelf={"center"}
          className="policy-button-mobile"
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

const UnlinkedPolicyList = ({ isError }) => {
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
            src={NoUnlinkedPolicy}
            className="no-data-icon"
            alt="No policy Data"
          />
        </div>
        <div className="no-data-text-container">
          <p className="no-data-text-heading">
            There are no unlinked policies at this time.
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
      <div className="up-card-container">
        {mockData?.map((data) => {
          return <UnlinkedPolicyCard callData={data} />;
        })}
      </div>
      {mockData?.length > 5 && (
        <div className="jumpList-card">
          <Button type="tertiary" label="Show More" className="jumpList-btn" />
        </div>
      )}
    </>
  );
};

export default UnlinkedPolicyList;
