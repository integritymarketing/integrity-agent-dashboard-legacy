import React from "react";
import Container from "components/ui/container";
import StageSelect from "./StageSelect";
import { formatPhoneNumber } from "utils/phones";
import { getMMDDYY } from "utils/dates";
import styles from "../ContactsPage.module.scss";

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
        </div>
      </Container>
    </div>
  );
};
