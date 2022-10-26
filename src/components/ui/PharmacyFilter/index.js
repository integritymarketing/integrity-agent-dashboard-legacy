import React from "react";
import { SubSection } from "../FilterSection";
import "./index.scss";
import "scss/_forms.scss";

const RETAIL = { name: "Retail" };

export default function PharmacyFilter({ pharmacies }) {
  const { address1, city, state, zip, name } = pharmacies[0] || RETAIL;
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
