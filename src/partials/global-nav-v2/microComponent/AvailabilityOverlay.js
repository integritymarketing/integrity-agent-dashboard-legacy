import Styles from "./AvailabilityOverlay.module.scss";
import React from "react";
import Arrow from "./arrow.svg";
import Box from "./box.svg";

export default function AvailabilityOverlay({ hideModal }) {
  function onClick() {
    localStorage.setItem("isCheckInUpdateModalDismissed", true);
    hideModal();
  }
  return (
    <div className={Styles.wrapper}>
      <div className={Styles.arrowBox}>
        <img src={Box} alt="" />
        <br />
        <img src={Arrow} className={Styles.box} alt="" />
      </div>
      <div className={Styles.body}>
        <div className={Styles.header}>“Check In” has been updated.</div>
        <div className={Styles.content}>
          Set your availability for access to{" "}
          <a
            href="https://learningcenter.tawebhost.com/MedicareCENTER-Real-Time-Leads-User-Guide.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={Styles.link}
          >
            real-time leads
          </a>
          . Availability Preferences are found on your{" "}
          <a
            href="/account"
            target="_blank"
            rel="noopener noreferrer"
            className={Styles.link}
          >
            Account Page
          </a>
          .
          <button className={Styles.button} onClick={onClick}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
