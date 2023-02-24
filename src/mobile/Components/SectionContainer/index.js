import React from "react";
import SectionHeaderMobile from "../sectionHeader";
import styles from "./styles.module.scss";

const SectionContainer = ({
  title,
  actionTitle,
  ActionIcon,
  callBack,
  showLeft = false,
  ...props
}) => {
  return (
    <div className={styles.sectionContianer}>
      <SectionHeaderMobile
        title={title}
        actionTitle={actionTitle}
        ActionIcon={ActionIcon}
        callBack={callBack}
        showLeft={showLeft}
      />
      <div className={styles.sectionBody}>{props.children}</div>
    </div>
  );
};

export default SectionContainer;
