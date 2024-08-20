import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ArrowDownBig from "components/icons/version-2/ArrowDownBig";
import styles from "./styles.module.scss";
import AllContacts from "components/icons/Marketing/allContacts";
import FilterContacts from "components/icons/Marketing/filterContacts";
import ChooseContact from "components/icons/Marketing/chooseContact";

import { useCampaignInvitation } from "providers/CampaignInvitation";
import ReUseFilters from "components/ReUseFilters";
import AutoCompleteContactSearchModal from "components/ChooseContactModal";
import CustomPopover from "components/CustomPopOver";

const contactOptions = [
    { optionText: "all contacts", value: "all contacts", icon: <AllContacts /> },
    { optionText: "a contact", value: "a contact", icon: <ChooseContact /> },
    { optionText: "contacts filtered by ..", icon: <FilterContacts />, value: "contacts filtered by .." },
];

const InvitationBar = () => {
    const {
        invitationSendType,
        filteredContactsType,
        setFilteredContactsType,
        filteredCount,
        totalContactsCount,
        handleInvitationSendType,
        invitationName,
        handleSummaryBarInfo,
        setSelectedContact: handleContactSelect,
        contactName,
    } = useCampaignInvitation();

    const [contactOptionOpen, setContactOptionOpen] = useState(null);

    const [chooseContactModalOpen, setChooseContactModalOpen] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);

    const handeContactOptionsChange = (value) => {
        setFilteredContactsType(value);
        if (value === "a contact") {
            setChooseContactModalOpen(true);
        } else if (value === "all contacts") {
            handleContactSelect(null);
        } else {
            setAnchorEl(contactOptionOpen);
        }

        setContactOptionOpen(null);
    };

    const handleCloseFilterDropdown = () => {
        setAnchorEl(null);
    };

    const handleContactOptions = (event) => {
        setContactOptionOpen(contactOptionOpen ? null : event.currentTarget);
    };

    return (
        <Box className={styles.emailOptions}>
            <Box>
                <Typography className={styles.optionText}>
                    I want to send an email to have clients create a Plan Enroll Account to
                </Typography>
            </Box>

            <Box className={styles.option} onClick={handleContactOptions}>
                <Typography className={styles.optionLink}>
                    {filteredContactsType === "all contacts" && `all contacts`}
                    {filteredContactsType === "contacts filtered by .." && `${filteredCount} Contacts`}
                    {filteredContactsType === "a contact" && (contactName ? contactName : "")}
                </Typography>
                <ArrowDownBig width="40px" height="40px" />

                <CustomPopover
                    options={contactOptions}
                    anchorEl={contactOptionOpen}
                    handleAction={handeContactOptionsChange}
                />
            </Box>

            <ReUseFilters
                anchorEl={anchorEl}
                handleClose={handleCloseFilterDropdown}
                handleSummaryBarInfo={handleSummaryBarInfo}
            />
            {chooseContactModalOpen && (
                <AutoCompleteContactSearchModal
                    open={chooseContactModalOpen}
                    handleClose={() => setChooseContactModalOpen(false)}
                    handleContactSelect={handleContactSelect}
                    title="Search for Contact"
                    subTitle="Search for a contact by name"
                />
            )}
        </Box>
    );
};

export default InvitationBar;
