import { Helmet } from "react-helmet-async";

import {
    ContactDetailsContainer,
    ContactProfileTabBar,
    DuplicateContactNotificationBanner,
} from "components/ContactDetailsContainer";
import WebChatComponent from "components/WebChat/WebChat";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";

const ContactProfile = () => {
    return (
        <>
            <Helmet>
                <title>Integrity - Contact Profile </title>
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
