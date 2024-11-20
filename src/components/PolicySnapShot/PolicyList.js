import { useState } from "react";
import Media from "react-media";
import Grid from "@mui/material/Grid";
import { Button } from "components/ui/Button";
import Person from "components/icons/personLatest";
import { Active } from "../../components/icons/Health/active";
import { Declined } from "../../components/icons/Health/declined";
import { Inactive } from "../../components/icons/Health/inactive";
import { Pending } from "../../components/icons/Health/pending";
import { Started } from "../../components/icons/Health/started";
import { Submitted } from "../../components/icons/Health/submitted";
import { Upcoming } from "../../components/icons/Health/upcoming";
import { Unlinked } from "../../components/icons/Health/unlinked";
import { Returned } from "../../components/icons/Health/returned";
import { LifeStarted } from "../../components/icons/Life/started";
import { LifeSubmitted } from "../../components/icons/Life/submitted";
import { LifePending } from "../../components/icons/Life/pending";
import { LifeActive } from "../../components/icons/Life/active";
import { LifeInactive } from "../../components/icons/Life/inactive";
import { LifeDeclined } from "../../components/icons/Life/declined";
import { LifeUpcoming } from "../../components/icons/Life/upcoming";
import { LifeUnlinked } from "../../components/icons/Life/unlinked";
import { LifeReturned } from "../../components/icons/Life/returned";
import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "utils/shared-utils/sharedUtility";
import "./style.scss";
import PropTypes from "prop-types";

const healthIcons = {
    Started: <Started />,
    Submitted: <Submitted />,
    Pending: <Pending />,
    Active: <Active />,
    Inactive: <Inactive />,
    Declined: <Declined />,
    Upcoming: <Upcoming />,
    Unlinked: <Unlinked />,
    Returned: <Returned />,
};

const lifeIcons = {
    Started: <LifeStarted />,
    Submitted: <LifeSubmitted />,
    Pending: <LifePending />,
    Active: <LifeActive />,
    Inactive: <LifeInactive />,
    Declined: <LifeDeclined />,
    Upcoming: <LifeUpcoming />,
    Unlinked: <LifeUnlinked />,
    Returned: <LifeReturned />,
};

const PolicyCard = ({ callData }) => {
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    const healthPolicyTypes = ["Medicare Advantage", "PDP"];
    const isHealthPolicy = Boolean(
        healthPolicyTypes.some((type) => type.toLowerCase() == callData.productType.toLowerCase()),
    );

    const status = callData?.policyStatus || "";
    const policyStatus = status === "terminated" ? "Inactive" : capitalizeFirstLetter(status);
    const IconComponent = isHealthPolicy ? healthIcons[policyStatus] : lifeIcons[policyStatus];

    return (
        <div className="policy-card">
            <Media
                query={"(max-width: 500px)"}
                onChange={() => {
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
                        gap: "5px",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div className="startedIcon">{IconComponent}</div>
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
                        iconPosition="right"
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
                    policyList?.map((data, index) => {
                        return <PolicyCard callData={data} key={index} />;
                    })}
            </div>
            {policyCount > 5 && (
                <div className="jumpList-card">
                    <Button type="tertiary" label="Jump to List" className="jumpList-btn" onClick={handleJumpList} />
                </div>
            )}
        </>
    );
};

PolicyCard.propTypes = {
    callData: PropTypes.object,
};

PolicyList.propTypes = {
    policyCount: PropTypes.number,
    policyList: PropTypes.array,
    handleJumpList: PropTypes.func,
};

export default PolicyList;
