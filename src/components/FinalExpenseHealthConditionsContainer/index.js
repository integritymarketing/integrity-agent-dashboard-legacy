import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import FinalExpenseContactBar from "components/FinalExpensePlansContainer/FinalExpenseContactBar";
import ButtonCircleArrow from "components/icons/button-circle-arrow";
import { Button } from "components/ui/Button";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";

import {
    CARD_TITLE,
    DISCLAIMER_TEXT,
    HEADER_TITLE,
    VIEW_QUOTE,
} from "./FinalExpenseHealthConditionsContainer.constants";
import styles from "./FinalExpenseHealthConditionsContainer.module.scss";
import FinalExpenseHealthTableSection from "./FinalExpenseHealthTableSection";

const FinalExpenseHealthConditionsContainer = () => {
    const { contactId } = useParams();
    const navigate = useNavigate();

    const onClickViewQuote = () => {
        navigate(`/finalexpenses/plans/${contactId}`);
    };

    return (
        <div>
            <GlobalNav />
            <FinalExpenseContactBar backLink={`/finalexpenses/plans/${contactId}`} label={HEADER_TITLE} />
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

            <GlobalFooter />
        </div>
    );
};

export default React.memo(FinalExpenseHealthConditionsContainer);
