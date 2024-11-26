import { useNavigate, useParams } from "react-router-dom";

import FinalExpenseContactBar from "components/FinalExpensePlansContainer/FinalExpenseContactBar";
import ButtonCircleArrow from "components/icons/button-circle-arrow";
import { Button } from "components/ui/Button";

import {
    CARD_TITLE,
    DISCLAIMER_TEXT,
    HEADER_TITLE,
    VIEW_QUOTE,
} from "./FinalExpenseHealthConditionsContainer.constants";
import styles from "./FinalExpenseHealthConditionsContainer.module.scss";
import FinalExpenseHealthTableSection from "./FinalExpenseHealthTableSection";
import { useCreateNewQuote } from "../../providers/CreateNewQuote";

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
        <div>
            <FinalExpenseContactBar backLink={plansUrl()} label={HEADER_TITLE} />
            <div className={styles.pageContainerWrapper}>
                <div className={styles.pageContainer}>
                    <h3 className={styles.conditionsLabel}>{CARD_TITLE}</h3>
                    <FinalExpenseHealthTableSection contactId={contactId} />
                    <div className={styles.disclaimerText}>{DISCLAIMER_TEXT}</div>
                    <Button
                        label={VIEW_QUOTE}
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
        </div>
    );
};

export default FinalExpenseHealthConditionsContainer;
