import React from "react";

import { SectionTitle, Text } from "@integritymarketing/ui-text-components";

import ListContainer from "components/ListContainer";
import MobileIcon from "components/MobileIcon";
import ProfileIcon from "components/ProfileIcon";
import ReportIcon from "components/ReportIcon";
import SplitContentTrailingImageSection from "components/SplitContentTrailingImageSection";

import useConstants from "./constants";
import apple from "./images/apple.svg";
import google from "./images/google.svg";
import styles from "./styles.module.scss";

const items = [
    {
        icon: <ProfileIcon />,
        text: "Simplify how you maintain compliance – this valuable feature allows you to record, download and store both inbound and outbound sales calls as required by CMS regulations.",
        title: "Call Recording",
    },
    {
        icon: <ReportIcon />,
        text: "Understand and meet needs faster with at-a-glance client tracking.",
        title: "Dashboard and Reporting",
    },
    {
        icon: <MobileIcon />,
        images: [
            {
                altText: "google download link",
                image: google,
                link: "https://play.google.com/store/apps/details?id=com.medicarecenter",
            },
            {
                altText: "apple download link",
                image: apple,
                link: "https://apps.apple.com/us/app/medicarecenter/id1623328763",
            },
        ],
        text: "Work when you want, from where you want. Get mobile-exclusive push notifications, plus all the features of Integrity. Download today!",
        title: "Mobile App",
    },
];

const ServeClientsBetterSection = () => {
    const { SERVE_CLIENTS_BETTER, WITH_CONTACT_MANAGEMENT } = useConstants();

    return (
        <SplitContentTrailingImageSection className={styles.serveClientsBetterSection}>
            <SectionTitle text={SERVE_CLIENTS_BETTER} />

            <Text text={WITH_CONTACT_MANAGEMENT} />

            <ListContainer className={styles.listContainer} items={items} />
        </SplitContentTrailingImageSection>
    );
};

export default ServeClientsBetterSection;
