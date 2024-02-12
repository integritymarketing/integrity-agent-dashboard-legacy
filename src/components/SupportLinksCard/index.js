import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

import ContactSupportImage from "./contact-support.png";
import LearningCenterImage from "./learning-center.png";
import styles from "./styles.module.scss";
import RightArrow from "./vector.png";

const SupportLinksCard = ({ position }) => {
    const navigate = useNavigate();

    const layoutClass = position === "row" ? styles.row : styles.column;

    const navigateTo = useCallback(
        (path) => {
            navigate(path);
        },
        [navigate]
    );

    const renderCard = (imageSrc, altText, cardContent, linkText, navigatePath) => (
        <div className={styles.card}>
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
        <div className={`${styles.supportLinks} ${layoutClass}`}>
            {renderCard(
                LearningCenterImage,
                "Learning Center",
                "For the latest resources and news from Integrity visit the",
                "Learning Center",
                "/learning-center"
            )}
            {renderCard(
                ContactSupportImage,
                "Contact Support",
                "Need Help? Visit the help center for professional",
                "Professional Assistance",
                "/help"
            )}
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
