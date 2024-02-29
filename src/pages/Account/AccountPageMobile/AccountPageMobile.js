import Box from "@mui/material/Box";

import ResourceSection from "components/ui/resourcesCard";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";

import SubHeaderMobile from "mobile/Components/subHeader";

import AgentPhone from "pages/Account/AgentPhone";
import { PersonalInfo } from "pages/Account/PersonalInfo";
import AgentWebsite from "pages/Account/AgentWebsite";
import AvailabilityPreferences from "pages/Account/AvailabilityPreferences";
import ChangePassword from "pages/Account/ChangePassword";
import { SellingPreferences } from "pages/Account/SellingPreferences";
import { SelfAttestedPermissions } from "pages/Account/SelfAttestedPermissions";
import { ActivePermissions } from "pages/Account/ActivePermissions";

import styles from "./styles.module.scss";

function AccountPageMobile() {
    return (
        <Box className={styles.container}>
            <GlobalNav />
            <SubHeaderMobile title="Account Settings" />
            <Box className={styles.content}>
                <PersonalInfo />
                <AgentWebsite />
                <AgentPhone />
                <AvailabilityPreferences />
                <SellingPreferences />
                <ChangePassword />
                <ActivePermissions />
                <SelfAttestedPermissions />
            </Box>
            <ResourceSection />
            <GlobalFooter />
        </Box>
    );
}

export default AccountPageMobile;
