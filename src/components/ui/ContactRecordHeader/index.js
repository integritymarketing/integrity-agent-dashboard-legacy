import React from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import "./index.scss";
import { Button } from "components/ui/Button";
import EditDetails from "components/icons/edit-details";
import ArrowDown from "components/icons/arrow-down";

export default function ContactRecordHeader({
  contact = {},
  providersCount = 0,
  prescriptionsCount = 0,
  pharmacyCount = 0,
  isMobile,
  onEditClick,
}) {
  const history = useHistory();
  const fullName = `${contact.firstName} ${contact.middleName || ""} ${
    contact.lastName
  }`;
  const zip =
    contact?.addresses.length > 0 ? contact?.addresses[0]?.postalCode : null;
  return (
    <div className="contactRecordHeader">
      <div className="back">
        <Button
          icon={<ArrowDown />}
          label="Back to Contact Record"
          onClick={() => history.push(`/contact/${contact.leadsId}`)}
          type="tertiary"
        />
      </div>
      <div className="details">
        <h4 className="name">{fullName}</h4>
        <div className="info">
          <Button
            className={"button-link"}
            label={`ZIP Code: ${zip}`}
            onClick={() => onEditClick("details")}
            type="tertiary"
          />
          <Button
            className={"button-link"}
            label={`Providers (${providersCount})`}
            onClick={() => onEditClick("providers")}
            type="tertiary"
          />
          <Button
            className={"button-link"}
            label={`Prescriptions (${prescriptionsCount})`}
            onClick={() => onEditClick("prescriptions")}
            type="tertiary"
          />
          <Button
            className={"button-link"}
            label={`${
              pharmacyCount > 1 ? "Pharmacies" : "Pharmacy"
            } (${pharmacyCount})`}
            onClick={() => onEditClick("pharmacies")}
            type="tertiary"
          />
        </div>
      </div>
      <div className="edit">
        <Button
          icon={!isMobile ? <EditDetails /> : null}
          label={isMobile ? "Edit Contact Record" : "Edit Contact"}
          onClick={() => onEditClick("details")}
          type="secondary"
        />
      </div>
    </div>
  );
}

ContactRecordHeader.propTypes = {
  contact: PropTypes.object.isRequired,
  providersCount: PropTypes.number.isRequired,
  prescriptionsCount: PropTypes.number.isRequired,
  pharmacyCount: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
  onEditClick: PropTypes.func.isRequired,
};
