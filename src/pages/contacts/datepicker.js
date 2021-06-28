import React from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { DateUtils } from "react-day-picker";
import ReminderIcon from "../../stories/assets/reminder.svg";
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

export default ({ date, onAddNew, overDueStatus = false }) => {
  return (
    <DayPickerInput
      value={date ? new Date(date) : "Add"}
      formatDate={formatDate}
      format={FORMAT}
      parseDate={parseDate}
      placeholder={`${dateFnsFormat(new Date(), FORMAT)}`}
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
              <img
                src={ReminderIcon}
                alt=""
                height="20"
                className="datepicket-icon mr-1"
              />
            </div>
          </span>
        );
      }}
    />
  );
};
