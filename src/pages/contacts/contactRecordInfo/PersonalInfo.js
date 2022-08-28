import React, { useState } from "react";
import Container from "components/ui/container";
import StageSelect from "./StageSelect";
import { formatPhoneNumber } from "utils/phones";
import { getMMDDYY } from "utils/dates";
import styles from "../ContactsPage.module.scss";
import { formatAddress, getMapUrl } from "utils/address";
import Editicon from "components/icons/edit-details";
import CallScript from "components/icons/callScript";
import { CallScriptModal } from "packages/CallScriptModal";
import PrimaryContactPhone from "pages/contacts/PrimaryContactPhone";

const NOT_AVAILABLE = "N/A";

export default ({ personalInfo, isEdit, setEdit, setDisplay, leadsId }) => {
  const [modalOpen, setModalOpen] = useState(false);

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

  emails = emails.length > 0 ? emails[0].leadEmail : NOT_AVAILABLE;
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
            <label className="text-bold">Stage</label>
            <StageSelect value={statusName} original={personalInfo} />
          </div>
          <div className="personalInfo personalInfoCallScriptIcon">
            <label className="text-bold">Call Script</label>
            <div
              onClick={() => {
                setModalOpen(true);
              }}
            >
              <CallScript />
            </div>
          </div>
          <div className="desktop-select-show personalInfo">
            <label className="text-bold">
              Email {isPrimary === "email" && "(Primary)"}
            </label>

            <div className="personalInfoEmailText">
              <a className="info-link hover-line" href={`mailto:${emails}`}>
                {emails}
              </a>
            </div>
          </div>
          <div className="desktop-select-show personalInfo">
            <label className="text-bold">
              Phone {isPrimary === "phone" && "(Primary)"}
            </label>
            <div className="personalInfoText mobile-hide">
              {phones ? (
                <PrimaryContactPhone phone={phones} leadsId={leadsId} />
              ) : (
                NOT_AVAILABLE
              )}
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
                NOT_AVAILABLE
              )}
            </div>
          </div>

          <div className=" desktop-select-show personalInfo">
            <label className="text-bold">Address</label>
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
      <CallScriptModal
        modalOpen={modalOpen}
        handleClose={() => {
          setModalOpen(false);
        }}
      />
    </div>
  );
};
