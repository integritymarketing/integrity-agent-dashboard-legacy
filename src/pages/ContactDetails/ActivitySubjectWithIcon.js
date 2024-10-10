import { useMemo } from "react";
import PropTypes from "prop-types";
import ApplicationSubmitted from "components/icons/ApplicationSubmitted";
import Activity from "components/icons/activities/Activity";
import CallRecording from "components/icons/activities/CallRecording";
import ContactUpdated from "components/icons/activities/Contacts";
import List from "components/icons/activities/List";
import LOCATION from "components/icons/activities/LocationIcon";
import MEDICAID from "components/icons/activities/MedicaId";
import PHARMACY from "components/icons/activities/Pharmacy";
import PRESCRIPTION from "components/icons/activities/PrescriptionIcon";
import PROVIDER from "components/icons/activities/ProviderIcon";
import Reminder from "components/icons/activities/Reminder";
import SOA from "components/icons/activities/SOA";
import styles from "./ActivitySubjectWithIcon.module.scss";
import share from "../../images/Plans-Shared.png";
import MeetingRecord from "../../images/MeetingRecording.png";
import LegacySafeguard from "../../images/LegacySafeguard.png";
import AskIntegritySuggests from "components/icons/activities/AskIntegritySuggests";

export const ImageToIcon = ({ src, alt }) => <img src={src} alt={alt} />;

ImageToIcon.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
};

const ActivitySubjectWithIcon = ({ activitySubject, iconURL, activityId, showOnlyFilterIcon, interactionIconUrl }) => {
    const iconComponent = useMemo(() => {
        const iconMapping = {
            "Contact Updated": <ContactUpdated />,
            "Contact Created": <ContactUpdated />,
            "Contact Imported": <ContactUpdated />,
            "Stage Change": <List />,
            "Incoming Call": <CallRecording />,
            "Call Recording": <CallRecording />,
            "Outbound Call Recorded": <CallRecording />,
            "Incoming Call Recorded": <CallRecording />,
            "Reminder Added": <Reminder />,
            "Reminder Complete": <Reminder />,
            "Scope of Appointment Sent": <SOA />,
            "Scope of Appointment Signed": <SOA />,
            "Scope of Appointment Completed": <SOA />,
            "Plan Shared": <ImageToIcon src={share} alt="Plan Shared" />,
            "Contact's new call log created": <CallRecording />,
            "Application Submitted": <ApplicationSubmitted />,
            "Meeting Recorded": <ImageToIcon src={MeetingRecord} alt="Meeting Recorded" />,
            "Medicare ID Updated by Client": <ContactUpdated />,
            "ZipCode Updated by Client": <LOCATION />,
            "Pharmacy Updated by Client": <PHARMACY />,
            "Pharmacies Added by Client": <PHARMACY />,
            "Pharmacies Deleted by Client": <PHARMACY />,
            "Pharmacies Added": <PHARMACY />,
            "Pharmacies Updated": <PHARMACY />,
            "Pharmacies Deleted": <PHARMACY />,
            "Prescription Updated by Client": <PRESCRIPTION />,
            "Prescription Added by Client": <PRESCRIPTION />,
            "Prescription Deleted by Client": <PRESCRIPTION />,
            "Prescription Updated": <PRESCRIPTION />,
            "Prescriptions Updated": <PRESCRIPTION />,
            "Prescriptions Added": <PRESCRIPTION />,
            "Prescriptions Deleted": <PRESCRIPTION />,
            "Providers Updated by Client": <PROVIDER />,
            "Provider Added by Client": <PROVIDER />,
            "Provider Deleted by Client": <PROVIDER />,
            "Providers Updated": <PROVIDER />,
            "Provider Added": <PROVIDER />,
            "Provider Deleted": <PROVIDER />,
            "Medicaid Updated by Client": <MEDICAID />,
            "Ask Integrity Suggests": <AskIntegritySuggests />,
            "Shopper Priority 1 - Major Coverage Changes": <AskIntegritySuggests color="#A9905F" bgColor="#E9E3D7" />,
            "Shopper Priority 2 - Network or Prescription Changes": <AskIntegritySuggests color="#4178FF" bgColor="#F1FAFF" />,
            "Shopper Priority 3 - Benefits Changes": <AskIntegritySuggests color="#052A63" bgColor="#F1FAFF" />,
            "Legacy Safeguard Eligible": showOnlyFilterIcon ? (
                <ImageToIcon src={LegacySafeguard} alt="Legacy Safeguard Eligible" />
            ) : interactionIconUrl ? (
                <ImageToIcon src={interactionIconUrl} alt={activityId} />
            ) : (
                <Activity />
            ),
        };

        return iconURL ? <ImageToIcon src={iconURL} alt={activityId} /> : iconMapping[activitySubject] || <Activity />;
    }, [activityId, activitySubject, interactionIconUrl, showOnlyFilterIcon, iconURL]);

    return <div className={styles.icon}>{iconComponent}</div>;
};

ActivitySubjectWithIcon.propTypes = {
    activitySubject: PropTypes.string.isRequired,
    iconURL: PropTypes.string,
    activityId: PropTypes.string,
    showOnlyFilterIcon: PropTypes.bool,
    interactionIconUrl: PropTypes.string,
};

export default ActivitySubjectWithIcon;
