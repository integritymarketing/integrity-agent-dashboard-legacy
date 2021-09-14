import React from "react";
import Container from "components/ui/container";
import StageSelect from "./StageSelect";
import { formatPhoneNumber } from "utils/phones";
import { getMMDDYY } from "utils/dates";
import styles from "../ContactsPage.module.scss";
import { formatAddress, getMapUrl } from "utils/address";
import Editicon from "components/icons/edit-details";

const notAvailable = "N/A";

export default ({ personalInfo, isEdit, setEdit, setDisplay }) => {
  let {
    firstName = "",
    lastName = "",
    middleName = "",
    emails = [],
    phones = [],
    addresses = [],
    createDate = "",
    statusName = "",
    contactRecordType = "",
    contactPreferences,
  } = personalInfo;

  emails = emails.length > 0 ? emails[0].leadEmail : notAvailable;
  phones = phones.length > 0 ? phones[0].leadPhone : null;
  addresses = addresses.length > 0 ? addresses[0] : null;

  const isPrimary =
    contactPreferences && contactPreferences.primary
      ? contactPreferences.primary
      : "";

  const goToEditPage = () => {
    setDisplay("Details");
    setEdit(true);
  };
  return (
    <div className="nameCard">
      <Container className={styles.container}>
        <div className="nameCardSection1">
          <div className="mob-contact-edit-row nameCardHeading">
            <h2>{`${firstName}  ${
              middleName ? middleName + "." : ""
            } ${lastName}`}</h2>

            {!isEdit && (
              <button className="desktop-hide send-btn" onClick={goToEditPage}>
                <Editicon />
                <span className="edit-btn-text">Edit</span>
              </button>
            )}
          </div>
          <div className="personalinfoname nameCardpara">
            <h2>
              {contactRecordType || "Prospect"} | Created Date &nbsp;
              {getMMDDYY(createDate)}
            </h2>
          </div>
        </div>
        <div className="nameCardSection2">
          <div className=" customSelectbox personalInfo">
            <label>Stage</label>
            <StageSelect value={statusName} original={personalInfo} />
          </div>
          <div className="desktop-select-show personalInfo">
            <label>Email {isPrimary === "email" && "(Primary)"}</label>

            <div className="personalInfoEmailText">
              <a className="info-link hover-line" href={`mailto:${emails}`}>
                {emails}
              </a>
            </div>
          </div>
          <div className="desktop-select-show personalInfo">
            <label>Phone {isPrimary === "phone" && "(Primary)"}</label>
            <div className="personalInfoText mobile-hide">
              {phones ? formatPhoneNumber(phones) : notAvailable}
            </div>
            <div className="personalInfoText desktop-hide">
              {phones ? (
                <a
                  className="info-link"
                  href={`tel:${formatPhoneNumber(phones)}`}
                >
                  {formatPhoneNumber(phones)}
                </a>
              ) : (
                notAvailable
              )}
            </div>
          </div>

          <div className=" desktop-select-show personalInfo">
            <label>Address</label>
            <div className="personalInfoText mobile-hide">
              {formatAddress(addresses)}
            </div>
            <div className="personalInfoText desktop-hide">
              <a
                className="info-link"
                href={`${getMapUrl()}?q=${formatAddress(addresses)}`}
              >
                {formatAddress(addresses)}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
