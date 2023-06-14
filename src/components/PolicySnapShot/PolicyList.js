import React, { useState } from "react";
import Media from "react-media";
import Grid from "@mui/material/Grid";
import TooltipMUI from "packages/ToolTip";
import { Button } from "components/ui/Button";
import Person from "components/icons/personLatest";
import Started from "components/icons/BookofBusiness/policySnapshot/started";
import Submitted from "components/icons/BookofBusiness/policySnapshot/submitted";
import Pending from "components/icons/BookofBusiness/policySnapshot/pending";
import UpComing from "components/icons/BookofBusiness/policySnapshot/upcoming";
import Active from "components/icons/BookofBusiness/policySnapshot/active";
import InActive from "components/icons/BookofBusiness/policySnapshot/inActive";
import Declined from "components/icons/BookofBusiness/policySnapshot/declined";
import { useHistory } from "react-router-dom";
import PolicyNoData from "./policy-no-data.svg";
import { capitalizeFirstLetter } from "utils/shared-utils/sharedUtility";
import "./style.scss";

const renderIcons = {
  started: <Started />,
  submitted: <Submitted />,
  pending: <Pending />,
  upComing: <UpComing />,
  active: <Active />,
  inActive: <InActive />,
  declined: <Declined />,
};

const PolicyCard = ({ callData }) => {
  const [isMobile, setIsMobile] = useState(false);
  const history = useHistory();

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
          <p className="policy-name">{callData.planName}</p>
          <p>
            <span className="policy-label">Policy ID:</span>
            <span className="policy-info ml-5">{callData.policyNumber}</span>
          </p>
          <p>
            <span className="policy-label">Carrier:</span>{" "}
            <span className="policy-info ml-5"> {callData.carrier}</span>
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
          <div className="policy-info-bold">{callData.policyHolder}</div>
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
            {renderIcons[callData.policyStatus]}
          </div>
          <div className="policy-info">
            {capitalizeFirstLetter(callData.policyStatus)}
          </div>
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
            className={"policy-card-link-btn"}
            onClick={() => history.push(`/contact/${callData?.leadId}`)}
            type="tertiary"
            style={isMobile ? { padding: "11px 6px" } : {}}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const PolicyList = ({ policyList, isError, handleJumpList }) => {
  return (
    <>
      <div className="policy-card-container">
        {isError ? (
          <div className="error-container">
            <p className="error-text">Status Temporarily Unavailable</p>
            <TooltipMUI
              titleData={
                "Pharmacy service partner is not returning current status. Please try again later."
              }
            />
          </div>
        ) : !isError && policyList?.length > 0 ? (
          policyList?.map((data) => {
            return <PolicyCard callData={data} />;
          })
        ) : (
          <div className="no-data-container">
            <div className="no-data-icon-container">
              <img
                src={PolicyNoData}
                className="no-data-icon"
                alt="No policy Data"
              />
            </div>
            <div className="no-data-text-container">
              <p className="no-data-text-heading">
                There is no policy information available for you at this time.
              </p>
              <p className="no-data-text-desc">
                New policies will be displayed here once they are submitted.
                Please contact your marketer for more information.
              </p>
            </div>
          </div>
        )}
      </div>
      {policyList?.length > 0 && (
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
