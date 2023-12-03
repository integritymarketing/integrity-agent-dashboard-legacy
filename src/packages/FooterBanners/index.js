import React from "react";
import PropTypes from "prop-types";
import { Icon, Typography } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { styled } from "@mui/system";
import styles from "./styles.module.scss";
import GlassesIcon from "./Glasses.svg";
import HeadsetIcon from "./Headset.svg";

const StyledIcon = styled(Icon)({
    height: "auto",
    width: "100px",
});

const StyledTypography = styled(Typography)({
    color: "#686E72",
    lineHeight: "1.25",
});

const StyledTypographyLink = styled(Typography)({
    color: "#1158CF",
    fontWeight: "bold",
});

const StyledArrowForward = styled(ArrowForward)({
    color: "#1158CF",
});

const FooterBanners = ({ className = "", type = "row" }) => {
    return (
        <div className={className}>
            <div className={`${styles.footerBannerContainer} ${styles[type]}`}>
                <Banner
                    className={styles.footerBanner1}
                    icon={GlassesIcon}
                    text="For the latest resources and news for integrity visit the"
                    link="/learning-center"
                    linkText="Knowledge Center"
                />
                <Banner
                    className={styles.footerBanner2}
                    icon={HeadsetIcon}
                    text="Need help? Visit the help center for 24/7 professional"
                    link="/help"
                    linkText="Zendesk Assistance"
                />
            </div>
        </div>
    );
};

FooterBanners.propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(["row", "column"]),
};

FooterBanners.defaultProps = {
    className: "",
    type: "row",
};

const Banner = ({ icon, text, link, linkText, className }) => (
    <div className={className}>
        <StyledIcon>
            <img alt={`${linkText} Icon`} className={styles.icon} src={icon} />
        </StyledIcon>
        <div className={styles.textContentContainer}>
            <div className={styles.textContent}>
                <StyledTypography variant="subtitle1">{text}</StyledTypography>
                <a className={styles.link} target="_blank" href={link} rel="noopener noreferrer">
                    <StyledTypographyLink variant="subtitle1">{linkText}</StyledTypographyLink>
                    <StyledArrowForward />
                </a>
            </div>
        </div>
    </div>
);

Banner.propTypes = {
    icon: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
};

export default FooterBanners;