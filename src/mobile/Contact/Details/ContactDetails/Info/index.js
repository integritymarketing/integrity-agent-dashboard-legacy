import React from "react";
import { formatAddress } from "utils/address";
import styles from "./styles.module.scss";
import star from "images/icons-star.png";
import { formatDate } from "utils/dates";

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
    contactRecordType = "prospect",
  } = personalInfo;

  const email = emails?.length > 0 ? emails[0]?.leadEmail : notAvailable;
  const phoneData = phones.length > 0 ? phones[0] : null;
  const phone = phoneData && phoneData.leadPhone ? phoneData.leadPhone : "";
  const addressData = addresses.length > 0 ? addresses[0] : null;
  const county =
    addressData && addressData.county ? addressData.county : notAvailable;

  const isPrimary = contactPreferences?.primary
    ? contactPreferences?.primary
    : "phone";

  const returnPrimary = (value) => {
    if (value !== isPrimary) return false;
    return (
      <span className={styles.starIcon}>
        <img src={star} alt="primary" />
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
        <div className={styles.name}>
          {birthdate ? formatDate(birthdate) : "--"}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.title}>Contact Record Type</div>
        <div className={styles.name}>{contactRecordType}</div>
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
    </div>
  );
};

export default Info;
