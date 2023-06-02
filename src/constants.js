export const SORT_OPTIONS = [
  {
    value: "Reminders%3Aasc&Sort=Reminders.ReminderDate%3Aasc",
    label: "Reminders: Upcoming",
  },
  { value: "createDate:desc", label: "Date Added: Newest to Oldest" },
  { value: "createDate:asc", label: "Date Added: Oldest to Newest" },
  { value: "lastName:asc", label: "Last Name: A to Z" },
  { value: "lastName:desc", label: "Last Name: Z to A" },
];

export const PLAN_SORT_OPTIONS = [
  { label: "Premium Lowest to Highest", value: "premium-asc" },
  { label: "Premium Highest to Lowest", value: "premium-desc" },
  { label: "Highest Star Rating", value: "rating-desc" },
  { label: "Lowest Estimated Drug Cost", value: "drugs-asc" },
];

export const DASHBOARD_SORT_OPTIONS = [
  { label: "Current Year to Date", value: 0 },
  { label: "Last Week", value: 1 },
  { label: "Last Month", value: 2 },
  { label: "Last Year", value: 3 },
  { label: "All Time", value: 4 },
];

export const PLAN_TYPE_ENUMS = {
  1: "PDP",
  2: "MAPD",
  4: "MA",
};
