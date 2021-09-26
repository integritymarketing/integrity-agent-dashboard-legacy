import React from "react";
import CheckboxGroup from "components/ui/CheckboxGroup";
import { SubSection } from "components/ui/FilterSection";
import "./index.scss";
import "scss/_forms.scss";

export default function AdditionalFilters({
  carriers,
  policyTypes,
  onFilterChange,
  toggleAppointedPlans,
  toggleNeeds,
  toggleRebates,
}) {
  return (
    <div className="effective-date-filter">
      <div className="header">Filters</div>
      <SubSection title="Carrier">
        <CheckboxGroup
          checkboxes={carriers.map((carrier) => {
            return {
              label: carrier,
              id: carrier,
              name: "carrier",
              defaultChecked: carriers.length === 1,
              disabled: carriers.length === 1,
              value: carrier,
              onChange: onFilterChange,
            };
          })}
        />
      </SubSection>
      <SubSection title="Policy Type">
        <CheckboxGroup
          checkboxes={policyTypes.map((type) => {
            return {
              label: type,
              id: type,
              name: "policy",
              defaultChecked: policyTypes.length === 1,
              disabled: policyTypes.length === 1,
              value: type,
              onChange: onFilterChange,
            };
          })}
        />
      </SubSection>
      <SubSection title="Additional Filters">
        <CheckboxGroup
          checkboxes={[
            {
              label: "My appointed plans",
              id: "appointed",
              defaultChecked: true,
              value: "appointed",
              onChange: toggleAppointedPlans,
            },
            {
              label: "Special needs",
              id: "specialNeeds",
              defaultChecked: false,
              value: "needs",
              onChange: toggleNeeds,
            },
            {
              label: "Includes Part B rebates",
              id: "rebates",
              defaultChecked: false,
              value: "rebate",
              onChange: toggleRebates,
            },
          ]}
        />
      </SubSection>
    </div>
  );
}
