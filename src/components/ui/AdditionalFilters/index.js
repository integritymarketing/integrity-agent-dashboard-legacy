import React from "react";
import CheckboxGroup from "components/ui/CheckboxGroup";
import { SubSection } from "components/ui/FilterSection";
import "./index.scss";
import "scss/_forms.scss";

export default function AdditionalFilters({ carriers, policyTypes, onChange,toggleAppointedPlans }) {
  return (
    <div className="effective-date-filter">
      <div className="header">Filters</div>
      <SubSection title="Carrier">
        <CheckboxGroup
          checkboxes={carriers.map((carrier)=>{
            return {
              label: carrier,
              id: carrier,
              defaultChecked: carriers.length === 1,
              disabled: carriers.length === 1,
              value: carrier,
              onChange:(e)=>onChange(e.target.value)
            }
          })}
        />
      </SubSection>
      <SubSection title="Policy Type">
        <CheckboxGroup
         checkboxes={policyTypes.map((type)=>{
          return {
            label: type,
            id: type,
            defaultChecked: policyTypes.length ===1,
            disabled: policyTypes.length ===1,
            value: type,
            onChange:(e)=>onChange(e.target.value)
          }
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
              onChange:toggleAppointedPlans
            },
            {
              label: "Special needs",
              id: "specialNeeds",
              defaultChecked: false,
              value: "needs",
              onChange:()=>onChange()
            },
            {
              label: "Includes Part B rebates",
              id: "rebates",
              defaultChecked: false,
              value: "rebate",
              onChange:()=>onChange()
            },
          ]}
        />
      </SubSection>
    </div>
  );
}
