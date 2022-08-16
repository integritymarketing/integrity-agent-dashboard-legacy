import React from "react";
import styles from "./DashboardHeaderSection.module.scss";

export default function DashboardHeaderSection({
  content,
  justifyContent = "center",
  padding = 0,
}) {
  return (
    <div
      className={styles.bannerSection}
      style={{ justifyContent: justifyContent, padding: padding }}
    >
      {content}
    </div>
  );
}
