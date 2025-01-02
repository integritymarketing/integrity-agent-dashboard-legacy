import React from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import BackBtn from "images/new-back-btn.svg";
import styles from "./PageHeader.module.scss";

const PageHeader = ({ isMobile, backPath, pageName }) => {
    return (
        <div className={`${styles.headerContainer} ${isMobile ? styles.Mview : styles.Dview}`}>
            <Button
                className={isMobile ? styles.backBtnMobile : styles.backBtnDesktop}
                icon={<img src={BackBtn} alt="Back" style={{ marginRight: "5px" }} />}
                label={"Back"}
                onClick={() => {
                    window.location = backPath;
                }}
                type="tertiary"
            />
            <div className={styles.title}>{pageName}</div>
        </div>
    );
};

PageHeader.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    backPath: PropTypes.string.isRequired,
    pageName: PropTypes.string.isRequired,
};

export default PageHeader;
