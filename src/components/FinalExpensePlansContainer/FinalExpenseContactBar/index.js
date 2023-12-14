import React from "react";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";

import useBackPage from "hooks/useBackPage";

import { Button } from "components/ui/Button";

import styles from "./FinalExpenseContactBar.module.scss";

import { BACK, CONTACT_DETAILS } from "../FinalExpensePlansContainer.constants";

import NewBackBtn from "images/new-back-btn.svg";

const FinalExpenseContactBar = ({ label }) => {
    const { contactId } = useParams();
    const handleBackToContacts = useBackPage(`/contact/${contactId}/overview`);

    return (
        <nav className={styles.finalExpenseContactBar}>
            <div className={styles.backToContacts}>
                <Button
                    className={styles.backButton}
                    icon={<img src={NewBackBtn} alt="Back" />}
                    label={BACK}
                    onClick={handleBackToContacts}
                    type="tertiary"
                />
            </div>
            <Box className={styles.profileMenu}>
                <h1 className={styles.userName}>{label || CONTACT_DETAILS}</h1>
            </Box>
        </nav>
    );
};

export default FinalExpenseContactBar;
