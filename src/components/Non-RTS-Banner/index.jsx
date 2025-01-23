import React, { useState } from "react";
import PropTypes from "prop-types";
import { NonRTSModal } from "packages/NonRTS-Modal";
import styles from "./styles.module.scss";

const NonRTSBanner = (props) => {
  const { title, description } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={styles.bannerContainer}>
        <div className={styles.nonRTS_Banner} onClick={() => setOpen(true)}>
          <div className={styles.title}>{title}</div>
          <div className={styles.content}>{description}</div>
        </div>
      </div>
      <NonRTSModal modalOpen={open} handleClose={() => setOpen(false)} />
    </>
  );
};

NonRTSBanner.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

NonRTSBanner.defaultProps = {
  title: "Carrier Appointment Information Pending",
  description:
    "The plan list below includes all plans available in the client’s area. You can quote, but not enroll in any plans until your carrier appointment information is in our files. Please contact your marketer if you have questions",
};

export default NonRTSBanner;