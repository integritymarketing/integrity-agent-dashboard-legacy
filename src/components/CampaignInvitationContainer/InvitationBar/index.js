import React, { useState, useCallback } from "react";
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
        filteredContactsType,
        setFilteredContactsType,
        filteredCount,
        handleSummaryBarInfo,
        setSelectedContact,
        invitationSendType,
        contactName,
        createdNewCampaign,
        campaignInvitationData,
        handleSetDefaultSelection,
        campaignStatuses
    } = useCampaignInvitation();

    const filteredContactOptions = invitationSendType === "Sms"
        ? contactOptions.filter(option => option.value === "a contact")
        : contactOptions;

    const readOnly = createdNewCampaign?.campaignStatus === campaignStatuses.COMPLETED;

    const [contactOptionOpen, setContactOptionOpen] = useState(null);
    const [chooseContactModalOpen, setChooseContactModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleContactOptionsChange = useCallback(
        (value) => {
            setFilteredContactsType(value);
            if (value === "a contact") {
                localStorage.removeItem("campaign_contactList_selectedFilterSections");
                setChooseContactModalOpen(true);
            } else if (value === "all contacts") {
                localStorage.removeItem("campaign_contactList_selectedFilterSections");
                setSelectedContact(null);
            } else {
                setAnchorEl(contactOptionOpen);
            }
            setContactOptionOpen(null);
        },
        [contactOptionOpen, setSelectedContact, setFilteredContactsType]
    );

    const handleCloseFilterDropdown = useCallback(() => {
        const selectedFilterSections = JSON.parse(
            localStorage.getItem("campaign_contactList_selectedFilterSections")
        );
        setAnchorEl(null);
        if (
            !selectedFilterSections ||
            selectedFilterSections.length === 0 ||
            (selectedFilterSections.length === 1 &&
                !selectedFilterSections[0]?.selectedFilterOption)
        ) {
            handleSetDefaultSelection();
        }
    }, [handleSetDefaultSelection]);

    const handleContactOptions = useCallback(
        (event) => {
            setContactOptionOpen(contactOptionOpen ? null : event.currentTarget);
        },
        [contactOptionOpen]
    );

    return (
        <Box className={styles.emailOptions}>
            <Typography variant="h3" className={styles.optionText}>
                to
            </Typography>
            <Box className={`${styles.option} ${readOnly ? styles.disabled : ''}`} onClick={readOnly ? undefined : handleContactOptions}>
                <Typography className={styles.optionLink}>
                    {filteredContactsType === "" && ""}
                    {filteredContactsType === "all contacts" && `all contacts`}
                    {filteredContactsType === "contacts filtered by .." && `${filteredCount} Contacts`}
                    {filteredContactsType === "a contact" && (contactName ? contactName : "")}
                </Typography>
                {!readOnly && <ArrowDownBig width="40px" height="40px" />}

                <CustomPopover
                    options={filteredContactOptions}
                    anchorEl={contactOptionOpen}
                    handleAction={handleContactOptionsChange}
                />
            </Box>

            <ReUseFilters
                anchorEl={anchorEl}
                handleClose={handleCloseFilterDropdown}
                handleSummaryBarInfo={handleSummaryBarInfo}
                campaignId={campaignInvitationData?.id}
            />

            {!readOnly && chooseContactModalOpen && (
                <AutoCompleteContactSearchModal
                    open={chooseContactModalOpen}
                    handleClose={() => setChooseContactModalOpen(false)}
                    handleCancel={() => {
                        setChooseContactModalOpen(false);
                        handleSetDefaultSelection();
                    }}
                    handleContactSelect={setSelectedContact}
                    title="Select a Contact"
                    subTitle="Search for a contact by name"
                    campaignId={campaignInvitationData?.id}
                    handleSetDefaultSelection={handleSetDefaultSelection}
                />
            )}
        </Box>
    );
};

export default InvitationBar;
