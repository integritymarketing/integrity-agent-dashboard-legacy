import React from "react";
import { useNavigate } from "react-router-dom";

import { useLeadDetails } from "providers/ContactDetails";
import { useScopeOfAppointment } from "providers/ContactDetails/ContactDetailsContext";

import useUserProfile from "hooks/useUserProfile";
import SOAVIEW from "components/icons/activities/SoaView";
import OpenIcon from "components/icons/open";

import { Navigate } from "components/ContactDetailsContainer/ConnectModal/Icons";
import { Button } from "components/ui/Button";

import comparePlansService from "services/comparePlansService";

import styles from "./ActivityDetails.module.scss";

const buttonTextByActivity = {
    "Incoming Call": "Link to Contact",
    "Call Recording": "Download",
    "Contact's new call log created": "Download",
    "Outbound Call Recorded": "Download",
    "Incoming Call Recorded": "Download",
    "Scope of Appointment Signed": "View",
    "Scope of Appointment Completed": "View",
    "Plan Shared": "View Shared Link",
    "Application Submitted": "View",
    "Meeting Recorded": "Download",
};

export default function ActivityButtonText(props) {
    const { activityTypeName, activityInteractionURL, activitySubject, activityInteractionLabel = "" } = props.activity;
    const { leadsId, setDisplay } = props;
    const navigate = useNavigate();
    const userProfile = useUserProfile();
    const { npn } = userProfile;
    const splitViewPlansURL = activityInteractionURL?.split("/");

    const { setLinkCode } = useScopeOfAppointment();
    const { setSelectedTab } = useLeadDetails();

    const handleClick = async (activitySubject, activityInteractionURL) => {
        switch (activitySubject) {
            case "Scope of Appointment Signed":
                setLinkCode(activityInteractionURL);
                setSelectedTab("scope-of-appointment");
                navigate(`/contact/${leadsId}/scope-of-appointment`);
                break;
            case "Scope of Appointment Completed":
                setLinkCode(activityInteractionURL);
                setSelectedTab("view-scope-of-appointment");
                navigate(`/contact/${leadsId}/view-scope-of-appointment`);
                break;
            case "Plan Shared":
                navigate(`/plans/${leadsId}/compare/${splitViewPlansURL[7]}/${splitViewPlansURL[8]}`);
                break;
            case "Incoming Call Recorded":
            case "Outbound Call Recorded":
            case "Call Recording":
            case "Meeting Recorded":
            case "Contact's new call log created":
                window.open(activityInteractionURL, "_blank");
                break;
            case "Application Submitted":
                let link = await comparePlansService?.getPdfSource(activityInteractionURL, npn);

                var url = await window.URL.createObjectURL(link);

                if (url && url !== "") {
                    window.open(url, "_blank");
                }
                break;
            default:
                break;
        }
    };

    const showButton =
        activityTypeName && activityTypeName === "Triggered" && activityInteractionURL && activityInteractionLabel
            ? true
            : false;

    const buttonText = activityInteractionLabel;

    return (
        <>
            {showButton && (
                <Button
                    icon={<OpenIcon color="#ffffff" />}
                    iconPosition="right"
                    label={buttonText}
                    onClick={() => handleClick(activitySubject, activityInteractionURL, leadsId)}
                    type="tertiary"
                    className={styles.activityButton}
                />
            )}
        </>
    );
}
