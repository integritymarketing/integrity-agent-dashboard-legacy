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

import { ContactsCard } from "./ContactsCard";
import { ContactsListActions } from "./ContactsListActions";
import { ContactsTable } from "./ContactsTable";
import { DuplicateBanner } from "./DuplicateBanner";
import { FilteredLeadIdsBanner } from "./FilteredLeadIdsBanner";
import { ContactsListModalProvider } from "./providers/ContactsListModalProvider";
import { ContactsListProvider } from "./providers/ContactsListProvider";
import styles from "./styles.module.scss";

function ContactsList() {

    return (
        <>
            <Helmet>
                <title>Integrity - Contacts</title>
            </Helmet>
            <GlobalNav />
            <ContactsListHeader />
            <StageStatusProvider>
                <ContactsListModalProvider>
                    <ContactsListProvider>
                        <Box className={styles.wrapper}>
                            <Container className={styles.container}>
                                <ContactsListActions />
                                <FilteredLeadIdsBanner />
                                <DuplicateBanner />
                                <Divider className={styles.divider} />
                                <Routes>
                                    <Route path="/" element={<Navigate to="/contacts/list" replace={true} />} />
                                    <Route path="/list" element={<ContactsTable />} />
                                    <Route path="/card" element={<ContactsCard />} />
                                </Routes>
                            </Container>
                        </Box>
                    </ContactsListProvider>
                </ContactsListModalProvider>
                <Box className={styles.footerContainer}>
                    <SupportLinksCard />
                </Box>
                <GlobalFooter />
            </StageStatusProvider>
        </>
    );
}

export default ContactsList;
