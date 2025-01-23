import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import * as Sentry from "@sentry/react";
import useAnalytics from "hooks/useAnalytics";
import IntrigityIcon from "./icons/ask-integrity.png";
import { StepComponent, STEPS } from "./steps";
import styles from "./index.module.scss";
import openAudio from "../../../../components/WebChat/open.mp3";

const ViewAvailablePlans = (props) => {
  const [activeStep, setActiveStep] = useState(STEPS.PROVIDER_INSIGHTS);
  const audioRefOpen = useRef(null);
  const { fireEvent } = useAnalytics();

  useEffect(() => {
    fireEvent("AI - Ask Integrity Prompt Displayed", {
      flow: "Rx to Specialist",
      leadid: props.leadsId,
      provider_count: props?.providers?.length,
      prescription_count: props?.prescriptions?.length,
    });
    if (audioRefOpen.current) {
      audioRefOpen.current.play().catch((error) => {
        Sentry.captureException(error);
      });
    }
  }, [
    audioRefOpen,
    fireEvent,
    props.leadsId,
    props?.prescriptions?.length,
    props?.providers?.length,
  ]);

  useEffect(() => {
    if (props.showViewAvailablePlans) {
      document.body.style.overflowY = "hidden";
    }
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [props.showViewAvailablePlans]);

  return (
    <div
      ref={props.showViewAvailablePlansRef}
      className={styles.viewAvailablePlans}
    >
      <div className={styles.header}>
        <img src={IntrigityIcon} alt="ask-integrity" />
        <p>Ask Integrity</p>
      </div>
      <div className={styles.content}>
        <StepComponent
          {...props}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      </div>
      <audio ref={audioRefOpen} src={openAudio} />
    </div>
  );
};

ViewAvailablePlans.propTypes = {
  prescriptions: PropTypes.array,
  providers: PropTypes.array,
  fullName: PropTypes.string,
  showViewAvailablePlans: PropTypes.bool.isRequired,
};

export default ViewAvailablePlans;
