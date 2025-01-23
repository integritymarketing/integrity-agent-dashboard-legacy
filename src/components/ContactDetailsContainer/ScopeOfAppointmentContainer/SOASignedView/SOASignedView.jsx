import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { SOACTAOPTS, SOA_COMPLETED } from "../ScopeOfAppointmentContainer.constants";
import styles from "./SOASignedView.module.scss";
import { ArrowRightPoint } from "../Icons";
import Media from "react-media";
import { getLocalDateTime, getSoaDatesFromSummary } from "utils/dates";

export const SOASignedView = ({ onView, soa }) => {
    const { signedDate, linkCode, soaSummary } = soa;
    const [isMobile, setIsMobile] = useState(false);
    const { sentDate } = getSoaDatesFromSummary(soaSummary);
    const productsToDiscuss = soa?.soa?.leadSection?.products ?? [];

    const Column = ({ style, label, data, products, subdata, dataStyle }) => (
        <div className={`${styles.boxColumn} ${style}`}>
            <div className={styles.columnLabel}>{label}</div>
            {products ? (
                <ul className={styles.productsContainer}>
                    {products.map((product, index) => (
                        <li key={index}>{product}</li>
                    ))}
                </ul>
            ) : null}
            <div className={`${dataStyle ? dataStyle : styles.columnText}`}> {data}</div>
            {subdata && <div className={styles.columnText}>{subdata}</div>}
        </div>
    );

    return (
        <>
            <Media
                query={"(max-width: 720px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <div className={styles.soaSignedContainer}>
                <div className={styles.titleWrapper}>{SOA_COMPLETED}</div>
                <div className={`${isMobile ? styles.columnView : ""} ${styles.contentWrapper}`}>
                    <div className={`${styles.mobileStyles}`}>
                        {
                            <Column
                                style={styles.width15}
                                label="Sent:"
                                data={getLocalDateTime(sentDate)?.date}
                                subdata={getLocalDateTime(sentDate)?.time}
                            />
                        }
                        {
                            <Column
                                style={styles.width15}
                                label="Signed:"
                                data={getLocalDateTime(signedDate)?.date}
                                subdata={getLocalDateTime(signedDate)?.time}
                            />
                        }
                    </div>
                    <Column label="Products to Discuss" products={productsToDiscuss} style={styles.width45} />
                    <div className={`${styles.boxColumn} ${styles.width20}`}>
                        <Column
                            style={styles.width25}
                            label="Confirmation number"
                            data={linkCode}
                            dataStyle={styles.confirmNo}
                        />
                        <div className={styles.ViewCTAWrapper}>
                            <Button
                                label={SOACTAOPTS.VIEW}
                                onClick={() => onView(linkCode)}
                                type="primary"
                                icon={<ArrowRightPoint />}
                                iconPosition="right"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

SOASignedView.propTypes = {
    onView: PropTypes.func.isRequired,
};
