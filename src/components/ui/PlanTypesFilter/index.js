import React from "react";
import Radio from "components/ui/Radio";
import { SubSection } from "components/ui/FilterSection";

import "scss/_forms.scss";
import "./index.scss";

export const planTypesMap = [
  { id: "AdvantagePlusD", label: "Medicare Advantage Part D", value: 2 },
  { id: "Advantage", label: "Medicare Advantage", value: 4 },
  { id: "PartD", label: "Part D", value: 1 },
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
          label="Medicare Advantage Part D"
          checked={initialValue === 2}
          onChange={(value) => changeFilter(value)}
        />
        <Radio
          htmlFor="PlanType"
          id="Advantage"
          name="PlanType"
          value={4}
          checked={initialValue === 4}
          label="Medicare Advantage"
          onChange={(value) => changeFilter(value)}
        />
        <Radio
          htmlFor="PlanType"
          id="PartD"
          name="PlanType"
          value={1}
          checked={initialValue === 1}
          label="Part D"
          onChange={(value) => changeFilter(value)}
        />
        {includeAll && (
          <Radio
            htmlFor="PlanType"
            id="allTypes"
            name="PlanType"
            value={-1}
            label="All"
            onChange={(value) => changeFilter(value)}
          />
        )}
      </SubSection>
    </div>
  );
}
