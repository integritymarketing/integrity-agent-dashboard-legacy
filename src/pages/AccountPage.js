import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Box from "@mui/material/Box";

import useUserProfile from "hooks/useUserProfile";

import Heading2 from "packages/Heading2";

import Container from "components/ui/container";
import SupportLinksCard from "components/SupportLinksCard";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";

import analyticsService from "services/analyticsService";

import { PersonalInfo } from "./Account/PersonalInfo";
import { ActivePermissions } from "./Account/ActivePermissions";
import AgentPhone from "./Account/AgentPhone";
import AgentWebsite from "./Account/AgentWebsite";
import ChangePassword from "./Account/ChangePassword";
import AvailabilityPreferences from "./Account/AvailabilityPreferences";
import { SelfAttestedPermissions } from "./Account/SelfAttestedPermissions";
import { SellingPreferences } from "./Account/SellingPreferences";
import { LIFE, useAccountProductsContext } from "./Account/providers/AccountProductsProvider";

import styles from "./AccountPage.module.scss";

const AccountPage = () => {
    const userProfile = useUserProfile();
    const { section } = useParams();
    const { setLayout } = useAccountProductsContext();

    const sellingPermissionsRef = useRef(null);
    const selfAttestedPermissionsRef = useRef(null);

    useEffect(() => {
        analyticsService.fireEvent("event-content-load", {
            pagePath: "/update-account/",
        });
    }, []);

    useEffect(() => {
        if (section === "sellingPermissions" && sellingPermissionsRef.current) {
            setLayout(LIFE);
            sellingPermissionsRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (section === "selfAttestedPermissions" && selfAttestedPermissionsRef.current) {
            setLayout(LIFE);
            selfAttestedPermissionsRef.current.scrollIntoView({ behavior: "smooth" });
        }
    });

    const mainContentClassName = `container ${styles.headerLayout}`;
    return (
        <React.Fragment>
            <Helmet>
                <title>Integrity - Edit Account</title>
            </Helmet>
            <GlobalNav />
            <div className="v2" data-gtm="account-update-form" style={{ backgroundColor: "#f1f1f1" }}>
                <div className={styles.headerLayoutContainer}>
                    <div id="main-content" className={mainContentClassName}>
                        <div>
                            <Heading2 className={styles.headerLayoutText} text="Account" />
                        </div>
                    </div>
                </div>
                {userProfile.agentId && (
                    <Container className="mt-scale-2">
                        <div className={styles.accountPageContainer}>
                            <div className={styles.sectionOne}>
                                <PersonalInfo />
                                <section className="mt-3">
                                    <ChangePassword />
                                </section>
                            </div>
                            <div className={styles.sectionTwo}>
                                <section className={styles.preferences}>
                                    <AvailabilityPreferences />
                                </section>
                                <section className={styles.website}>
                                    <AgentPhone />
                                    <Box mt={4}>
                                        <AgentWebsite />
                                    </Box>
                                    <Box mt={4}>
                                        <SellingPreferences />
                                    </Box>
                                </section>
                            </div>
                        </div>
                    </Container>
                )}
                <div className={styles.rtsTableContainer}>
                    <div ref={sellingPermissionsRef}>
                        <ActivePermissions />
                    </div>
                    <div ref={selfAttestedPermissionsRef}>
                        <SelfAttestedPermissions />
                    </div>
                    <div>
                        <SupportLinksCard position="column" />
                    </div>
                </div>
            </div>
            <GlobalFooter />
        </React.Fragment>
    );
};

export default AccountPage;
