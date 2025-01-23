import React from "react";
import Radio from "components/ui/Radio";
import { SubSection } from "components/ui/FilterSection";

import "scss/_forms.scss";
import "./index.scss";

export const planTypesMap = [
  { id: "AdvantagePlusD", label: "MAPD", value: 2 },
  { id: "Advantage", label: "MA", value: 4 },
  { id: "PartD", label: "PDP", value: 1 },
];
export default function PlanTypesFilter({
  options,
  includeAll = false,
  initialValue = 2,
  changeFilter = () => {},
}) {
  return (
    <div className="plan-types-filter">
      <div className="header">Plan Type</div>
      <SubSection>
        <Radio
          htmlFor="PlanType"
          id="AdvantagePlusD"
          name="PlanType"
          value={2}
          label="MAPD"
          checked={initialValue === 2}
          onChange={() => changeFilter(2)}
        />
        <Radio
          htmlFor="PlanType"
          id="Advantage"
          name="PlanType"
          value={4}
          checked={initialValue === 4}
          label="MA"
          onChange={() => changeFilter(4)}
        />
        <Radio
          htmlFor="PlanType"
          id="PartD"
          name="PlanType"
          value={1}
          checked={initialValue === 1}
          label="PDP"
          onChange={() => changeFilter(1)}
        />
        {includeAll && (
          <Radio
            htmlFor="PlanType"
            id="allTypes"
            name="PlanType"
            value={-1}
            label="All"
            onChange={() => changeFilter(-1)}
          />
        )}
      </SubSection>
    </div>
  );
}
