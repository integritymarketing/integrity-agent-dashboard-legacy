import React from "react";
import "./index.scss";

const QuestionAnswer = ({
  children,
  className = "",
  question,
  questionClassName,
}) => (
  <div className={`${className} questionAnswer`}>
    <h4 className={`${questionClassName} question`}>{question}</h4>

    {children}
  </div>
);
export default QuestionAnswer;
