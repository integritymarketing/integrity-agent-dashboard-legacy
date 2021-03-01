import React from "react";
import Container from "components/ui/container";
import LockIcon from "components/icons/feedback";

import "./index.scss";

const FeedbackRibbon = () => {
  const hideRibbon = process.env.REACT_APP_HIDE_FEEDBACK_RIBBON;
  const feedbackLink = "https://gkl.typeform.com/to/DfG2o3Cb";

  if (hideRibbon) {
    return null;
  }

  const FeedbackLink = (props) => (
    <a href={feedbackLink} target="_blank" rel="noopener noreferrer" {...props}>
      Sign up
    </a>
  );

  return (
    <div className="feedback-ribbon">
      <Container>
        <LockIcon className="feedback-ribbon__icon" />
        <div className="feedback-ribbon__copy">
          <span>We want your feedback!</span>
          <FeedbackLink />
          {" to help us make MedicareCENTER work better for you."}
        </div>
        <div>
          <FeedbackLink className={`btn btn--invert`} />
        </div>
      </Container>
    </div>
  );
};

export default FeedbackRibbon;
