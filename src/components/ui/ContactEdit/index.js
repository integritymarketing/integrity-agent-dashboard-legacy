import React, { useState, useRef } from "react";
import Details from "pages/contacts/contactRecordInfo/Details";
import "./index.scss";
import ScrollNav from "../ScrollNav";

export default (props) => {
  const [isEdit, setIsEdit] = useState(props.initialEdit);
  const detailsRef = useRef(null);
  const providersRef = useRef(null);
  const prescriptionRef = useRef(null);
  const pharmacyRef = useRef(null);

  return (
    <div className={"contact-edit"}>
      {!props.isMobile && (
        <div className={"nav-container"}>
          <ScrollNav
            initialSectionID={props.initialSection}
            sections={[
              {
                id: "details",
                label: "Details",
              },
              {
                id: "providers",
                label: "Provider",
              },
              {
                id: "prescriptions",
                label: "Prescription",
              },
              {
                id: "pharmacies",
                label: "Pharmacy",
              },
            ]}
            ref={{
              details: detailsRef,
              providers: providersRef,
              prescriptions: prescriptionRef,
              pharmacies: pharmacyRef,
            }}
          />
        </div>
      )}
      <div className={"details-container"}>
        <Details
          id={props.leadId}
          personalInfo={props.personalInfo}
          isEdit={isEdit}
          setEdit={setIsEdit}
          detailsRef={detailsRef}
          providersRef={providersRef}
          prescriptionRef={prescriptionRef}
          pharmacyRef={pharmacyRef}
          {...props}
        />
      </div>
    </div>
  );
};
