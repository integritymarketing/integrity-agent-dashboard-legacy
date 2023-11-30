import React from "react";
import { Helmet } from "react-helmet-async";
import GlobalNav from "partials/global-nav-v2";
import GlobalFooter from "partials/global-footer";
import WebChatComponent from "components/WebChat/WebChat";
import { ContactDetailsContainer, ContactProfileTabBar } from "components/ContactDetailsContainer";

const ContactProfile = () => {
    return (
        <>
            <Helmet>
                <title>MedicareCENTER - Contact Profile </title>
            </Helmet>
            <GlobalNav />
            <ContactProfileTabBar />
            <ContactDetailsContainer />
            <WebChatComponent />
            <GlobalFooter />
        </>
    );
};

export default ContactProfile;
