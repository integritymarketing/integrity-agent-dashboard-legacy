import React, { useState, useRef, useEffect } from "react";
import Details from "pages/contacts/contactRecordInfo/Details";
import "./index.scss";
import ScrollNav from "../ScrollNav";
import analyticsService from "services/analyticsService";

const ContactEdit = (props) => {
  const [isEdit, setIsEdit] = useState(props.initialEdit);
  const detailsRef = useRef(null);
  const providersRef = useRef(null);
  const prescriptionRef = useRef(null);
  const pharmacyRef = useRef(null);

  useEffect(() => {
    if (isEdit) {
      analyticsService.fireEvent("event-contact-edit-from-plans-list");
    }
  }, [isEdit]);

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

export default ContactEdit;
