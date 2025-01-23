import React from "react";
import PropTypes from "prop-types";
import CheckIcon from "../../icons/check";
import ToastErrorIcon from "../../icons/toast-error";
import styles from "./styles.module.scss"; // Import the styles as a module

function Toast({ type, message, link, onClickHandler, onClose }) {
  const handleLinkClick = () => {
    if (onClickHandler) {
      onClickHandler();
    }
    if (link?.toLowerCase() === "undo") {
      onClose();
    }
  };

  const toastIcon = () => {
    switch (type) {
      case "success":
        return <CheckIcon />;
      case "error":
        return <ToastErrorIcon />;
      default:
        return <CheckIcon />;
    }
  };

  return (
    <div
      className={`${styles.toast} ${
        type === "success"
          ? styles.success
          : type === "error"
          ? styles.error
          : ""
      }`}
    >
      <div className={styles.toastIndicator}>{toastIcon()}</div>
      <div className={styles.toastMessage}>
        <span className={link?.toLowerCase() === "undo" ? styles.undoLink : ""}>
          <span>{message}&nbsp;&nbsp;</span>
          {link && (
            <a href={() => false} onClick={handleLinkClick}>
              {link}
            </a>
          )}
        </span>
      </div>
      <button onClick={onClose}>&times;</button>
    </div>
  );
}

Toast.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  link: PropTypes.string,
  onClickHandler: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

export default Toast;
