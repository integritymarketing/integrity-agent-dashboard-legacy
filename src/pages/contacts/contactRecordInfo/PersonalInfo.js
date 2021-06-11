import React from "react";
import Container from "components/ui/container";
import StageSelect from "./StageSelect";
import { formatPhoneNumber } from "utils/phones";
import { getMMDDYY } from "utils/dates";
import styles from "../ContactsPage.module.scss";
import DetailsIcon from "components/icons/person";
import PreferencesIcon from "components/icons/settings";
import OverviewIcon from "components/icons/home";
import ArrowdownIcon from "components/icons/menu-arrow-down";
import ArrowupIcon from "components/icons/menu-arrow-up";
const notAvailable = "N/A";

export default ({ personalInfo }) => {
  let {
    firstName = "",
    lastName = "",
    emails = [],
    phones = [],
    addresses = [],
    modifyDate = "",
    createDate = "",
    statusName = "",
    contactRecordType = "",
  } = personalInfo;

  emails = emails.length > 0 ? emails[0].leadEmail : notAvailable;
  phones = phones.length > 0 ? phones[0].leadPhone : null;
  addresses = addresses.length > 0 ? addresses[0] : null;

  return (
    <div className="nameCard">
      <Container className={styles.container}>
        <ul
          className="mobile-menu leftcardmenu"
          data-gtm="contact-record-menu-item"
        >
          <li className="mobile-menu-arrow">
            <ArrowdownIcon />
          </li>
          <li className="arrow-hide mobile-menu-arrow">
            <ArrowupIcon />
          </li>
          <li className="OverView mobile-menu-active">
            <label className="icon-spacing">
              <OverviewIcon />
            </label>
            <span>Overview</span>
          </li>
          <li className="Details DetailsEdit">
            <label className="icon-spacing">
              <DetailsIcon />
            </label>
            <span>Details</span>
          </li>
          <li className="Preferences">
            <label className="icon-spacing">
              <PreferencesIcon />
            </label>
            <span>Preferences</span>
          </li>
        </ul>

        <div className="nameCardSection1">
          <div className="nameCardHeading">
            <h2>{`${firstName} ${lastName}`}</h2>
          </div>
          <div className="personalinfoname nameCardpara">
            <h2>
              {contactRecordType || "Prospect"} | Last updated &nbsp;
              {modifyDate ? getMMDDYY(modifyDate) : getMMDDYY(createDate)}
            </h2>
          </div>
        </div>
        {/* <hr /> */}
        <div className="nameCardSection2">
          <div className="desktop-select-show customSelectbox personalInfo">
            <label>Stage</label>
            <div>
              <StageSelect value={statusName} original={personalInfo} />
            </div>
          </div>
          <div className="personalInfo">
            <label>Email</label>
            <div className="personalInfoEmailText">{emails}</div>
          </div>
          <div className="personalInfo">
            <label>Phone</label>
            <div className="personalInfoText">
              {phones ? formatPhoneNumber(phones) : notAvailable}
            </div>
          </div>

          <div className="personalInfo">
            <label>Address</label>
            <div className="personalInfoText">
              {addresses ? (
                <>
                  {addresses.address1 || ""}, {addresses.address2 || ""} <br />
                  {addresses.city || ""}, {addresses.stateCode || ""} &nbsp;
                  {addresses.postalCode || ""}
                </>
              ) : (
                notAvailable
              )}
            </div>
          </div>
          <div className="mobile-select-show customSelectbox personalInfo">
            <label>Stage</label>
            <div>
              <StageSelect value={statusName} original={personalInfo} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
