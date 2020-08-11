import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useFlashMessage from "hooks/useFlashMessage";
import ExitIcon from "components/icons/exit";

export default () => {
  const {
    message,
    dismissable = true,
    type = "neutral",
    isVisible,
    dismiss,
  } = useFlashMessage();
  const { pathname } = useLocation();
  useEffect(dismiss, [pathname]);

  if (!isVisible) return null;

  return (
    <div className={`flash-message flash-message--${type}`}>
      <span className="flash-message__content">{message}</span>
      {dismissable && (
        <span className="flash-message__actions">
          <button className="icon-btn" onClick={dismiss}>
            <span className="visually-hidden">Close message</span>
            <ExitIcon aria-hidden="true" />
          </button>
        </span>
      )}
    </div>
  );
};
