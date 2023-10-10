import React, { useCallback, useState, createContext } from "react";
import PropTypes from "prop-types";
import Toast from "./Toast";
import styles from "./styles.module.scss";

export const ToastContext = createContext(null);

function ToastContextProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    ({ message, time = 3000, type = "success", ...rest }) => {
      const newToast = { message, time, type, ...rest };
      setToasts((prevToasts) => [...prevToasts, newToast]);
      setTimeout(
        () =>
          setToasts((prevToasts) => prevToasts.filter((t) => t !== newToast)),
        time
      );
    },
    []
  );

  return (
    <ToastContext.Provider value={addToast}>
      <div className={styles.toastProvider}>
        {children}
        <div className={styles.toastsWrapper}>
          {toasts.map((toast, idx) => (
            <Toast
              key={idx}
              {...toast}
              onClose={() =>
                setToasts((prevToasts) => prevToasts.filter((t) => t !== toast))
              }
            />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

ToastContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ToastContextProvider;
