import SectionContainer from "mobile/Components/SectionContainer";

import { LeadSource } from "./LeadSource";
import { CallCenter } from "./CallCenter";

import styles from "./styles.module.scss";

function AvailabilityPreferences() {
    return (
        <SectionContainer title="Availability Preferences">
            <p className={styles.subText}>Calls to your Agent Phone Number will be forwarded to the number below.</p>
            <CallCenter />
            <LeadSource />
        </SectionContainer>
    );
}

export default AvailabilityPreferences;
