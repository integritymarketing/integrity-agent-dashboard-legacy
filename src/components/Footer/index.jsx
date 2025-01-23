import React from "react";
import { FOOTER_TEXT } from "./constants";
import styles from "./styles.module.scss";
import { Link } from "react-router-dom";
import Logo from "components/Logo";
import FooterText from "components/FooterText";

const Footer = ({ isLoggedIn = true }) => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerLinks}>
                <Link to={"/terms"}>
                    <FooterText text="Terms of Use" />
                </Link>
                <Link to={"/privacy"}>
                    <FooterText text="Privacy Policy" />
                </Link>
            </div>
            <div className={styles.appFooter}>
                <Logo className={styles.logo} />
                {isLoggedIn && (
                    <div className={styles.links}>
                        <Link to="/about">About</Link>
                        <Link to="/contact">Contact</Link>
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/terms">Terms</Link>
                    </div>
                )}
            </div>
            <div className={styles.text}>{FOOTER_TEXT}</div>
        </footer>
    );
};

export default Footer;
