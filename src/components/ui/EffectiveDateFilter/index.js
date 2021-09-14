import React, { useMemo } from "react";
import { Select } from "components/ui/Select";
import "./index.scss";
import "scss/_forms.scss";

export default function EffectiveDateFilter({ years, initialValue, onChange }) {
  const options = useMemo(() => {
    const options = [];
    const now = new Date();
    for (const year of years) {
      var i = year === now.getFullYear() ? now.getMonth() + 1 : 0;
      while (i < 12) {
        var date = new Date(initialValue);
        date.setMonth(i);
        date.setFullYear(year);
        options.push({
          label: `${date.getFullYear()} ${date.toLocaleString("default", {
            month: "long",
          })}`,
          value: date.toISOString(),
        });
        i++;
      }
    }
    return options;
  }, [years, initialValue]);

  return (
    <div className="effective-date-filter">
      <div className="header">Effective Date</div>
      <Select
        initialValue={initialValue.toISOString()}
        onChange={(value) => onChange(new Date(value))}
        options={options}
      />
    </div>
  );
}
