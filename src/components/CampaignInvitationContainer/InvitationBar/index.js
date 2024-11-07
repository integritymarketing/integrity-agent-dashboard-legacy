import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import ArrowDownBig from "components/icons/version-2/ArrowDownBig";
import styles from "./styles.module.scss";
import AllContacts from "components/icons/Marketing/allContacts";
import FilterContacts from "components/icons/Marketing/filterContacts";
import ChooseContact from "components/icons/Marketing/chooseContact";
import CustomFilter from "components/icons/Marketing/customFilter";
import WhenContactFilter from "components/icons/Marketing/aContactWhen";
import { useCampaignInvitation } from "providers/CampaignInvitation";
import ReUseFilters from "components/ReUseFilters";
import AutoCompleteContactSearchModal from "components/ChooseContactModal";
import CustomPopover from "components/CustomPopOver";

const actionIcons = {
    "all contacts": <AllContacts />,
    "a contact": <ChooseContact />,
    "a contact when": <WhenContactFilter />,
    "contacts filtered by…": <FilterContacts />,
};

const contactOptions = [
    { optionText: "all contacts", value: { actionName: "all contacts" }, icon: <AllContacts /> },
    { optionText: "a contact", value: { actionName: "a contact" }, icon: <ChooseContact /> },
    {
        optionText: "contacts filtered by ",
        icon: <FilterContacts />,
        value: { actionName: "contacts filtered by…" },
    },
];

const InvitationBar = ({ readOnly }) => {
    const {
        handleSummaryBarInfo,
        setSelectedContact,
        campaignChannel,
        contactName,
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
        resetSecond,
        resetThird,
        setActionOrderedId,
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
            } else if (action === "contacts filtered by…" || action === "a contact when") {
                if (action !== campaignActionType) {
                    resetThird();
                    setActionOrderedId(0);
                }
                setAnchorEl(contactOptionOpen);
            } else {
                sessionStorage.removeItem("campaign_contactList_selectedFilterSections");
                setSelectedContact(null);
                setActionDescription(value?.actionDescription);
                setActionOrderedId(value?.actionOrder);
            }
            setContactOptionOpen(null);
        },
        [contactOptionOpen, setSelectedContact, setCampaignActionType, setActionDescription, resetSecond, campaignActionType]
    );

    const handleCloseFilterDropdown = useCallback(() => {
        setAnchorEl(null);
        const selectedFilters = JSON.parse(sessionStorage.getItem("campaign_contactList_selectedFilterSections"));
        const filteredData = selectedFilters?.filter((filter) => filter?.selectedFilterOption);

        if (!filteredData || filteredData?.length === 0) {
            resetSecond();
            handleCreateOrUpdateCampaign({
                campaign_ActionType: "empty",
            });
        }
    }, [setAnchorEl, resetSecond, handleCreateOrUpdateCampaign]);

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
                    {campaignActionType === "a contact when" && "a contact when a tag is added"}
                    {campaignActionType === "a contact" && (contactName ? contactName : "")}
                    {campaignActionType !== "contacts filtered by…" &&
                    campaignActionType !== "a contact" &&
                    campaignActionType !== "a contact when" &&
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
                    selected={campaignActionType}
                />
            </Box>

            <ReUseFilters
                anchorEl={anchorEl}
                handleClose={handleCloseFilterDropdown}
                handleSummaryBarInfo={handleSummaryBarInfo}
                searchId={contactSearchId}
                isSingleSelect={campaignActionType === "a contact when"}
            />

            {!readOnly && chooseContactModalOpen && (
                <AutoCompleteContactSearchModal
                    open={chooseContactModalOpen}
                    handleClose={() => setChooseContactModalOpen(false)}
                    handleCancel={() => {
                        setChooseContactModalOpen(false);
                        if (!selectedContact) {
                            resetSecond();
                            handleCreateOrUpdateCampaign({
                                campaign_ActionType: "empty",
                            });
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

InvitationBar.propTypes = {
    readOnly: PropTypes.bool,
};

export default InvitationBar;