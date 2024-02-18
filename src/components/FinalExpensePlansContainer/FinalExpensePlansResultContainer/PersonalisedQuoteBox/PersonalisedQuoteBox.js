import { useNavigate, useParams } from "react-router-dom";
import { GET_QUOTE, VIEW_BUTTON, VIEW_QUOTE } from "./PersonalisedQuoteBox.constants";
import styles from "./PersonalisedQuoteBox.module.scss";

const PersonalisedQuoteBox = () => {
    const navigate = useNavigate();
    const { contactId } = useParams();

    const handleNavigation = () => {
        navigate(`/finalexpenses/healthconditions/${contactId}`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.heading}>{GET_QUOTE}</div>
                <div className={styles.subHeading}>{VIEW_QUOTE}</div>
            </div>
            <button className={styles.viewButton} onClick={handleNavigation}>
                {VIEW_BUTTON}
            </button>
        </div>
    );
};

export default PersonalisedQuoteBox;
