import React, { useState } from "react";
import styles from "./Track.module.scss";
import { Checkbox } from "@mui/material";

function Track({ onCheckChange }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className={styles.container}>
      <p className={styles.content}>
        Under CMS 2024 regulations, agents who contact beneficiaries through
        outbound lead activities must wait 48 hours between the beneficiary’s
        SoA signature and the sales meeting.
      </p>
      <div className={checked ? styles.checkboxContainer : ""}>
        <Checkbox
          onClick={() => {
            const check = !checked;
            setChecked(check);
            onCheckChange(check);
          }}
          checked={checked}
        />
        <span>Track 48-hour Waiting Period</span>
      </div>
    </div>
  );
}

export default Track;
