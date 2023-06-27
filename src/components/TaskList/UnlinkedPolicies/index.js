import React, { useState } from "react";
import Media from "react-media";
import Grid from "@mui/material/Grid";
import { Button } from "components/ui/Button";
import { ReactComponent as LinkContactCircle } from "pages/dashbaord/LinkContactCircle.svg";
import { useHistory } from "react-router-dom";
import "./style.scss";

const UnlinkedPolicyCard = ({ callData }) => {
  const [isMobile, setIsMobile] = useState(false);
  const history = useHistory();

  const linkToContact = () => {
    const data = {
      agentNpn: "17138811",
      leadId: "2288457",
      policyNumber: "522914424",
      plan: "1jzrm179w3",
      carrier: null,
      policyStatus: "submitted",
      consumerSource: "Medicare Center",
      confirmationNumber: "dVzSPUzwJV",
      consumerFirstName: "arsenio",
      consumeLastName: "assin",
      policyEffectiveDate: "2023-12-11T00:00:00",
      appSubmitDate: "2023-11-29T00:00:00",
      hasPlanDetails: false,
      page: "Dashboard",
    };

    history.push(`/enrollment-link-to-contact`, {
      state: data,
    });
  };

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
            <span className="up-label">Policy ID:</span>
            <span className="up-info">{callData?.policyId}</span>
          </p>
          <p>
            <span className="up-label">Carrier:</span>
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
            {`${callData?.firstName}   ${callData?.lastName}`}
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
            onClick={linkToContact}
            type="tertiary"
            style={isMobile ? { padding: "11px 6px" } : {}}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const UnlinkedPolicyList = ({ taskList }) => {
  return (
    <>
      <div className="up-card-container">
        {taskList?.map((data, i) => {
          return <UnlinkedPolicyCard callData={data} />;
        })}
      </div>
    </>
  );
};

export default UnlinkedPolicyList;
