import React from "react";
import MinusCircle from "images/minus-circle.png";
import TickCircle from "images/tick-circle.png";
import "./prescription.scss";

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const fields = ["deductible", "gap", "copay", "catastrophic"];

const Img = ({ src }) => (
  <img className="coverage-icon" alt="coverage" src={src} />
);

function Prescription({ data, prescriptions }) {
  const getDoseQuantity = (labelName) => {
    const prescription = findPrescriptionByLabelName(labelName);
    if (!prescription || !prescription.dosage) {
      return;
    }
    const { dosage } = prescription;
    const duration = getNumberInText(Math.floor(dosage.daysOfSupply / 30));
    if (dosage.selectedPackage) {
      return `${dosage.userQuantity} X ${dosage.selectedPackage.packageDisplayText} per ${duration}`;
    }

    return `${dosage.userQuantity} tablets per ${duration}`;
  };

  const findPrescriptionByLabelName = (labelName) => {
    return prescriptions?.find(
      (prescription) => labelName === prescription?.dosage?.labelName
    );
  };

  const getNumberInText = (number) => {
    switch (number) {
      case 1:
        return "one month";
      case 2:
        return "two months";
      case 3:
        return "three months";
      case 4:
        return "four months";
      case 5:
        return "five months";
      case 6:
        return "six months";
      case 12:
        return "year";
      default:
        return "";
    }
  };
  return (
    <div className="prescription-container">
      <div className="row header">
        <div className="col field desc">
          <div className="type">{data.type}</div>
          <div className="drug-name">{data.drugName}</div>
          <div className="type" style={{ fontStyle: "italic" }}>
            {getDoseQuantity(data?.drugName)}
          </div>
          {/* <div className="covered">Covered</div> */}
        </div>
        {data.covered.map((covered) => (
          <div className="col val">
            {covered ? <Img src={TickCircle} /> : <Img src={MinusCircle} />}
          </div>
        ))}
      </div>
      {fields.map((field) => (
        <div className="row">
          <div className="col field">{field}</div>
          {data[field].map((value) => (
            <div className="col val">
              {(value && currencyFormatter.format(value)) || "-"}
            </div>
          ))}
        </div>
      ))}
      <div className="row">
        <div className="col field">Restrictions</div>
        {data.restrictions.map((value) => (
          <div className="col val restrictions">
            {value.hasPriorAuthorization && (
              <div className="link">Prior Authorization</div>
            )}
            {value.hasQuantityLimit && (
              <div className="qty">
                <div className="link">Quantity Limit</div>
                <div className="qty-limit">
                  {value.quantityLimitAmount} / {value.quantityLimitDays} days
                </div>
              </div>
            )}
            {value.hasStepTherapy && <div className="link">Step Therapy</div>}
            {!value.hasPriorAuthorization &&
              !value.hasQuantityLimit &&
              !value.hasStepTherapy && <div>None</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Prescription;