import React from "react";
import { useState } from "react";
import Styles from "./AddCounty.module.scss";

export default function AddCounty({
  isOpen,
  onClose,
  setFieldValue,
  options,
  setHasCountyAlertClosed,
  address,
}) {
  const [county, setCounty] = useState();
  function handleSubmit(e) {
    e.preventDefault();
    setFieldValue("address.county", county);
    const fip = options.filter((item) => item.value === county)[0]?.key;
    setFieldValue("address.countyFips", fip);
  }
  function handleClose() {
    setHasCountyAlertClosed(true);
    onClose();
  }
  return (
    <div>
      {isOpen && (
        <div className={Styles.modalContainer}>
          <div className={Styles.modal}>
            <p className={Styles.modalTitle}>County</p>
            <button onClick={handleClose}>
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
              Please select the county to see plan details and pricing.
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
              <p className={Styles.zipCode}>Select a County</p>
              <div className={Styles.countyOptions}>
                {options.map((option) => (
                  <div>
                    <input
                      key={option.value}
                      type="radio"
                      name="county"
                      value={option.value}
                      onChange={(e) => setCounty(e.target.value)}
                      required
                    />{" "}
                    <span>{option.value}</span>
                  </div>
                ))}
              </div>
              <div className={Styles.buttonWrapper}>
                {/* <button className={Styles.cancel} onClick={handleClose}>
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
