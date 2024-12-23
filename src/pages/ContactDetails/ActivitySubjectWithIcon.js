import { useMemo } from "react";
import PropTypes from "prop-types";
import Activity from "components/icons/activities/Activity";
import ContactUpdated from "components/icons/activities/Contacts";
import LOCATION from "components/icons/activities/LocationIcon";
import MEDICAID from "components/icons/activities/MedicaId";
import PHARMACY from "components/icons/activities/Pharmacy";
import PRESCRIPTION from "components/icons/activities/PrescriptionIcon";
import PROVIDER from "components/icons/activities/ProviderIcon";
import styles from "./ActivitySubjectWithIcon.module.scss";
import AskIntegritySuggests from "components/icons/activities/AskIntegritySuggests";
import { faFileLines, faBell, faFilePen } from "@awesome.me/kit-7ab3488df1/icons/classic/light";
import { faMeetingRecording, faArrowShare, faUserContactOverview, faCallRecording, faShieldLegacySafeguard, faList } from "@awesome.me/kit-7ab3488df1/icons/kit/custom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ImageToIcon = ({ src, alt }) => <img src={src} alt={alt} />;

ImageToIcon.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
};

const ActivitySubjectWithIcon = ({ activitySubject, iconURL, activityId, showOnlyFilterIcon, interactionIconUrl }) => {
    const iconComponent = useMemo(() => {
        const iconMapping = {
            "Contact Updated": <FontAwesomeIcon icon={faUserContactOverview} color="#0052cf" size={"lg"} />,
            "Contact Created": <FontAwesomeIcon icon={faUserContactOverview} color="#0052cf" size={"lg"} />,
            "Contact Imported": <FontAwesomeIcon icon={faUserContactOverview} color="#0052cf" size={"lg"} />,
            "Stage Change":  <FontAwesomeIcon icon={faList} color="#0052cf" size={"lg"} />,
            "Incoming Call": <FontAwesomeIcon icon={faCallRecording} color="#0052cf" size={"lg"} />,
            "Call Recording": <FontAwesomeIcon icon={faCallRecording} color="#0052cf" size={"lg"} />,
            "Outbound Call Recorded": <FontAwesomeIcon icon={faCallRecording} color="#0052cf" size={"lg"} />,
            "Incoming Call Recorded": <FontAwesomeIcon icon={faCallRecording} color="#0052cf" size={"lg"} />,
            "Reminder Added": <FontAwesomeIcon icon={faBell} color="#0052cf" size={"lg"} />,
            "Reminder Complete":<FontAwesomeIcon icon={faBell} color="#0052cf" size={"lg"} />,
            "Scope of Appointment Sent": <FontAwesomeIcon icon={faFilePen} color="#0052cf" size={"lg"} />,
            "Scope of Appointment Signed": <FontAwesomeIcon icon={faFilePen} color="#0052cf" size={"lg"} />,
            "Scope of Appointment Completed": <FontAwesomeIcon icon={faFilePen} color="#0052cf" size={"lg"} />,
            "Plan Shared": <FontAwesomeIcon icon={faArrowShare} color="#0052cf" size={"lg"} />,
            "Contact's new call log created": <FontAwesomeIcon icon={faCallRecording} color="#0052cf" size={"lg"} />,
            "Application Submitted": <FontAwesomeIcon icon={faFileLines} color="#0052cf" size={"lg"}/>,
            "Meeting Recorded": <FontAwesomeIcon icon={faMeetingRecording} color="#0052cf" size={"lg"} />,
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
            "Shopper Priority 3 - Plan Review Necessary": <AskIntegritySuggests color="#052A63" bgColor="#F1FAFF" />,
            "Shopper Priority 4 - Plan Review Suggested": <AskIntegritySuggests color="#666666" bgColor="#F1F1F1" />,
            "Shopper Priority 5 - Plan Review Optional": <AskIntegritySuggests color="#999999" bgColor="#F1F1F1" />,
            "Legacy Safeguard Eligible": showOnlyFilterIcon ? (
                <FontAwesomeIcon icon={faShieldLegacySafeguard} color="#0052cf" size={"lg"} />
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
