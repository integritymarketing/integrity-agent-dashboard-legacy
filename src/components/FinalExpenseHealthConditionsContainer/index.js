import { useNavigate, useParams } from "react-router-dom";
import ButtonCircleArrow from "components/icons/button-circle-arrow";
import { Button } from "components/ui/Button";

import {
    CARD_TITLE,
    DISCLAIMER_TEXT,
    HEADER_TITLE,
    CONTINUE_TO_QUOTE,
} from "./FinalExpenseHealthConditionsContainer.constants";
import styles from "./FinalExpenseHealthConditionsContainer.module.scss";
import FinalExpenseHealthTableSection from "./FinalExpenseHealthTableSection";
import { useCreateNewQuote } from "../../providers/CreateNewQuote";
import { ContactProfileTabBar } from "../ContactDetailsContainer";
import { SIMPLIFIED_IUL_TITLE } from "../FinalExpensePlansContainer/FinalExpensePlansContainer.constants";
import Typography from "@mui/material/Typography";

const FinalExpenseHealthConditionsContainer = () => {
    const { contactId } = useParams();
    const navigate = useNavigate();
    const { isSimplifiedIUL } = useCreateNewQuote();

    const onClickViewQuote = () => {
        navigate(plansUrl());
    };

    const plansUrl = () => {
        if (isSimplifiedIUL()) {
            return `/simplified-iul/plans/${contactId}`;
        } else {
            return `/finalexpenses/plans/${contactId}`;
        }
    };

    return (
        <>
            <ContactProfileTabBar contactId={contactId} showTabs={false} />
            <div className={styles.pageHeading}>
                {isSimplifiedIUL() && (
                    <Typography variant="h2" color="#052A63">
                        {" "}
                        {SIMPLIFIED_IUL_TITLE}
                    </Typography>
                )}
            </div>
            <div className={styles.pageContainerWrapper}>
                <div className={styles.pageContainer}>
                    <div className={styles.headerTitle}>
                        <h4>{HEADER_TITLE}</h4>
                    </div>
                    <h3 className={styles.conditionsLabel}>{CARD_TITLE}</h3>
                    <FinalExpenseHealthTableSection contactId={contactId} />
                    <div className={styles.disclaimerText}>{DISCLAIMER_TEXT}</div>
                    <Button
                        label={CONTINUE_TO_QUOTE}
                        onClick={onClickViewQuote}
                        type="primary"
                        icon={<ButtonCircleArrow />}
                        fullWidth={true}
                        iconPosition="right"
                        style={{ border: "none" }}
                        className={styles.nextButton}
                    />
                </div>
            </div>
        </>
    );
};

export default FinalExpenseHealthConditionsContainer;
