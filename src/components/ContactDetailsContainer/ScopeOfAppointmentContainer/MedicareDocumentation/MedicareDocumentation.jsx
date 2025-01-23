import React from 'react';
import styles from './MedicareDocumentation.module.scss';
import {
    ANCILLARY_PRODUCTS,
    ANCILLARY_PRODUCTS_OVERVIEW,
    HEALTH_CARE_COSTS1,
    HEALTH_CARE_COSTS2,
    HEALTH_CARE_COSTS3,
    MEDICARE_ADV_PLANS,
    MEDICARE_ADV_PLANS_DETAILS,
    MEDICARE_ADV_PLANS_EX1,
    MEDICARE_ADV_PLANS_EX2,
    MEDICARE_ADV_PLANS_EX3,
    MEDICARE_ADV_PLANS_EX4,
    MEDICARE_ADV_PLANS_EX4_POINT1,
    MEDICARE_ADV_PLANS_EX4_POINT2,
    MEDICARE_ADV_PLANS_EX4_POINT3,
    MEDICARE_ADV_PLANS_EXAMPLES,
    MEDICARE_DRUG_PLAN,
    MEDICARE_DRUG_PLAN_DETAILS,
    MEDICARE_OVERVIEW,
    MEDICARE_OVERVIEW_DETAILS,
    MEDICARE_SUPPLEMENT_PRODUCTS,
    MEDICARE_SUPPLEMENT_PRODUCTS_OVERVIEW1,
    MEDICARE_SUPPLEMENT_PRODUCTS_OVERVIEW2
} from '../ScopeOfAppointmentContainer.constants';

export const MedicareDocumentation = () => {
    return (
        <>
            <TextWithSubtext text={MEDICARE_OVERVIEW} subtext={MEDICARE_OVERVIEW_DETAILS} />
            <TextWithSubtext text={MEDICARE_DRUG_PLAN} subtext={MEDICARE_DRUG_PLAN_DETAILS} />
            <TextWithSubtext text={MEDICARE_ADV_PLANS} subtext={MEDICARE_ADV_PLANS_DETAILS} />
            <div className={styles.text}>{MEDICARE_ADV_PLANS_EXAMPLES}
                <ul className={styles.fullList}>
                    <li>{MEDICARE_ADV_PLANS_EX1}</li>
                    <li>{MEDICARE_ADV_PLANS_EX2}</li>
                    <li>{MEDICARE_ADV_PLANS_EX3}</li>
                    <li>
                        <div>{MEDICARE_ADV_PLANS_EX4}</div>
                        <ul>
                            <li>{MEDICARE_ADV_PLANS_EX4_POINT1}</li>
                            <li>{MEDICARE_ADV_PLANS_EX4_POINT2}</li>
                            <li>{MEDICARE_ADV_PLANS_EX4_POINT3}</li>
                        </ul>
                    </li>
                </ul>
            </div>
            <TextWithSubtext text={MEDICARE_SUPPLEMENT_PRODUCTS} subtext={MEDICARE_SUPPLEMENT_PRODUCTS_OVERVIEW1} />
            <ul className={styles.subText}>
                <li>{HEALTH_CARE_COSTS1}</li>
                <li>{HEALTH_CARE_COSTS2}</li>
                <li>{HEALTH_CARE_COSTS3}</li>
            </ul>
            <div className={styles.subText}>{MEDICARE_SUPPLEMENT_PRODUCTS_OVERVIEW2}</div>
            <TextWithSubtext text={ANCILLARY_PRODUCTS} subtext={ANCILLARY_PRODUCTS_OVERVIEW} />
        </>
    );
};

const TextWithSubtext = ({ text, subtext }) => (
    <>
        <div className={styles.text}>{text}</div>
        <div className={styles.subText}>{subtext}</div>
    </>
);