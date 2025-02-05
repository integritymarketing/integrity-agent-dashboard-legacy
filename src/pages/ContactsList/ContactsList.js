import { Helmet } from "react-helmet-async";
import { Navigate, Route, Routes } from "react-router-dom";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import SupportLinksCard from "components/SupportLinksCard";

import Container from "components/ui/container";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";

import { StageStatusProvider } from "contexts/stageStatus";

import { ContactsListHeader } from "pages/ContactsList/ContactsListHeader";
import { ContactListHeaderMobile } from "./ContactsListHeader/ContactListHeaderMobile";

import useDeviceType from "hooks/useDeviceType";

import { ContactsCard } from "./ContactsCard";
import { ContactsMap } from "./ContactsMap";
import { ContactsListActions } from "./ContactsListActions";
import { ContactsTable } from "./ContactsTable";
import { DuplicateBanner } from "./DuplicateBanner";
import { FilteredLeadIdsBanner } from "./FilteredLeadIdsBanner";
import CampaignsFilterBar from "./CampaignsFilterBar";
import { ContactsListModalProvider } from "./providers/ContactsListModalProvider";
import { ContactsListProvider } from "./providers/ContactsListProvider";
import { ContactDetailsProvider } from "providers/ContactDetails";

import styles from "./styles.module.scss";

function ContactsList() {
    const { isMobile } = useDeviceType();

    return (
        <>
            <Helmet>
                <title>Integrity - Contacts</title>
            </Helmet>
            <GlobalNav />
            {!isMobile && <ContactsListHeader />}
            {isMobile && <ContactListHeaderMobile />}
            <StageStatusProvider>
                <ContactsListModalProvider>
                    <ContactsListProvider>
                        <Box className={styles.wrapper}>
                            <Container>
                                <ContactsListActions isMobile={isMobile} />
                                <FilteredLeadIdsBanner />
                                <DuplicateBanner />
                                <CampaignsFilterBar />
                                {!isMobile && <Divider className={styles.divider} />}
                                <Routes>
                                    <Route path="/" element={<Navigate to="/contacts/list" replace={true} />} />
                                    <Route
                                        path="/list"
                                        element={
                                            <ContactDetailsProvider>
                                                <ContactsTable />
                                            </ContactDetailsProvider>
                                        }
                                    />
                                    <Route
                                        path="/card"
                                        element={
                                            <ContactDetailsProvider>
                                                <ContactsCard />
                                            </ContactDetailsProvider>
                                        }
                                    />
                                    <Route
                                        path="/map"
                                        element={
                                            <ContactDetailsProvider>
                                                <ContactsMap />
                                            </ContactDetailsProvider>
                                        }
                                    />
                                </Routes>
                            </Container>
                        </Box>
                    </ContactsListProvider>
                </ContactsListModalProvider>
                <SupportLinksCard />
                <GlobalFooter />
            </StageStatusProvider>
        </>
    );
}

export default ContactsList;
