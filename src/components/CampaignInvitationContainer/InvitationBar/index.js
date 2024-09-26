import React, { useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import ArrowDownBig from "components/icons/version-2/ArrowDownBig";
import styles from "./styles.module.scss";
import AllContacts from "components/icons/Marketing/allContacts";
import FilterContacts from "components/icons/Marketing/filterContacts";
import ChooseContact from "components/icons/Marketing/chooseContact";
import CustomFilter from "components/icons/Marketing/customFilter";

import { useCampaignInvitation } from "providers/CampaignInvitation";
import ReUseFilters from "components/ReUseFilters";
import AutoCompleteContactSearchModal from "components/ChooseContactModal";
import CustomPopover from "components/CustomPopOver";

const actionIcons = {
    "all contacts": <AllContacts />,
    "a contact": <ChooseContact />,
    "contacts filtered by…": <FilterContacts />,
};

const contactOptions = [
    { optionText: "all contacts", value: { actionName: "all contacts" }, icon: <AllContacts /> },
    { optionText: "a contact", value: { actionName: "a contact" }, icon: <ChooseContact /> },
    {
        optionText: "contacts filtered by ",
        icon: <FilterContacts />,
        value: { actionName: "contacts filtered by .." },
    },
];

const InvitationBar = () => {
    const {
        filteredContentStatus,
        setFilteredContactsList,
        setFilteredCount,
        setFilteredContentStatus,
        handleSummaryBarInfo,
        setSelectedContact,
        campaignChannel,
        contactName,
        campaignStatus,
        campaignStatuses,
        isFetchCampaignDetailsByEmailLoading,
        isFetchCampaignDetailsByTextLoading,
        isUpdateCampaignLoading,
        campaignActionType,
        setCampaignActionType,
        contactSearchId,
        campaignActions,
        setActionDescription,
        selectedContact,
        handleCreateOrUpdateCampaign,
    } = useCampaignInvitation();

    const emailActionsList = campaignActions.map((action) => ({
        optionText: action.actionName,
        value: action,
        icon: actionIcons[action.actionName] || <CustomFilter />,
    }));

    const smsActionsList = [
        { optionText: "a contact", value: { actionName: "a contact", actionDescription: "" }, icon: <ChooseContact /> },
    ];

    const emailList = emailActionsList?.length > 0 ? emailActionsList : contactOptions;

    const campaignActionOptions = campaignChannel === "Email" ? emailList : smsActionsList;

    const readOnly = campaignStatus === campaignStatuses.COMPLETED;

    const [contactOptionOpen, setContactOptionOpen] = useState(null);
    const [chooseContactModalOpen, setChooseContactModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleContactOptionsChange = useCallback(
        (value) => {
            const action = value?.actionName;
            setCampaignActionType(action);
            if (action === "a contact") {
                sessionStorage.removeItem("campaign_contactList_selectedFilterSections");
                setChooseContactModalOpen(true);
            } else if (action === "contacts filtered by…") {
                setAnchorEl(contactOptionOpen);
            } else {
                sessionStorage.removeItem("campaign_contactList_selectedFilterSections");
                setSelectedContact(null);
                setActionDescription(value?.actionDescription);
            }
            setContactOptionOpen(null);
        },
        [contactOptionOpen, setSelectedContact, setCampaignActionType, setActionDescription]
    );

    const handleCloseFilterDropdown = useCallback(() => {
        setAnchorEl(null);
        const selectedFilters = JSON.parse(sessionStorage.getItem("campaign_contactList_selectedFilterSections"));
        const filteredData = selectedFilters?.filter(
            (filter) => filter?.selectedFilterOption && isFilterSelectOpen === false
        );

        if (!filteredData || filteredData?.length === 0) {
            setCampaignActionType("");
            setFilteredContactsList([]);
            setFilteredCount(0);
            setFilteredContentStatus();
            sessionStorage.removeItem("campaign_contactList_selectedFilterSections");

            handleCreateOrUpdateCampaign({
                campaign_ActionType: "empty",
            });
        }
    }, [setAnchorEl, setFilteredContactsList, setCampaignActionType, filteredContentStatus]);

    const handleContactOptions = useCallback(
        (event) => {
            setContactOptionOpen(contactOptionOpen ? null : event.currentTarget);
        },
        [contactOptionOpen, campaignActionType]
    );

    return (
        <Box className={styles.emailOptions}>
            <Typography variant="h3" className={styles.optionText}>
                to
            </Typography>
            <Box
                className={`${styles.bigOption} ${readOnly ? styles.disabled : ""}`}
                onClick={
                    readOnly ||
                    isUpdateCampaignLoading ||
                    isFetchCampaignDetailsByEmailLoading ||
                    isFetchCampaignDetailsByTextLoading
                        ? undefined
                        : handleContactOptions
                }
            >
                <Typography className={styles.bigOptionLink}>
                    {campaignActionType === "contacts filtered by…" && `Filtered contacts`}
                    {campaignActionType === "a contact" && (contactName ? contactName : "")}
                    {campaignActionType !== "contacts filtered by…" &&
                    campaignActionType !== "a contact" &&
                    campaignActionType !== ""
                        ? campaignActionType
                        : ""}
                    {campaignActionType?.length > 2 ? "." : ""}
                </Typography>
                {!readOnly && <ArrowDownBig width="40px" height="40px" />}

                <CustomPopover
                    options={campaignActionOptions}
                    anchorEl={contactOptionOpen}
                    handleAction={handleContactOptionsChange}
                    handleClose={() => setContactOptionOpen(null)}
                />
            </Box>

            <ReUseFilters
                anchorEl={anchorEl}
                handleClose={handleCloseFilterDropdown}
                handleSummaryBarInfo={handleSummaryBarInfo}
                searchId={contactSearchId}
            />

            {!readOnly && chooseContactModalOpen && (
                <AutoCompleteContactSearchModal
                    open={chooseContactModalOpen}
                    handleClose={() => setChooseContactModalOpen(false)}
                    handleCancel={() => {
                        setChooseContactModalOpen(false);
                        if (!selectedContact) {
                            setCampaignActionType("");
                        }
                    }}
                    handleContactSelect={setSelectedContact}
                    title="Select a Contact"
                    subTitle="Search for a contact by name"
                    searchId={contactSearchId}
                    currentContactOption={campaignChannel}
                />
            )}
        </Box>
    );
};

export default InvitationBar;
