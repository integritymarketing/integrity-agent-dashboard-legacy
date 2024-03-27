import SectionContainer from "mobile/Components/SectionContainer";

import useAgentInformationByID from "hooks/useAgentInformationByID";

import Heading2 from "packages/Heading2";

import { formatTwilioNumber } from "utils/formatTwilioNumber";

import styles from "./styles.module.scss";

const AgentPhone = () => {
    const {
        agentInformation: { agentVirtualPhoneNumber },
    } = useAgentInformationByID();

    return (
        <SectionContainer title="Agent Phone Number">
            <p className={styles.subText}>
                This phone number can be given to clients for them to contact you directly. It will be forwarded to the
                number found in your Check-in Preferences.
            </p>
            <Heading2
                className={styles.agentPhone}
                id="transition-modal-description"
                text={formatTwilioNumber(agentVirtualPhoneNumber)}
            />
        </SectionContainer>
    );
};

export default AgentPhone;
