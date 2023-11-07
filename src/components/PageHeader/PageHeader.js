import React from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import BackBtn from "images/new-back-btn.svg";
import styles from "./PageHeader.module.scss";

const PageHeader = ({
    isMobile,
    contactId,
    title
}) => {
    return (
        <div className={styles.headerContainer}>
            <Button
                className={isMobile ? styles.backBtnMobile : styles.backBtnDesktop}
                icon={
                    <img
                        src={BackBtn}
                        alt="Back"
                        style={{ marginRight: "5px" }}
                    />
                }
                label={isMobile ? "Back" : "Back to Contact"}
                onClick={() => {
                    window.location = `/contact/${contactId}/overview`;
                }}
                type="tertiary"
            />
            <div className={styles.title}>{title}</div>
        </div >
    )
}

PageHeader.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    contactId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};

export default PageHeader;