import React from "react";
import Container from "components/ui/container";

import "./index.scss";

const FeedbackRibbon = () => {
  const hideRibbon = process.env.REACT_APP_HIDE_FEEDBACK_RIBBON;
  const feedbackLink = "https://vimeo.com/568616110";

  if (hideRibbon) {
    return null;
  }

  const FeedbackLink = (props) => (
    <a href={feedbackLink} target="_blank" rel="noopener noreferrer" {...props}>
      View Now
    </a>
  );

  return (
    <div className="feedback-ribbon">
      <Container>
        <div className="feedback-ribbon__copy">
          <span>MedicareCENTER has new & improved CRM features!</span>
          Watch step-by-step training videos here.
        </div>
        <div>
          <FeedbackLink className={`btn btn--invert`} />
        </div>
      </Container>
    </div>
  );
};

export default FeedbackRibbon;
