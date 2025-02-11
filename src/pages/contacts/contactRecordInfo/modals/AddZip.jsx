import React, { useEffect } from "react";
import { useState } from "react";
import Styles from "./AddZip.module.scss";
import { Select } from "components/ui/Select";

export default function AddZip({
    isOpen,
    onClose,
    updateZip,
    address,
    handleZipCode = () => {},
    allCounties = [],
    county = "",
    setCounty = () => {},
    countyError = false,
    submitEnable = false,
    zipCode,
}) {
    const [inputZip, setInputZip] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (zipCode) {
            setInputZip(zipCode);
            handleZipCode(zipCode);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [zipCode]);

    const handleSubmit = () => {
        updateZip(inputZip);
    };

    return (
        <div>
            {isOpen && (
                <div className={Styles.modalContainer}>
                    <div className={Styles.modal}>
                        <div className={Styles.modalHeader}>
                            <h2>Complete Zip Code</h2>
                            <button onClick={onClose}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className={Styles.closeBtn}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className={Styles.modalBody}>
                            <p className={Styles.subText}>Please enter zip code to see plan details and pricing.</p>
                            {address && (
                                <div className={Styles.addressWrapper}>
                                    <p className="">{address}</p>
                                    <button
                                        className={copied ? Styles.copied : Styles.copy}
                                        onClick={() => {
                                            navigator.clipboard.writeText(address);
                                            setCopied(true);
                                        }}
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
                                        handleZipCode(e.target.value);
                                    }}
                                />

                                {(allCounties?.length > 1 || county) && (
                                    <div>
                                        <label className="custom-label-county label" htmlFor="county-label">
                                            County
                                        </label>
                                        <Select
                                            placeholder="select"
                                            options={allCounties}
                                            initialValue={county}
                                            onChange={(value) => setCounty(value)}
                                            showValueAlways={true}
                                            error={countyError}
                                            isDefaultOpen={allCounties.length > 1 && county === "" ? true : false}
                                        />
                                    </div>
                                )}
                            </form>
                        </div>
                        <div className={Styles.buttonWrapper}>
                            {/* <button className={Styles.cancel} onClick={onClose}>
                  Cancel
                </button> */}
                            <button
                                type="submit"
                                className={`${Styles.submit} ${submitEnable ? Styles.disabled : ""}`}
                                disabled={submitEnable}
                                onClick={handleSubmit}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
