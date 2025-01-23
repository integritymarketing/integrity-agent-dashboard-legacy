import React from "react";
import { useInView } from "react-intersection-observer";

import CenteredListItem from "components/CenteredListItem";
import CenteredContainer from "components/CenteredContainer";
import CloudIcon from "components/CloudIcon";
import LockIcon from "components/LockIcon";
import NotepadIcon from "components/NotepadIcon";

import useConstants from "./constants";

import styles from "./styles.module.scss";

const SmartSecureSection = () => {
  const { CENTERED_TEXT, CENTERED_TITLE } = useConstants();

  const { ref: firstCenteredListItemRef, inView: firstCenteredListItemInView } =
    useInView({
      threshold: 0,
    });

  const {
    ref: secondCenteredListItemRef,
    inView: secondCenteredListItemInView,
  } = useInView({
    threshold: 0,
  });

  const { ref: thirdCenteredListItemRef, inView: thirdCenteredListItemInView } =
    useInView({
      threshold: 0,
    });

  return (
    <div className={styles.smartSecureSection}>
      <CenteredContainer
        className={styles.centeredContainer}
        text={CENTERED_TEXT}
        title={CENTERED_TITLE}
      />

      <CenteredListItem
        className={`${firstCenteredListItemInView ? styles.animate : ""} ${
          styles.firstCenteredListItem
        } ${styles.centeredListItem}`}
        icon={<CloudIcon />}
        ref={firstCenteredListItemRef}
        text="Works with smartphones, tablets, desktops and laptops."
        title="Cloud Convenience"
      />

      <CenteredListItem
        className={`${secondCenteredListItemInView ? styles.animate : ""} ${
          styles.secondCenteredListItem
        } ${styles.centeredListItem}`}
        icon={<LockIcon />}
        ref={secondCenteredListItemRef}
        text="Protects your information and ensures it stays with you."
        title="Robust Data Security"
      />

      <CenteredListItem
        className={`${thirdCenteredListItemInView ? styles.animate : ""} ${
          styles.thirdCenteredListItem
        } ${styles.centeredListItem}`}
        icon={<NotepadIcon />}
        ref={thirdCenteredListItemRef}
        text="Follows all CMS guidelines, including for SOA tracking and call recording."
        title="Built-in Compliance"
      />
    </div>
  );
};

export default SmartSecureSection;
