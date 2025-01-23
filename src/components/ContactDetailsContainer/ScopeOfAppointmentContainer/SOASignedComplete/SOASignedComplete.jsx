import React, { useState } from "react";
import PropTypes from "prop-types";
import OpenIcon from "components/icons/open";
import { SOACTAOPTS, SOA_SIGNED } from "../ScopeOfAppointmentContainer.constants";
import styles from "./SOASignedComplete.module.scss";
import { Button } from "components/ui/Button";
import Media from "react-media";
import { getLocalDateTime, getHoursDiffBetweenTwoDays, getSoaDatesFromSummary } from "utils/dates";
import ArrowRight from "components/icons/version-2/ArrowRight";

export const SOASignedComplete = ({ onComplete, soa }) => {
    const { contactAfterDate, isTracking48HourRule, soaSummary, signedDate } = soa;
    const [isMobile, setIsMobile] = useState(false);
    const productsToDiscuss = soa?.soa?.leadSection?.products ?? [];

    const isEarlierThanCurrentDate = (contactAfterDate) => getHoursDiffBetweenTwoDays(contactAfterDate, new Date()) < 0;

    const { sentDate } = getSoaDatesFromSummary(soaSummary);

    return (
        <>
            <Media
                query={"(max-width: 940px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <div className={styles.soaSignedContainer}>
                <div className={styles.titleWrapper}>{SOA_SIGNED}</div>
                <div className={`${isMobile ? styles.columnView : ""} ${styles.contentWrapper}`}>
                    <div className={`${styles.mobileStyles}`}>
                        <Column
                            label="Sent:"
                            date={getLocalDateTime(sentDate)?.date}
                            time={getLocalDateTime(sentDate)?.time}
                            style={styles.width15}
                        />
                        <Column
                            label="Signed:"
                            date={getLocalDateTime(signedDate)?.date}
                            time={getLocalDateTime(signedDate)?.time}
                            style={styles.width15}
                        />
                    </div>
                    <Column label="Products to Discuss" products={productsToDiscuss} style={styles.width45} />
                    <div className={`${styles.boxColumn} ${styles.width25}`}>
                        {isTracking48HourRule && (
                            <>
                                <div className={`${styles.columnLabel} ${styles.contactAfterLabel}`}>Contact After</div>
                                <div className={styles.contactWrapper}>
                                    <div className={styles.contactBox}>{getLocalDateTime(contactAfterDate)?.date}</div>
                                    <div className={styles.spacing}>at</div>
                                    <div className={styles.contactBox}>{getLocalDateTime(contactAfterDate)?.time}</div>
                                </div>
                            </>
                        )}
                        <div className={styles.completeCTAWrapper}>
                            <Button
                                label={SOACTAOPTS.COMPLETE}
                                onClick={() => onComplete(soa.linkCode)}
                                disabled={isTracking48HourRule && isEarlierThanCurrentDate(contactAfterDate)}
                                type="primary"
                                icon={
                                    <ArrowRight
                                        strokeColor={
                                            isTracking48HourRule && isEarlierThanCurrentDate(contactAfterDate)
                                                ? "#aba7a7"
                                                : null
                                        }
                                    />
                                }
                                iconPosition="right"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const Column = ({ label, date, time, products, style }) => (
    <div className={`${styles.boxColumn} ${style} `}>
        <div className={styles.columnLabel}>{label}</div>
        {products ? (
            <ul className={styles.productsContainer}>
                {products.map((product, index) => (
                    <li key={index}>{product}</li>
                ))}
            </ul>
        ) : (
            <>
                <div className={styles.columnText}>{date}</div>
                <div className={styles.columnText}>{time}</div>
            </>
        )}
    </div>
);

SOASignedComplete.propTypes = {
    onComplete: PropTypes.func.isRequired,
};

Column.propTypes = {
    label: PropTypes.string.isRequired,
    date: PropTypes.string,
    time: PropTypes.string,
    products: PropTypes.arrayOf(PropTypes.string),
    style: PropTypes.string,
};
