import React from "react";
import "./index.scss";
import "scss/_forms.scss";
import { SubSection } from "../FilterSection";
const mailOrder = { name: "Mail Order" };
export default function PharmacyFilter({ pharmacies }) {
  const { address1, city, state, zip, name } = pharmacies[0] || mailOrder;
  return (
    <div className="pharmacy-filter">
      <div className="header">Drug Estimates Based On:</div>
      <SubSection title="Pharmacy">
        <label className="pharmacy-label">{name}</label>
        {address1 && (
          <label className="pharmacy-address">
            {address1}, {city}, {state}, {zip}
          </label>
        )}
      </SubSection>
    </div>
  );
}
