import React from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { DateUtils } from "react-day-picker";
import ReminderIcon from "components/icons/reminder";
import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";

const FORMAT = "MM/dd";

function parseDate(str, format, locale) {
  const parsed = dateFnsParse(str, format, new Date(), { locale });
  if (DateUtils.isDate(parsed)) {
    return parsed;
  }
  return undefined;
}

function formatDate(date, format, locale) {
  return dateFnsFormat(date, format, { locale });
}

export default ({
  date,
  format,
  onAddNew,
  overDueStatus = false,
  onChangeDate,
}) => {
  return (
    <DayPickerInput
      value={date ? new Date(date) : "Add"}
      formatDate={formatDate}
      format={format || FORMAT}
      parseDate={parseDate}
      placeholder={`${dateFnsFormat(new Date(), format || FORMAT)}`}
      onDayChange={onChangeDate}
      component={(props) => {
        return (
          <span className="datepickerparent">
            <div
              className={`${overDueStatus ? "due-date-input" : ""} cal`}
              {...(onAddNew ? { onClick: onAddNew } : {})}
            >
              <input
                className="datepicker-input"
                {...props}
                disabled={!!onAddNew}
              />
              <ReminderIcon />
            </div>
          </span>
        );
      }}
    />
  );
};
