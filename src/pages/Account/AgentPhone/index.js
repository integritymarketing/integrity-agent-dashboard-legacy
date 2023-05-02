import React from "react";
import SectionContainer from "mobile/Components/SectionContainer";
import Heading2 from "packages/Heading2";
import { formatTwiloNumber } from "utils/formatTwiloNumber";
import styles from "./styles.module.scss";

const AgentPhone = ({ agentVirtualPhoneNumber, ...props }) => {
  return (
    <SectionContainer title={"Agent Phone Number"} className={styles.title}>
      <p className={styles.subText}>
        This phone number can be given to clients for them to contact you
        directly. It will be forwarded to the number found in you Check-in
        Preferences.
      </p>
      <Heading2
        className={styles.agentPhone}
        id="transition-modal-description"
        text={formatTwiloNumber(agentVirtualPhoneNumber)}
      />
      {/* <div className={styles.buttonWrapper}>
        <button className={styles.button}>Request a New Number</button>
      </div> */}
    </SectionContainer>
  );
};

export default AgentPhone;
