import React from "react";
import Icon from "@mui/material/Icon";
import GlassesIcon from "./Glasses.svg";
import HeadsetIcon from "./Headset.svg";
import { Typography } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import styles from "./styles.module.scss";
import { styled } from "@mui/system";

const StyledIcon = styled(Icon)(({ theme }) => ({
  height: "auto",
  width: "100px",
}));
const StyledTypography = styled(Typography)(({ theme }) => ({
  color: "#686E72",
  lineHeight: "1.25",
}));
const StyledTypographyLink = styled(Typography)(({ theme }) => ({
  color: "#1158CF",
  fontWeight: "bold",
}));
const StyledArrowForward = styled(ArrowForward)(({ theme }) => ({
  color: "#1158CF",
}));

export default function FooterBanners({ className = "", type = "row" }) {
  return (
    <div className={className}>
      <div className={`${styles.footerBannerContainer} ${styles[type]}`}>
        <div className={styles.footerBanner1}>
          <StyledIcon>
            <img alt="Glasses Icon" className={styles.icon} src={GlassesIcon} />
          </StyledIcon>
          <div className={styles.textContentContainer}>
            <div className={styles.textContent}>
              <StyledTypography variant="subtitle1">
                For the latest resources and news for integrity visit the
              </StyledTypography>
              <a
                className={styles.link}
                target="_blank"
                href="/learning-center"
                rel="noopener noreferrer"
              >
                <StyledTypographyLink variant="subtitle1">
                  Knowledge Center
                </StyledTypographyLink>
                <StyledArrowForward />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.footerBanner2}>
          <StyledIcon>
            <img alt="Headset Icon" className={styles.icon} src={HeadsetIcon} />
          </StyledIcon>
          <div className={styles.textContentContainer}>
            <div className={styles.textContent}>
              <StyledTypography variant="subtitle1">
                Need help? Visit the help center for 24/7 professional
              </StyledTypography>
              <a
                className={styles.link}
                target="_blank"
                href="/help"
                rel="noopener noreferrer"
              >
                <StyledTypographyLink variant="subtitle1">
                  Zendesk Assistance
                </StyledTypographyLink>
                <StyledArrowForward />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
