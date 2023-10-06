import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import About from "./Components/About";
import Capabilities from "./Components/Capabilities";
import ChatIconSmall from "../askIntegrity-logo-small.png";
import Cross from "./Components/assets/Cross";
import Feedback from "./Components/Feedback";
import Support from "./Components/Support";
import styles from './AskIntegrityFeedback.module.scss';
import useAnalytics from "hooks/useAnalytics";

export const CONTENT_SECTIONS = {
    INFO: 'INFO',
    FEEDBACK_REACTION: 'FEEDBACK_REACTION',
    FEEDBACK_SHARE: 'FEEDBACK_SHARE',
    DONE: 'DONE',
};

const AskIntegrityFeedback = ({  onClose, onDone }) => {
  const [currentContent, setCurrentContent] = useState(CONTENT_SECTIONS.INFO);
  const { fireEvent } = useAnalytics();

  useEffect(() => {
    fireEvent("AI - Informational Modal Viewed", {
      feature: "Ask Integrity"
    });
  }, [fireEvent]);

  const handleShareClick = () => {
    setCurrentContent(CONTENT_SECTIONS.FEEDBACK_REACTION);
  };

  const handleReactClick = () => {
    setCurrentContent(CONTENT_SECTIONS.FEEDBACK_SHARE);
  };

  const handleDone = () => {
    setCurrentContent(CONTENT_SECTIONS.DONE);
  };

  const renderContent = () => {
    switch (currentContent) {
      case CONTENT_SECTIONS.INFO:
        return (
          <div className={styles.container}>
            <About />
            <Capabilities />
            <Support onShare={handleShareClick} />
          </div>
        );
      case CONTENT_SECTIONS.FEEDBACK_REACTION:
      case CONTENT_SECTIONS.FEEDBACK_SHARE:
      case CONTENT_SECTIONS.DONE:
        return (
          <Feedback
            onReact={handleReactClick}
            content={currentContent}
            onSubmit={handleDone}
            onSkip={handleDone}
            onDone={onDone}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.chatSideBarInfo}>
      <div className={styles.logoContainer}>
        <img
          className={styles.logoIcon}
          src={ChatIconSmall}
          alt="Chat Icon"
        />
        <div onClick={onClose} className={styles.crossIcon}>
          <Cross />
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

AskIntegrityFeedback.propTypes = {
  // Called when the user wants to close the chat
  onClose: PropTypes.func,
  // Called when the user is done with the interaction
  onDone: PropTypes.func,
};

export default AskIntegrityFeedback;
