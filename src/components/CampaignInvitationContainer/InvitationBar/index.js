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
        handleSummaryBarInfo,
        setSelectedContact,
        invitationSendType,
        contactName,
        createdNewCampaign,
        campaignInvitationData,
        campaignStatuses,
        isFetchCampaignDetailsByEmailLoading,
        isFetchCampaignDetailsByTextLoading,
        isUpdateCampaignLoading,
    } = useCampaignInvitation();

    const filteredContactOptions =
        invitationSendType === "Sms" ? contactOptions.filter((option) => option.value === "a contact") : contactOptions;

    const readOnly = createdNewCampaign?.campaignStatus === campaignStatuses.COMPLETED;

    const [contactOptionOpen, setContactOptionOpen] = useState(null);
    const [chooseContactModalOpen, setChooseContactModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleContactOptionsChange = useCallback(
        (value) => {
            setFilteredContactsType(value);
            if (value === "a contact") {
                sessionStorage.removeItem("campaign_contactList_selectedFilterSections");
                setChooseContactModalOpen(true);
            } else if (value === "all contacts") {
                sessionStorage.removeItem("campaign_contactList_selectedFilterSections");
                setSelectedContact(null);
            } else {
                setAnchorEl(contactOptionOpen);
            }
            setContactOptionOpen(null);
        },
        [contactOptionOpen, setSelectedContact, setFilteredContactsType],
    );

    const handleCloseFilterDropdown = useCallback(() => {
        setAnchorEl(null);
    }, [setAnchorEl]);

    const handleContactOptions = useCallback(
        (event) => {
            setContactOptionOpen(contactOptionOpen ? null : event.currentTarget);
        },
        [contactOptionOpen, filteredContactsType],
    );

    return (
        <Box className={styles.emailOptions}>
            <Typography variant="h3" className={styles.optionText}>
                to
            </Typography>
            <Box
                className={`${styles.option} ${readOnly ? styles.disabled : ""}`}
                onClick={
                    readOnly ||
                    isUpdateCampaignLoading ||
                    isFetchCampaignDetailsByEmailLoading ||
                    isFetchCampaignDetailsByTextLoading
                        ? undefined
                        : handleContactOptions
                }
            >
                <Typography className={styles.optionLink}>
                    {filteredContactsType === "all contacts" && `all contacts`}
                    {filteredContactsType === "contacts filtered by .." && `Filtered contacts`}
                    {filteredContactsType === "a contact" && (contactName ? contactName : "")}
                    {filteredContactsType === "" ? "" : "."}
                </Typography>
                {!readOnly && <ArrowDownBig width="40px" height="40px" />}

                <CustomPopover
                    options={filteredContactOptions}
                    anchorEl={contactOptionOpen}
                    handleAction={handleContactOptionsChange}
                    handleClose={() => setContactOptionOpen(null)}
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
                    }}
                    handleContactSelect={setSelectedContact}
                    title="Select a Contact"
                    subTitle="Search for a contact by name"
                    campaignId={campaignInvitationData?.id}
                />
            )}
        </Box>
    );
};

export default InvitationBar;
