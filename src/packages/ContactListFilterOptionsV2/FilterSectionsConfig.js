import styles from "./FilterSectionBox/styles.module.scss";
import ReminderIcon from "images/Reminder.svg";
import Reminder_Overdue from "images/Reminder_Overdue.svg";
import Reminder_Add from "images/Reminder_Add.svg";
import AskIntegrityActiveReminder from "./icons/askIntegrityActiveReminder.svg";
import AskIntegrityOverdueReminder from "./icons/askIntegrityOverdueReminder.svg";
import ProductStatusStarted from "./icons/product_status_started.svg";
import ProductStatusSubmitted from "./icons/product_status_submitted.svg";
import ProductStatusPending from "./icons/product_status_pending.svg";
import ProductStatusDeclined from "./icons/product_status_declined.svg";
import ProductStatusReturned from "./icons/product_status_returned.svg";
import ProductStatusUpcoming from "./icons/product_status_upcoming.svg";
import ProductStatusActive from "./icons/product_status_active.svg";
import ProductStatusUnlinked from "./icons/product_status_unlinked.svg";
import ProductStatusNone from "./icons/product_status_none.svg";
import ProductStatusLocked from "./icons/product_status_locked.svg";
import ProductStatusInactive from "./icons/product_status_inactive.svg";
import CarrierAetnaLogo from "./icons/carrier_aetna.svg";
import CarrierAflacLogo from "./icons/carrier_aflac.svg";
import CarrierCignaLogo from "./icons/carrier_cigna.svg";
import CarrierHumanaLogo from "./icons/carrier_humana.svg";
import CarrierOmahaLogo from "./icons/carrier_omaha.svg";
import CarrierWellcareLogo from "./icons/carrier_wellcare.svg";
import ProductTypeMedicare from "./icons/product_type_medicare.svg";
import ProductTypeFinalExpense from "./icons/product_type_finalexpense.svg";
import CampaignTypeData from "./icons/campaign_type_data.svg";
import CampaignTypeRealtime from "./icons/campaign_type_realtime.svg";
import CampaignInterestDefault from "./icons/campaign_interest_default.svg";
import CampaignSourceLc from "./icons/campaign_source_lc.svg";
import CampaignSourcePlanEnroll from "./icons/campaign_source_planenroll.svg";
import CampaignSourceDefault from "./icons/campaign_source_default.svg";
import CampaignSourceManuallyAdded from "./icons/campaign_source_manually_added.svg";

