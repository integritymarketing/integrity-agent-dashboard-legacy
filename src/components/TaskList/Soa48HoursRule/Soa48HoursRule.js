import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";
import { useLeadDetails } from "providers/ContactDetails";
import { useScopeOfAppointment } from "providers/ContactDetails/ContactDetailsContext";

import { convertToLocalDateTime, formatDate, getHoursDiffBetweenTwoDays, sortListByDate } from "utils/dates";

import OpenIcon from "components/icons/open";
import { Button } from "components/ui/Button";

import styles from "./Soa48HoursRule.module.scss";

const Soa48HoursRule = ({ taskList, isMobile, refreshData }) => {
    const navigate = useNavigate();

    const { setLinkCode } = useScopeOfAppointment();
    const { setSelectedTab } = useLeadDetails();

    const getDateTime = (dateString) => {
        const localDateTime = convertToLocalDateTime(dateString);
        const date = formatDate(localDateTime, "MM/dd/yyyy");
        const time = formatDate(localDateTime, "h:mm a").toLowerCase();
        return { date, time };
    };

    const navigateToConfirmSOA = (item) => {
        setLinkCode(item?.soaLinkCode);
        setSelectedTab("complete-scope-of-appointment");
        navigate(`/contact/${item?.leadId}/complete-scope-of-appointment`);

        refreshData(item?.id);
    };

    const isEarlierThanCurrentDate = (contactAfterDate) => getHoursDiffBetweenTwoDays(contactAfterDate, new Date()) < 0;

    const getName = (item) => {
        if (!item) {
            return "";
        }
        const { firstName = "", middleName = "", lastName = "" } = item;
        const formattedName = [firstName, middleName, lastName].filter(Boolean);
        return formattedName.join(" ");
    };

    const navigateToContacts = (leadId) => {
        navigate(`/contact/${leadId}`);
    };

    return (
        <div className={styles.container}>
            {taskList?.map((item) => (
                <div className={styles.item} key={item.id}>
                    <div className={styles.section}>
                        <div className={styles.title1}>SOA sent {getDateTime(item?.sentDate).date} to</div>
                        <div className={styles.title2} onClick={() => navigateToContacts(item?.leadId)}>
                            {getName(item)}
                        </div>
                        <div className={styles.title3}>{item ? item.phoneNumber || item.sentTo : ""}</div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.dateContainer}>
                            <div className={styles.title4}>Date Signed: </div>
                            <div className={styles.title1}>{getDateTime(item?.signedDate).date}</div>
                        </div>
                        <div className={styles.dateContainer}>
                            <div className={styles.title4}>Time Signed: </div>
                            <div className={styles.title1}>{getDateTime(item?.signedDate).time}</div>
                        </div>
                    </div>
                    <div className={`${styles.section} ${styles.contact}`}>
                        <div className={styles.title4}>Contact After</div>
                        <div className={styles.dateContainer}>
                            <div className={styles.dateItem}>{getDateTime(item?.contactAfterDate).date}</div>
                            <div className={styles.title1}>at</div>
                            <div className={styles.dateItem}>{getDateTime(item?.contactAfterDate).time}</div>
                        </div>
                    </div>
                    <div className={`${styles.section} ${styles.action} ${isMobile ? styles.mobileIcon : ""}`}>
                        <Button
                            className={`${styles.completeBtn} ${
                                isEarlierThanCurrentDate(item?.contactAfterDate) ? styles.disabled : ""
                            }`}
                            label={isMobile ? "" : "Complete"}
                            onClick={() => navigateToConfirmSOA(item)}
                            type="primary"
                            icon={<OpenIcon />}
                            iconPosition="right"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

Soa48HoursRule.propTypes = {
    taskList: PropTypes.array.isRequired,
    isMobile: PropTypes.bool.isRequired,
    refreshData: PropTypes.func.isRequired,
};

export default Soa48HoursRule;
