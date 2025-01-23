import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

import ContactSupportImage from "./contact-support.svg";
import LearningCenterImage from "./learning-center.svg";
import styles from "./styles.module.scss";
import RightArrow from "./rightArrow.svg";
const SupportLinksCard = ({ position }) => {
    const navigate = useNavigate();

    const layoutClass = position === "row" ? styles.row : styles.column;
    const cardLayoutClass = position === "row" ? styles.cardRow : styles.cardColumn;

    const navigateTo = useCallback(
        (path) => {
            navigate(path);
        },
        [navigate],
    );

    const renderCard = (imageSrc, altText, cardContent, linkText, navigatePath) => (
        <div className={`${cardLayoutClass}`}>
            <img className={styles.images} src={imageSrc} alt={altText} />
            <span className={styles.cardContent}>
                {cardContent}
                <span role="button" tabIndex="0" onClick={() => navigateTo(navigatePath)} className={styles.linkText}>
                    {linkText} <img className={styles.rightArrow} src={RightArrow} alt="Click here" />
                </span>
            </span>
        </div>
    );

    return (
        <div className={styles.supportLinksContainer}>
            <div className={`${styles.supportLinks} ${layoutClass}`}>
                {renderCard(
                    LearningCenterImage,
                    "LearningCENTER",
                    "For the latest resources and news from Integrity visit the",
                    "LearningCENTER",
                    "/learning-center",
                )}
                {renderCard(
                    ContactSupportImage,
                    "Contact Support",
                    <>
                        Need Help? <br />
                        For professional assistance
                    </>,
                    "Contact Support",
                    "/help",
                )}
            </div>
        </div>
    );
};

SupportLinksCard.propTypes = {
    position: PropTypes.oneOf(["row", "column"]),
};

SupportLinksCard.defaultProps = {
    position: "row",
};

export default SupportLinksCard;
