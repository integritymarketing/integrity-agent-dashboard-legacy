import React from "react";
import Container from "components/ui/container";
import StageSelect from "./StageSelect";
import { formatPhoneNumber } from "utils/phones";

import styles from "../ContactsPage.module.scss";
export default ({ personalInfo }) => {
  const {
    firstName = "",
    lastName = "",
    email = "",
    phone = "",
    address = "",
    modifyDate = "",
    createDate = "",
    statusName = "",
    contactRecordType = "",
    postalCode = "",
  } = personalInfo;

  function getMMDDYYYY(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  }

  return (
    <div className="nameCard">
      <Container className={styles.container}>
        <div className="nameCardSection1">
          <div className="nameCardHeading">
            <h2>{`${firstName} ${lastName}`}</h2>
          </div>
          <div className="personalinfoname nameCardpara">
            <h2>
              {contactRecordType || "Prospect"} | Last updated{" "}
              {modifyDate ? getMMDDYYYY(modifyDate) : getMMDDYYYY(createDate)}
            </h2>
          </div>
        </div>
        {/* <hr /> */}
        <div className="nameCardSection2">
          <div className="customSelectbox personalInfo">
            <label>Stage</label>
            <div>
              <StageSelect value={statusName} original={personalInfo} />
            </div>
          </div>
          <div className="personalInfo">
            <label>
              Email <span className="italic-label">(Primary)</span>
            </label>
            <div className="personalInfoEmailText">{email}</div>
          </div>
          <div className="personalInfo">
            <label>Phone</label>
            <div className="personalInfoText">{formatPhoneNumber(phone)}</div>
          </div>

          <div className="personalInfo">
            <label>Address</label>
            <div className="personalInfoText">
              {address} <br />
              {postalCode}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
