import React from "react";
import ContentContainer from "components/ContentContainer";
import FooterText from "components/FooterText";

import { creditText } from "./constants";

import styles from "./styles.module.scss";
import { Link } from "react-router-dom";

const Footer = ({ className = "" }) => {
  return (
    <footer className={`${className} ${styles.footer}`}>
      <ContentContainer>
        <div className={styles.footerLayout}>
          <div className={styles.footerLinks}>
            <Link to={"/terms"}>
              <FooterText text="Terms of Use" />
            </Link>
            <Link to={"/privacy"}>
              <FooterText text="Privacy Policy" />
            </Link>
          </div>
          <FooterText text={creditText} />
        </div>
      </ContentContainer>
    </footer>
  );
};

export default Footer;
