import React from "react";
import { useState } from "react";
import Styles from "./AddZip.module.scss";

export default function AddZip({ isOpen, onClose, setFieldValue, address }) {
  const [inputZip, setInputZip] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    setFieldValue("address.postalCode", inputZip);
    onClose();
  }
  return (
    <div>
      {isOpen && (
        <div className={Styles.modalContainer}>
          <div className={Styles.modal}>
            <p className={Styles.modalTitle}>Zip Code</p>
            <button onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={Styles.closeBtn}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <p className={Styles.subText}>
              Please enter zip code to see plan details and pricing.
            </p>
            {address && (
              <div className={Styles.addressWrapper}>
                <p className="">{address}</p>
                <button
                  className={Styles.copy}
                  onClick={() => navigator.clipboard.writeText(address)}
                >
                  <img src="/images/Clipboard.svg" alt="" />
                </button>
              </div>
            )}
            <form className={Styles.inputContainer} onSubmit={handleSubmit}>
              <p className={Styles.zipCode}>Zip Code</p>
              <input
                type="text"
                className={Styles.input}
                required
                value={inputZip}
                minLength={5}
                maxLength={5}
                onChange={(e) => {
                  e.target.value = e.target.value
                    .replace(/[^0-9]/g, "")
                    .toString()
                    .slice(0, 5);
                  setInputZip(e.target.value);
                }}
              />
              <div className={Styles.buttonWrapper}>
                {/* <button className={Styles.cancel} onClick={onClose}>
                  Cancel
                </button> */}
                <button type="submit" className={Styles.submit}>
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
