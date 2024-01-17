import React from "react";

import { disableTextMessage } from "utilities/appConfig";

import styles from "./SMSNotification.module.scss";

function SMSNotification() {
    if (!disableTextMessage) {
        return null;
    }
    return (
        <div>
            <div className={styles.heading}>SMS Temporarily Unavailable</div>
            <div className={styles.detail}>
                SMS Text Messaging from Integrity to clients is temporarily unavailable while we work to comply with new
                regulations. Compliant text messaging capabilities will be restored prior to AEP 2024.
            </div>
        </div>
    );
}

export default SMSNotification;
