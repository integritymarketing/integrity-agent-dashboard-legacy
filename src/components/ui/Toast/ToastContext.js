import React, { useCallback, useState, createContext } from "react";
import PropTypes from "prop-types";
import './toast.scss'
import Check from '../../icons/check';

const ToastContext = createContext();

export default ToastContext;

export function ToastContextProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const removeToast = (toast) => setToasts(toasts => toasts.filter(t => t !== toast))
  const addToast = useCallback(
    function ({ message, time = 3000, type = 'success' }) {
      const toast = {
        message,
        time,
        type
      }
      setToasts((toasts) => [...toasts, toast]);
      setTimeout(() => {
        removeToast(toast)
      }, time)
    },
    [setToasts]
  );

  return (
    <ToastContext.Provider value={addToast} className="toast-provider">
      <div className="toast-provider">
        {children}
        <div className="toasts-wrapper">
          {toasts.map((toast, idx) => (
            <div className={`toast ${toast.type}`} key={idx}>
              <div className="toast-indicator"><Check /></div>
              <div className="toast-message">{toast.message}</div>
              <button onClick={() => removeToast(toast)}>&times;</button>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

ToastContext.Provider.propTypes = {
  value: PropTypes.func.isRequired
};
