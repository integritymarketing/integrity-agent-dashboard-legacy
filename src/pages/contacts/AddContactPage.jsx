import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useParams } from "react-router-dom";

import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";

import analyticsService from "services/analyticsService";
import Media from "react-media";
import { PageHeader } from "../../components/PageHeader";

import ContactForm from "../../components/ContactForm/ContactForm";

export default function AddContactPage() {
    const { callLogId } = useParams();
    const [isMobile, setIsMobile] = useState(false);
    const { state, search } = useLocation();

    const searchParams = new URLSearchParams(search);
    const tags = searchParams.get("tags"); // Retrieve the 'tags' query parameter

    const callLogIdNumber = callLogId ? Number(callLogId) : null;
    const { policyHolder } = state?.state ?? {};
    let firstName = "";
    let lastName = "";
    const prefix = "";
    const suffix = "";
    const maritalStatus = "";
    const hasMedicAid = null;

    if (policyHolder) {
        const splitName = policyHolder?.split(" ");
        firstName = splitName[0];
        lastName = splitName[1];
    }

    useEffect(() => {
        analyticsService.fireEvent("event-content-load", {
            pagePath: "/new-contact/",
        });
    }, []);

    return (
        <>
            <Media
                query={"(max-width: 500px)"}
                onChange={(val) => {
                    setIsMobile(val);
                }}
            />
            <Helmet>
                <title>Add new contact</title>
            </Helmet>
            <GlobalNav />
            <PageHeader isMobile={isMobile} backPath={"/contacts/list"} pageName={"Add New Contact"} />
            <ContactForm
                callLogId={callLogIdNumber}
                firstName={firstName}
                lastName={lastName}
                state={state}
                tags={tags}
                prefix={prefix}
                suffix={suffix}
                maritalStatus={maritalStatus}
                hasMedicAid={hasMedicAid}
            />
            <GlobalFooter />
        </>
    );
}
