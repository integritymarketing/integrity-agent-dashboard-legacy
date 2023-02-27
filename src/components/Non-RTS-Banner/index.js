import React, { useState } from "react";
import { NonRTS_Modal } from "packages/NonRTS-Modal";
import styles from "./styles.module.scss";

const NonRTSBanner = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className={styles.bannerContainer} onClick={() => setOpen(true)}>
        <div className={styles.nonRTS_Banner}>
          <div className={styles.title}>
            Carrier Appointment Information Pending
          </div>
          <div className={styles.content}>
            The plan list below includes all plans available in the client’s
            area. You can quote, but not enroll in any plans until your carrier
            appointment information is in our files. Please contact your
            marketer if you have questions
          </div>
        </div>
      </div>
      <NonRTS_Modal modalOpen={open} handleClose={() => setOpen(false)} />
    </>
  );
};

export default NonRTSBanner;
