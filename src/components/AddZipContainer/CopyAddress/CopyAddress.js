import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./CopyAddress.module.scss";
import { NEED_HELP_ZIP_TEXT, NEED_HELP_ZIP_SUBTEXT } from "components/AddZipContainer/AddZipContainer.constants";
import CopyIcon from "components/icons/copy-icon";

export const CopyAddress = ({ address, isMobile }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
    };

    return (
        <div className={styles.addressWrapper}>
            <div className={styles.title}>{NEED_HELP_ZIP_TEXT}</div>
            <div className={styles.detailsSubTitle}>{NEED_HELP_ZIP_SUBTEXT}</div>
            <div
                className={`${styles.inputAddress} ${
                    isMobile ? styles.inputAddressMobile : styles.inputAddressDesktop
                }`}
            >
                <div>{address}</div>
                <button className={copied ? styles.copied : styles.copy} onClick={handleCopyToClipboard}>
                    <CopyIcon />
                </button>
            </div>
        </div>
    );
};

CopyAddress.propTypes = {
    address: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,
};
