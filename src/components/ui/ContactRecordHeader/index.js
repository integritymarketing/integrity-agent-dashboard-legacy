import React from "react";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import "./index.scss";
import { Button } from "components/ui/Button";
import EditDetails from "components/icons/edit-details";
import ArrowDown from "components/icons/arrow-down";

export default function ContactRecordHeader({
  contact,
  providersCount,
  prescriptionsCount,
  pharmacyCount,
  isMobile,
}) {
  const history = useHistory();
  const fullName = `${contact.firstName} ${contact.middleName || ""} ${
    contact.lastName
  }`;
  const zip = contact.addresses[0].postalCode;
  return (
    <div className="contactRecordHeader">
      <div className="back">
        {!isMobile && (
          <Button
            icon={<ArrowDown />}
            label="Back to Contact Record"
            onClick={() => history.push(`/contact/${contact.leadsId}`)}
            type="tertiary"
          />
        )}
      </div>
      <div className="details">
        <h4 className="name">{fullName}</h4>
        <div className="info">
          <Link
            to={{
              pathname: `/contact/${contact.leadsId}`,
              state: { display: "Details" },
            }}
          >
            ZIP Code: {zip}
          </Link>
          <Link
            to={{
              pathname: `/contact/${contact.leadsId}`,
              state: { display: "Providers" },
            }}
          >
            Providers ({providersCount})
          </Link>
          <Link
            to={{
              pathname: `/contact/${contact.leadsId}`,
              state: { display: "Prescriptions" },
            }}
          >
            Prescriptions ({prescriptionsCount})
          </Link>
          <Link
            to={{
              pathname: `/contact/${contact.leadsId}`,
              state: { display: "Pharmacies" },
            }}
          >
            {pharmacyCount > 1 ? "Pharmacies" : "Pharmacy"} ({pharmacyCount})
          </Link>
        </div>
      </div>
      <div className="edit">
        <Button
          icon={<EditDetails />}
          label="Edit Contact"
          onClick={() =>
            history.push(`/contact/${contact.leadsId}`, {
              isEdit: true,
              display: "Details",
            })
          }
          type="secondary"
          iconOnly={isMobile}
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
};
