import React from "react";
import SectionContainer from "mobile/Components/SectionContainer";
import Heading2 from "packages/Heading2";
import { formatTwiloNumber } from "utils/formatTwiloNumber";
import styles from "./styles.module.scss";

const AgentPhone = ({ agentVirtualPhoneNumber, ...props }) => {
  return (
    <SectionContainer title={"MedicareCENTER Agent Phone Number"}>
      <Heading2
        className={styles.agentPhone}
        id="transition-modal-description"
        text={formatTwiloNumber(agentVirtualPhoneNumber)}
      />
    </SectionContainer>
  );
};

export default AgentPhone;
