import React, { useMemo } from "react";
import { Select } from "components/ui/Select";
import moment from "moment";

import "./index.scss";
import "scss/_forms.scss";

export default function EffectiveDateFilter({ years, initialValue, onChange, selectClassName="" }) {
  initialValue.setDate(15); // setting the day of month here to the middle of the month, to avoid timezone issues.

  const options = useMemo(() => {
    const options = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    for (const year of years) {
      var i = year === now.getFullYear() ? currentMonth + 1 : 0;
      while (i < 12) {
        let date = new Date(initialValue);
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

    const aepSeasonStart = new moment(now).date(1).month("Oct").startOf("day");
    const aepSeasonEnd = new moment(now).date(1).month("Dec").startOf("day");

    if (now >= aepSeasonStart && now <= aepSeasonEnd) {
      const nextYearJanuary = new moment(now)
        .add(1, "year")
        .month("Jan")
        .date(15)
        .startOf("day");

      return [
        ...options,
        {
          label: `January ${nextYearJanuary.year()} `,
          value: nextYearJanuary.toISOString(),
        },
      ];
    }

    const decStart = new moment(now).date(1).month("Dec").startOf("day");
    const decMid = new moment(now).date(14).month("Dec").startOf("day");

    if (now >= decStart && now <= decMid) {
      const nextYearJanuary = new moment(now)
        .add(1, "year")
        .month("Jan")
        .date(15)
        .startOf("day");

      return [
        {
          label: `January ${nextYearJanuary.year()} `,
          value: nextYearJanuary.toISOString(),
        },
      ];
    }

    const decMiddle = new moment(now).date(15).month("Dec").startOf("day");
    const decEnd = new moment(now).endOf("year");

    if (now >= decMiddle && now <= decEnd) {
      let year = now.getFullYear() + 1;
      let i = 0;
      while (i < 12) {
        let date = new Date(initialValue);
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
        selectClassName={selectClassName}
      />
    </div>
  );
}