export const filterSectionsConfig = {
    stage: {
        heading: "Stage",
        options: [],
        id: "stage",
    },
    reminders: {
        heading: "Reminders",
        options: [
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
        ],
        id: "reminders",
    },
    product_status: {
        heading: "Product Status",
        options: [
            {
                label: "NONE",
                value: "none",
                icon: ProductStatusNone,
                iconClassName: styles.menuItemIconMedium,
            },
            {
                label: "UNLINKED",
                value: "unlinked",
                icon: ProductStatusUnlinked,
                iconClassName: styles.menuItemIconMedium,
            },
            {
                label: "STARTED",
                value: "started",
                icon: ProductStatusStarted,
                iconClassName: styles.menuItemIconMedium,
            },
            {
                label: "SUBMITTED",
                value: "submitted",
                icon: ProductStatusSubmitted,
                iconClassName: styles.menuItemIconMedium,
            },
            {
                label: "PENDING",
                value: "pending",
                icon: ProductStatusPending,
                iconClassName: styles.menuItemIconMedium,
            },
            {
                label: "DECLINED",
                value: "declined",
                icon: ProductStatusDeclined,
                iconClassName: styles.menuItemIconMedium,
            },
            {
                label: "RETURNED",
                value: "returned",
                icon: ProductStatusReturned,
                iconClassName: styles.menuItemIconMedium,
            },
            {
                label: "UPCOMING",
                value: "upcoming",
                icon: ProductStatusUpcoming,
                iconClassName: styles.menuItemIconMedium,
            },
            {
                label: "ACTIVE",
                value: "active",
                icon: ProductStatusActive,
                iconClassName: styles.menuItemIconMedium,
            },
            {
                label: "INACTIVE",
                value: "inactive",
                icon: ProductStatusInactive,
                iconClassName: styles.menuItemIconMedium,
            },
            {
                label: "Locked",
                value: "locked",
                icon: ProductStatusLocked,
                iconClassName: styles.menuItemIconMedium,
            },
        ],
        id: "product_status",
    },
    product_type: {
        heading: "Product Type",
        options: [
            {
                label: "Medicare Advantage",
                value: "medicare_advantage",
                icon: ProductTypeMedicare,
            },
            {
                label: "MAPD",
                value: "mapd",
                icon: ProductTypeMedicare,
            },
            {
                label: "PDP",
                value: "pdp",
                icon: ProductTypeMedicare,
            },
            {
                label: "Final Expense",
                value: "final_expense",
                icon: ProductTypeFinalExpense,
            },
        ],
    },
    carrier: {
        heading: "Carrier",
        options: [
            {
                label: "WELLCARE",
                value: "WELLCARE",
                icon: CarrierWellcareLogo,
            },
            {
                label: "AETNA",
                value: "AETNA",
                icon: CarrierAetnaLogo,
            },
            {
                label: "HUMANA",
                value: "HUMANA",
                icon: CarrierHumanaLogo,
            },
            {
                label: "CIGNA",
                value: "CIGNA",
                icon: CarrierCignaLogo,
            },
            {
                label: "AFLAC",
                value: "AFLAC",
                icon: CarrierAflacLogo,
            },
            {
                label: "MUTUAL OF OMAHA",
                value: "MUTUAL OF OMAHA",
                icon: CarrierOmahaLogo,
            },
        ],
    },
    health_soa: {
        heading: "Health SOA",
        options: [
            {
                label: "SOA Sent",
                value: "soa_sent",
                icon: ProductStatusStarted,
                iconClassName: styles.menuItemIconMedium,
            },
            {
                label: "SOA Signed",
                value: "soa_signed",
                icon: ProductStatusStarted,
                iconClassName: styles.menuItemIconMedium,
            },
            {
                label: "SOA Completed",
                value: "soa_completed",
                icon: ProductStatusStarted,
                iconClassName: styles.menuItemIconMedium,
            },
        ],
    },
    campaign_source: {
        heading: "Campaign Source",
        options: [
            {
                label: "DEFAULT",
                value: "default",
                icon: CampaignSourceDefault,
            },
            {
                label: "PLANENROLL",
                value: "planenroll",
                icon: CampaignSourcePlanEnroll,
            },
            {
                label: "LEADCENTER",
                value: "leadcenter",
                icon: CampaignSourceLc,
            },
            {
                label: "MANUAL",
                value: "manually_added",
                icon: CampaignSourceManuallyAdded,
            },
        ],
    },
    campaign_type: {
        heading: "Campaign Type",
        options: [
            {
                label: "REAL-TIME",
                value: "real_time",
                icon: CampaignTypeRealtime,
            },
            {
                label: "DATA",
                value: "data",
                icon: CampaignTypeData,
            },
        ],
    },
    campaign_interest: {
        heading: "Campaign Interest",
        options: [
            {
                label: "Original Medicare",
                value: "original_medicare",
                icon: CampaignInterestDefault,
            },
            {
                label: "Medicare Advantage",
                value: "medicare_advantage",
                icon: CampaignInterestDefault,
            },
            {
                label: "MAPD",
                value: "mapd",
                icon: CampaignInterestDefault,
            },
            {
                label: "PDP",
                value: "pdp",
                icon: CampaignInterestDefault,
            },
            {
                label: "MedSupp",
                value: "med_supp",
                icon: CampaignInterestDefault,
            },
            {
                label: "Final Expense",
                value: "final_expense",
                icon: CampaignInterestDefault,
            },
            {
                label: "Variable",
                value: "variable",
                icon: CampaignInterestDefault,
            },
            {
                label: "Whole",
                value: "whole",
                icon: CampaignInterestDefault,
            },
            {
                label: "Term",
                value: "term",
                icon: CampaignInterestDefault,
            },
            {
                label: "Universal",
                value: "universal",
                icon: CampaignInterestDefault,
            },
        ],
    },
    cross_sell: {
        heading: "Ask Integrity Suggests",
        option: {
            label: "Cross Sell",
            value: "",
        },
    },
    switcher: {
        heading: "Ask Integrity Suggests",
        option: {
            label: "Switcher",
            value: "",
        },
    },
    sep: {
        heading: "Ask Integrity Suggests",
        option: {
            label: "SEP",
            value: "",
        },
    },
    "Shopper Priority 1...": {
        heading: "Ask Integrity Suggests",
        option: {
            label: "Shopper Priority 1...",
            value: "",
        },
    },
    "Shopper Priority 2...": {
        heading: "Ask Integrity Suggests",
        option: {
            label: "Shopper Priority 2...",
            value: "",
        },
    },
    "Shopper Priority 3...": {
        heading: "Ask Integrity Suggests",
        option: {
            label: "Shopper Priority 3...",
            value: "",
        },
    },
    custom_tags: {
        heading: "Custom Tags",
    },
};
