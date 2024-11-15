import ReminderIcon from "images/Reminder.svg";
import Reminder_Overdue from "images/Reminder_Overdue.svg";
import Reminder_Add from "images/Reminder_Add.svg";
import AskIntegrityActiveReminder from "./icons/askIntegrityActiveReminder.svg";
import AskIntegrityOverdueReminder from "./icons/askIntegrityOverdueReminder.svg";

export const reminderFilters = [
    {
        label: "Active Reminders",
        value: "active_reminder",
        icon: ReminderIcon,
    },
    {
        label: "Overdue Reminders",
        value: "overdue_reminder",
        icon: Reminder_Overdue,
    },
    {
        label: "No Reminders Added",
        value: "no_reminders_added",
        icon: Reminder_Add,
    },
    {
        label: "Ask Integrity Active",
        value: "ask_integrity_active",
        icon: AskIntegrityActiveReminder,
    },
    {
        label: "Ask Integrity Overdue",
        value: "ask_integrity_overdue",
        icon: AskIntegrityOverdueReminder,
    },
];
