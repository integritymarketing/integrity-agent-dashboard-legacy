import React from "react";
import StageSelect from "./StageSelect";

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
    contactRecordType="",
    postalCode=""
  } = personalInfo;

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('/');
}
 
  return (
    <div className="nameCard">
      <div className="nameCardSection1">
        <div className="nameCardHeading">
          <h2>{`${firstName} ${lastName}`}</h2>
        </div>
        <div className="nameCardpara">
          <h2>{contactRecordType} | Last updated {modifyDate ? formatDate(modifyDate) : formatDate(createDate) }</h2>
        </div>
      </div>
      <hr />
      <div className="nameCardSection2">
        <div className="personalInfo">
          <label>
            Email <span className="italic-label">(Primary)</span>
          </label>
          <div className="personalInfoEmailText">{email}</div>
        </div>
        <div className="personalInfo">
          <label>Phone</label>
          <div className="personalInfoText">{phone}</div>
        </div>
        <div className="personalInfo">
          <label>Stage</label>
          <div className="">
            <StageSelect value={statusName} original={personalInfo} />
          </div>
        </div>
        <div className="personalInfo">
          <label>Address</label>
          <div className="personalInfoText">
          {address} <br />
          {postalCode}</div>
        </div>
      </div>
    </div>
  );
};
