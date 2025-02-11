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
  carrierFilters,
  policyFilters,
  myAppointedPlans,
  rebatesFilter,
  specialNeedsFilter,
  isNonRTS_User,
  planType,
}) {
  const sortedCarriers = carriers?.sort((a, b) => a.localeCompare(b));

  const isMa = planType === 4;

  const commonOptions = [
    {
      label: "My appointed plans",
      id: "appointed",
      checked: myAppointedPlans,
      value: "appointed",
      onChange: toggleAppointedPlans,
      disabled: isNonRTS_User ? true : false,
    },
    {
      label: "Special needs",
      id: "specialNeeds",
      checked: specialNeedsFilter,
      value: "needs",
      onChange: toggleNeeds,
    },
  ];

  if (!isMa) {
    commonOptions.push({
      label: "Includes Part B rebates",
      id: "rebates",
      checked: rebatesFilter,
      value: "rebate",
      onChange: toggleRebates,
    });
  }

  return (
    <div className="effective-date-filter">
      <div className="header">Filters</div>
      <SubSection title="Carrier">
        <CheckboxGroup
          checkboxes={sortedCarriers.map((carrier) => {
            return {
              label: carrier,
              id: carrier,
              name: "carrier",
              checked:
                carrierFilters.filter((item) => item === carrier)?.length > 0
                  ? true
                  : false,
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
              checked:
                policyFilters.filter((item) => item === type)?.length > 0
                  ? true
                  : false,
              disabled: policyTypes.length === 1,
              value: type,
              onChange: onFilterChange,
            };
          })}
        />
      </SubSection>
      <SubSection title="Additional Filters">
        <CheckboxGroup checkboxes={commonOptions} />
      </SubSection>
    </div>
  );
}
