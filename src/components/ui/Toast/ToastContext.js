import React, { useCallback, useState, createContext } from "react";
import PropTypes from "prop-types";
import "./toast.scss";
import Check from "../../icons/check";
import ToastError from "../../icons/toast-error";

const ToastContext = createContext();

export default ToastContext;

export function ToastContextProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const removeToast = (toast) =>
    setToasts((toasts) => toasts.filter((t) => t !== toast));
  const addToast = useCallback(
    function ({
      message,
      time = 3000,
      type = "success",
      onClickHandler,
      link,
      closeToastRequired = false,
      onCloseCallback,
    }) {
      const toast = {
        message,
        time,
        type,
        onClickHandler,
        link,
        closeToastRequired,
        onCloseCallback,
      };
      setToasts((toasts) => [...toasts, toast]);
      setTimeout(() => {
        removeToast(toast);
      }, time);
    },
    [setToasts]
  );

  const getToastIcon = (toastType) => {
    switch (toastType) {
      case "success":
        return <Check />;
      case "error":
        return <ToastError />;
      case "action":
        return <Check />;
      default:
        return <Check />;
    }
  };

  const onLinkPress = (toast) => {
    toast.onClickHandler();
    if (toast.closeToastRequired) {
      removeToast(toast);
    }
  };

  const onCloseHandler = (toast) => {
    if (toast.onCloseCallback) {
      toast.onCloseCallback();
    }
    removeToast(toast);
  };

  return (
    <ToastContext.Provider value={addToast} className="toast-provider">
      <div className="toast-provider">
        {children}
        <div className="toasts-wrapper">
          {toasts.map((toast, idx) => (
            <div className={`toast ${toast.type}`} key={idx}>
              <div className="toast-indicator">{getToastIcon(toast.type)}</div>
              <div className="toast-message">
                <span
                  className={
                    toast?.link?.toLowerCase() === "undo" ? "undo" : ""
                  }
                >
                  <span>{toast.message}&nbsp;&nbsp;</span>
                  {toast.link && (
                    <a href={() => false} onClick={() => onLinkPress(toast)}>
                      {toast.link}
                    </a>
                  )}
                </span>
              </div>
              <button onClick={() => onCloseHandler(toast)}>&times;</button>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

ToastContext.Provider.propTypes = {
  value: PropTypes.func.isRequired,
};
