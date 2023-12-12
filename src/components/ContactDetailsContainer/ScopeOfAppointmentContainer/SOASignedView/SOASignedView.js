import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components/ui/Button';
import { SOACTAOPTS, SOA_COMPLETED } from '../ScopeOfAppointmentContainer.constants';
import styles from './SOASignedView.module.scss';
import { ArrowRightPoint } from '../Icons';
import Media from 'react-media';
import { getLocalDateTime, getSoaDatesFromSummary } from 'utils/dates';

export const SOASignedView = ({ onView, soa }) => {
    const { signedDate, linkCode, soaSummary } = soa;
    const [isMobile, setIsMobile] = useState(false);
    const { sentDate } = getSoaDatesFromSummary(soaSummary);

    const Column = ({ style, label, data, subdata, dataStyle }) => (
        <div className={`${styles.boxColumn} ${style}`}>
            <div className={styles.columnLabel}>{label}</div>
            <div className={`${dataStyle ? dataStyle : styles.columnText}`}> {data}</div>
            {subdata && <div className={styles.columnText}>{subdata}</div>}
        </div >
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
                    {<Column style={styles.width15} label='Sent:' data={getLocalDateTime(sentDate)?.date} subdata={getLocalDateTime(sentDate)?.time} />}
                    {<Column style={styles.width15} label='Signed:' data={getLocalDateTime(signedDate)?.date} subdata={getLocalDateTime(signedDate)?.time} />}
                    {<Column style={styles.width50} label='Confirmation number' data={linkCode} dataStyle={styles.confirmNo} />}
                    <div className={`${styles.boxColumn} ${styles.width20}`}>
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
    onView: PropTypes.func.isRequired
};