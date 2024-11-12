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
import CustomTagIcon from "./icons/custom_tag.svg";
import CampaignTitleDefault from "./icons/campaign_title_default.svg";
import Askintegrity from "components/icons/version-2/AskIntegrity";

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

export const FILTER_ICONS = {
    NONE: ProductStatusNone,
    UNLINKED: ProductStatusUnlinked,
    STARTED: ProductStatusStarted,
    SUBMITTED: ProductStatusSubmitted,
    PENDING: ProductStatusPending,
    DECLINED: ProductStatusDeclined,
    RETURNED: ProductStatusReturned,
    UPCOMING: ProductStatusUpcoming,
    ACTIVE: ProductStatusActive,
    INACTIVE: ProductStatusInactive,
    Locked: ProductStatusLocked,
    MEDICARE: ProductTypeMedicare,
    FINALEXPENSE: ProductTypeFinalExpense,
    DATA: CampaignTypeData,
    REALTIME: CampaignTypeRealtime,
    INTREST_DEFAULT: CampaignInterestDefault,
    LC: CampaignSourceLc,
    PLANENROLL: CampaignSourcePlanEnroll,
    SOURCE_DEFAULT: CampaignSourceDefault,
    MANUALLY_ADDED: CampaignSourceManuallyAdded,
    AETNA: CarrierAetnaLogo,
    AFLAC: CarrierAflacLogo,
    CIGNA: CarrierCignaLogo,
    HUMANA: CarrierHumanaLogo,
    OMAHA: CarrierOmahaLogo,
    WELLCARE: CarrierWellcareLogo,
    CUSTOM_TAG: CustomTagIcon,
    TITLE_DEFAULT: CampaignTitleDefault,
    ASK_INTEGRITY: Askintegrity,
    default: CampaignSourceDefault,
};
