import React from "react";
import { Helmet } from "react-helmet-async";
import GlobalNav from "partials/global-nav-v2";
import GlobalFooter from "partials/global-footer";
import WebChatComponent from "components/WebChat/WebChat";
import { ContactDetailsContainer, ContactProfileTabBar, DuplicateContactNotificationBanner } from "components/ContactDetailsContainer";

const ContactProfile = () => {
    return (
        <>
            <Helmet>
                <title>Integrity Clients - Contact Profile </title>
            </Helmet>
            <GlobalNav />
            <DuplicateContactNotificationBanner />
            <ContactProfileTabBar />
            <ContactDetailsContainer />
            <WebChatComponent />
            <GlobalFooter />
        </>
    );
};

export default ContactProfile;
