import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Hook
export const useActiveFilters = () => {
  const [filters, setFilters] = useState({
    reminderValue: "",
    stageValue: [],
    tagValue: [],
  });
  const [active, setActive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const stages = queryParams.get("Stage");
    const tags = queryParams.get("Tags");
    let hasReminder = queryParams.get("HasReminder");
    hasReminder =
      hasReminder && hasReminder === "false"
        ? false
        : hasReminder === "true"
        ? true
        : null;
    let hasOverdueReminder = queryParams.get("HasOverdueReminder");
    hasOverdueReminder =
      hasOverdueReminder && hasOverdueReminder === "false"
        ? false
        : hasOverdueReminder === "true"
        ? true
        : null;
    let stageValues = stages ? stages.split(",").map(Number) : [];
    let tagValues = tags ? tags.split(",").map(Number) : [];

    let reminderValue;
    if (hasReminder) {
      reminderValue = "Active Reminders";
    } else if (hasOverdueReminder) {
      reminderValue = "Overdue Reminders";
    } else if (hasReminder === false && !hasOverdueReminder) {
      reminderValue = "No Reminders Added";
    }
    if (
      (stages && stageValues.length > 0) ||
      (tags && tagValues.length > 0) ||
      hasOverdueReminder ||
      hasReminder === false ||
      hasReminder === true
    ) {
      setFilters({
        tagValue: [...tagValues],
        stageValue: [...stageValues],
        reminderValue: reminderValue,
      });
      setActive(true);
    } else {
      setFilters({
        tagValue: [],
        stageValue: [],
        reminderValue: "",
      });
      setActive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return { ...filters, active };
};
