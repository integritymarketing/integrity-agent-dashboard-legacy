import React, { useMemo } from "react";
import { Select } from "components/ui/Select";
import "./index.scss";
import "scss/_forms.scss";

export default function EffectiveDateFilter({ years, initialValue, onChange }) {
  initialValue.setDate(15); // setting the day of month here to the middle of the month, to avoid timezone issues.
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
          label: `${date.toLocaleString("default", {
            month: "long",
          })} ${date.getFullYear()} `,
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
        placeholder="select"
        initialValue={initialValue.toISOString()}
        onChange={(value) => onChange(new Date(value))}
        options={options}
        showValueAlways={true}
      />
    </div>
  );
}
