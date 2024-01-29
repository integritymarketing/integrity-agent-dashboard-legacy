import React, { useState } from "react";
import Media from "react-media";
import Grid from "@mui/material/Grid";
import { Button } from "components/ui/Button";
import Person from "components/icons/personLatest";
import Started from "components/icons/BookofBusiness/policySnapshot/started";
import Submitted from "components/icons/BookofBusiness/policySnapshot/submitted";
import Pending from "components/icons/BookofBusiness/policySnapshot/pending";
import UpComing from "components/icons/BookofBusiness/policySnapshot/upcoming";
import Active from "components/icons/BookofBusiness/policySnapshot/active";
import InActive from "components/icons/BookofBusiness/policySnapshot/inActive";
import Declined from "components/icons/BookofBusiness/policySnapshot/declined";
import Terminated from "components/icons/BookofBusiness/policySnapshot/terminated";
import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "utils/shared-utils/sharedUtility";
import "./style.scss";

const renderIcons = {
  Started: <Started />,
  Submitted: <Submitted />,
  Pending: <Pending />,
  Upcoming: <UpComing />,
  Active: <Active />,
  InActive: <InActive />,
  Declined: <Declined />,
  Terminated: <Terminated />,
};

const PolicyCard = ({ callData }) => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const policyStatus = callData?.policyStatus
    ? capitalizeFirstLetter(callData?.policyStatus)
    : "";

  return (
    <div className="policy-card">
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={6} md={4} sx={{ color: "#434A51" }}>
          <p className="policy-name">{callData?.planName}</p>
          {callData?.policyNumber && (
            <p>
              <span className="policy-label">Policy ID:</span>
              <span className="policy-info ml-5">{callData?.policyNumber}</span>
            </p>
          )}
          <p>
            <span className="policy-label">Carrier:</span>{" "}
            <span className="policy-info ml-5"> {callData?.carrier}</span>
          </p>
        </Grid>
        <Grid
          item
          xs={6}
          md={2}
          alignSelf={"center"}
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div className="policy-info">Policy Holder</div>{" "}
          <div className="policy-info-bold">{callData?.policyHolder}</div>
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
          <div className="startedIcon">{renderIcons[policyStatus]}</div>
          <div className="policy-info">{policyStatus}</div>
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
            icon={<Person color="#ffffff" />}
            label={"View Contact"}
            className={"policy-card-link-btn"}
            onClick={() => navigate(`/contact/${callData?.leadId}`)}
            type="tertiary"
            style={isMobile ? { padding: "11px 6px" } : {}}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const PolicyList = ({ policyCount, policyList, handleJumpList }) => {
  return (
    <>
      <div className="policy-card-container">
        {policyList?.length > 0 &&
          policyList?.map((data) => {
            return <PolicyCard callData={data} />;
          })}
      </div>
      {policyCount > 5 && (
        <div className="jumpList-card">
          <Button
            type="tertiary"
            label="Jump to List"
            className="jumpList-btn"
            onClick={handleJumpList}
          />
        </div>
      )}

    </>
  );
};

export default PolicyList;