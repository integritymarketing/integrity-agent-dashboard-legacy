import React from "react";
import useFlashMessage from "hooks/useFlashMessage";
import ExitIcon from "components/icons/exit";

export default () => {
  const { messageState, dismiss } = useFlashMessage();

  if (!messageState.isVisible) return null;

  return (
    <div className="flash-message">
      <span className="flash-message__content">{messageState.message}</span>
      <span className="flash-message__actions">
        <button className="icon-btn" onClick={dismiss}>
          <span className="visually-hidden">Close message</span>
          <ExitIcon aria-hidden="true" />
        </button>
      </span>
    </div>
  );
};
