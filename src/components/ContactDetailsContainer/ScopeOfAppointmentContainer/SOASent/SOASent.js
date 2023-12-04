import PropTypes from 'prop-types';
import { SOA_SENT, SOA_SENT_TO } from "../ScopeOfAppointmentContainer.constants";
import styles from "./SOASent.module.scss";
import Media from 'react-media';
import { useState } from 'react';
import { getLocalDateTime } from 'utils/dates';

export const SOASent = ({ soa }) => {
    const { statusDate, soaDestination = "" } = soa;
    const [isMobile, setIsMobile] = useState(false);
    return (
        <>
            <Media
                query={"(max-width: 560px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <div className={styles.soaSignedContainer}>
                <div className={styles.titleWrapper}>{SOA_SENT}</div>
                <div className={`${isMobile ? styles.columnView : ""} ${styles.contentWrapper}`}>
                    <div className={`${styles.boxColumn} ${styles.width30}`}>
                        <div className={styles.columnLabel}>Sent:</div>
                        <div className={styles.columnText}>{getLocalDateTime(statusDate)?.date}</div>
                        <div className={styles.columnText}>{getLocalDateTime(statusDate)?.date}</div>
                    </div>
                    <div className={`${styles.boxColumn} ${styles.width70}`}>
                        <div className={styles.columnLabel}>Products to Discuss</div>
                        <div className={styles.productsContainer}>{SOA_SENT_TO}<span>{soaDestination}</span>
                        </div>
                    </div>
                </div >
            </div>
        </>

    )
}

SOASent.propTypes = {
    mailId: PropTypes.string.isRequired
};