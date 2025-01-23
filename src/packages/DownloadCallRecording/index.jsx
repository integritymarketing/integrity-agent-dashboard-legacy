import React from "react";
import styles from "./styles.module.scss";
import Download from "components/icons/download";

export default function DownloadCallRecording({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.layout}
    >
      <div className={styles.icon}>{<Download />}</div>
      <div className={styles.text}> Download</div>
    </a>
  );
}
