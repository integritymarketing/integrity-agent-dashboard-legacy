import React, { useState } from "react";
import { formatAddress } from "utils/address";
import styles from "./styles.module.scss";
import { formatDate } from "utils/dates";
import PasswordRevealIcon from "components/icons/password-reveal";
import PasswordHideIcon from "components/icons/password-hide";
import { formatMBID } from "utils/shared-utils/sharedUtility";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@awesome.me/kit-7ab3488df1/icons/classic/light";

const notAvailable = "-";

const Info = ({ setDisplay, personalInfo, isEdit, ...rest }) => {
    let {
        firstName = "",
        lastName = "",
        birthdate,
        emails = [],
        phones = [],
        addresses = [],
        contactPreferences,
        medicareBeneficiaryID,
        partA,
        partB,
    } = personalInfo;
    const [showMBID, setShowMBID] = useState(false);

    const email = emails?.length > 0 ? emails[0]?.leadEmail : notAvailable;
    const phoneData = phones.length > 0 ? phones[0] : null;
    const phone = phoneData && phoneData.leadPhone ? phoneData.leadPhone : "";
    const addressData = addresses.length > 0 ? addresses?.[0] : null;
    const county = addressData && addressData.county ? addressData.county : notAvailable;

    const isPrimary = contactPreferences?.primary ? contactPreferences?.primary : "phone";

    const returnPrimary = (value) => {
        if (value !== isPrimary) return false;
        return (
            <span className={styles.starIcon}>
                <FontAwesomeIcon icon={faStar} size={"lg"}/>
            </span>
        );
    };

    return (
        <div className={styles.details}>
            <div className={styles.content}>
                <div className={styles.title}>Name</div>
                <div className={styles.name}>{`${firstName} ${lastName}`}</div>
            </div>

            <div className={styles.content}>
                <div className={styles.title}>BirthDay</div>
                <div className={styles.name}>{birthdate ? formatDate(birthdate) : "--"}</div>
            </div>


            <div className={styles.content}>
                <div className={styles.title}>Email</div>
                <div className={styles.link}>
                    {email} {returnPrimary("email")}
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.title}>Phone</div>
                <div className={styles.link}>
                    {phone}
                    {returnPrimary("phone")}
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.title}>Address</div>
                <div className={styles.link}>{formatAddress(addresses)}</div>
                <div className={styles.county}>County: {county}</div>
            </div>

            <div className={styles.content}>
                <div className={styles.title}>Medicare Beneficiary ID Number</div>
                {medicareBeneficiaryID && (
                    <div className={styles.name}>
                        <p>
                            {formatMBID(medicareBeneficiaryID, showMBID) || notAvailable}
                            <span onClick={() => setShowMBID((prev) => !prev)} className="mbidShowHide">
                                {showMBID ? (
                                    <>
                                        <PasswordRevealIcon className="mbi__icon" />
                                        Hide ID
                                    </>
                                ) : (
                                    <>
                                        <PasswordHideIcon className="mbi__icon" />
                                        Show ID
                                    </>
                                )}
                            </span>
                        </p>
                    </div>
                )}
            </div>
            <div className={styles.content}>
                <div className={styles.title}>Part A Effective Date</div>
                <div className={styles.name}>{partA ? formatDate(partA) : "--"}</div>
            </div>

            <div className={styles.content}>
                <div className={styles.title}>Part B Effective Date</div>
                <div className={styles.name}>{partB ? formatDate(partB) : "--"}</div>
            </div>
        </div>
    );
};

export default Info;
