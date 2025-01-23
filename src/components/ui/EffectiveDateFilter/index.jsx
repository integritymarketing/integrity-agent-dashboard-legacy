import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import { Select } from "components/ui/Select";
import "./index.scss";

EffectiveDateFilter.propTypes = {
  years: PropTypes.arrayOf(PropTypes.number).isRequired,
  initialValue: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
  selectClassName: PropTypes.string,
};

EffectiveDateFilter.defaultProps = {
  selectClassName: "",
};

export default function EffectiveDateFilter({
  years,
  initialValue,
  onChange,
  selectClassName,
}) {
  const initialDate = useMemo(() => {
    const date = new Date(initialValue);
    date.setDate(15);
    return date;
  }, [initialValue]);

  const generateOptions = useCallback(() => {
    const uniqueOptions = new Map();
    const now = new Date();
    const currentMonth = now.getMonth();

    for (const year of years) {
      let i = year === now.getFullYear() ? currentMonth + 1 : 0;
      while (i < 12) {
        const date = new Date(initialDate);
        date.setMonth(i);
        date.setFullYear(year);
        const label = `${date.toLocaleString("default", {
          month: "long",
        })} ${date.getFullYear()} `;
        uniqueOptions.set(label, date.toISOString());
        i++;
      }
    }

    const aepSeasonStart = moment(now).date(1).month("Oct").startOf("day");
    const aepSeasonEnd = moment(now).date(1).month("Dec").startOf("day");
    let newOptions = [];

    if (now >= aepSeasonStart && now <= aepSeasonEnd) {
      const nextYearJanuary = moment(now)
        .add(1, "year")
        .month("Jan")
        .date(15)
        .startOf("day");
      newOptions.push({
        label: `January ${nextYearJanuary.year()} `,
        value: nextYearJanuary.toISOString(),
      });
    } else {
      const decStart = moment(now).date(1).month("Dec").startOf("day");
      const decMid = moment(now).date(14).month("Dec").startOf("day");

      if (now >= decStart && now <= decMid) {
        const nextYearJanuary = moment(now)
          .add(1, "year")
          .month("Jan")
          .date(15)
          .startOf("day");
        newOptions.push({
          label: `January ${nextYearJanuary.year()} `,
          value: nextYearJanuary.toISOString(),
        });
      } else {
        const decMiddle = moment(now).date(15).month("Dec").startOf("day");
        const decEnd = moment(now).endOf("year");

        if (now >= decMiddle && now <= decEnd) {
          let year = now.getFullYear() + 1;
          let i = 0;
          while (i < 12) {
            let date = new Date(initialDate);
            date.setMonth(i);
            date.setFullYear(year);
            newOptions.push({
              label: `${date.toLocaleString("default", {
                month: "long",
              })} ${date.getFullYear()} `,
              value: date.toISOString(),
            });
            i++;
          }
        }
      }
    }

    newOptions.forEach(({ label, value }) => {
      uniqueOptions.set(label, value);
    });

    return Array.from(uniqueOptions, ([label, value]) => ({ label, value }));
  }, [years, initialDate]);

  const options = useMemo(generateOptions, [generateOptions]);

  const handleChange = useCallback(
    (value) => {
      onChange(new Date(value));
    },
    [onChange]
  );

  return (
    <div className="effective-date-filter">
      <div className="header">Effective Date</div>
      <Select
        placeholder="Select"
        initialValue={initialDate.toISOString()}
        onChange={handleChange}
        options={options}
        showValueAlways
        selectClassName={selectClassName}
      />
    </div>
  );
}
