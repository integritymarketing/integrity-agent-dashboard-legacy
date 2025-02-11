import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import styles from "../AskIntegrityFeedback.module.scss";
import ArrowRightCircle from "./assets/ArrrowRightCircle";
import CheckedIcon from "components/icons/CheckedIcon";
import Frown from "./assets/Frown";
import Smile from "./assets/Smile";
import { CONTENT_SECTIONS } from "../AskIntegrityFeedback";
import useAnalytics from "hooks/useAnalytics";

const FEEDBACK_OPTIONS = [
  { id: 1, value: "Ask Integrity did not understand me" },
  { id: 2, value: "I wish Ask Integrity offered more capabilities" },
  { id: 3, value: "The response from Ask Integrity was not accurate" },
  { id: 4, value: "The response from Ask Integrity was not helpful" },
  { id: 5, value: "I experienced a technical issue with Ask Integrity" },
  { id: 6, value: "I experienced a different issue with Ask Integrity" },
];

const Feedback = ({ onReact, content, onSkip, onDone, onSubmit }) => {
  const { fireEvent } = useAnalytics();
  const [selectedFeedback, setSelectedFeedback] = useState([]);
  const [rating, setRating] = useState(null);

  const handleClickFeedback = (rating) => {
    setRating(rating);
    fireEvent("AI - General Feedback Submitted", {
      feature: "Ask Integrity",
      rating,
    });
    if (rating) {
      return onSkip();
    }
    onReact();
  };

  const handleSubmit = () => {
    onSubmit();
    if(rating === false) {
    fireEvent("AI - Detailed Feedback Submitted", {
      feature: "Ask Integrity",
      feedback: selectedFeedback.map(({ value }) => value),
      rating
    });
  }
  };

  const toggleSelectedOptions = (option) => {
    setSelectedFeedback((prevSelected) =>
      prevSelected.some(({ id }) => id === option.id)
        ? prevSelected.filter(({ id }) => id !== option.id)
        : [...prevSelected, option]
    );
  };

  const infoContent = useMemo(() => {
    switch (content) {
      case CONTENT_SECTIONS.FEEDBACK_REACTION:
        return "How was your experience with Ask Integrity? We value your feedback!";
      case CONTENT_SECTIONS.FEEDBACK_SHARE:
        return "Ask Integrity is still learning - we value your feedback! Please select any issues that apply to your experience:";
      case CONTENT_SECTIONS.DONE:
        return "Thank you for sharing your feedback! Your feedback will be helpful to improve Ask Integrity.";
      default:
        return null;
    }
  }, [content]);

  return (
    <div className={styles.feedbackContainer}>
      <div className={styles.info}>{infoContent}</div>
      {content === CONTENT_SECTIONS.FEEDBACK_REACTION && (
        <div className={styles.actions}>
          <div
            className={styles.item}
            onClick={() => handleClickFeedback(true)}
          >
            <Smile />
          </div>
          <div
            className={styles.item}
            onClick={() => handleClickFeedback(false)}
          >
            <Frown />
          </div>
        </div>
      )}
      {content === CONTENT_SECTIONS.FEEDBACK_SHARE && (
        <div>
          <div className={styles.optionsContainer}>
            <div className={styles.options}>
              {FEEDBACK_OPTIONS.map((option) => {
                const isChecked = selectedFeedback.some(
                  ({ id }) => id === option.id
                );
                return (
                  <div className={styles.option} key={option.id}>
                    <div
                      className={`${styles.check} ${
                        isChecked ? styles.checked : ""
                      }`}
                      onClick={() => toggleSelectedOptions(option)}
                    >
                      {isChecked ? (
                        <CheckedIcon />
                      ) : (
                        <div className={styles.unCheckedIcon} />
                      )}
                    </div>
                    <span>{option.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <div className={styles.skipButton} onClick={onSkip}>
              Skip
            </div>
            <div
              className={styles.submitButton}
              onClick={handleSubmit}
            >
              Submit
              <ArrowRightCircle />
            </div>
          </div>
        </div>
      )}
      {content === CONTENT_SECTIONS.DONE && (
        <div className={styles.doneButtonContainer}>
          <div className={styles.submitButton} onClick={onDone}>
            Done
            <ArrowRightCircle />
          </div>
        </div>
      )}
    </div>
  );
};

Feedback.propTypes = {
  onReact: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
  onSkip: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
};

export default Feedback;
