import React, { useState, useCallback, useEffect, useRef } from "react";
import { InputAdornment, ListItem, ListItemButton, ListItemText, OutlinedInput, Typography } from "@mui/material";
import * as Sentry from "@sentry/react";
import { useNavigate, useParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./styles.module.scss";
import useToast from "hooks/useToast";
import useAnalytics from "hooks/useAnalytics";
import Heading3 from "packages/Heading3";
import { styled } from "@mui/system";
import Spinner from "components/ui/Spinner/index";
import { useClientServiceContext } from "services/clientServiceProvider";

const SearchInput = styled(OutlinedInput)(() => ({
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    borderRadius: "4px",
    "input::placeholder": {
        color: "#434A51",
        fontSize: "16px",
    },
}));

const ContactListItemButton = ({
    contact,
    callFrom,
    selectedLeadId,
    callLogId,
    children,
    state,
    leadInfo,
    setLeadInfo, // Accessing setLeadInfo here
}) => {
    const showToast = useToast();
    const navigate = useNavigate();
    const { fireEvent } = useAnalytics();
    const firstRender = useRef(true);
    const { clientsService, enrollPlansService } = useClientServiceContext();
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const getLeadInformation = async () => {
            try {
                const response = await clientsService.getContactInfo(state?.leadId);
                if (response) {
                    setLeadInfo(response);
                }
            } catch (error) {
                Sentry.captureException(error);
            }
        };

        getLeadInformation();
    }, [state, setLeadInfo, clientsService]);

    const updatePrimaryContact = useCallback(() => {
        return clientsService.updateLeadPhone(contact, callFrom);
    }, [clientsService, contact, callFrom]);

    const onClickHandler = useCallback(async () => {
        const { policyId, agentNpn, policyStatus, sourceId, linkingType } = state;
        try {
            const reverseArray = contact?.phones?.reverse();
            const updateBusinessBookPayload = {
                agentNpn: agentNpn,
                leadId: contact?.leadsId?.toString(),
                policyNumber: policyId,
                consumerFirstName: contact?.firstName,
                consumerLastName: contact?.lastName,
                leadDate: leadInfo?.createDate || new Date(),
                leadStatus: policyStatus,
                sourceId: sourceId,
                linkingType: linkingType,
            };
            const hasPhone = reverseArray[0]?.leadPhone;
            if (!hasPhone) {
                await updatePrimaryContact();
            }
            const response = await enrollPlansService.updateBookOfBusiness(updateBusinessBookPayload);
            if (response) {
                showToast({
                    message: "Contact linked successfully",
                });
                fireEvent("Call Linked", {
                    leadid: selectedLeadId,
                });
                navigate(`/contact/${selectedLeadId}`);
            }
        } catch (error) {
            showToast({
                type: "error",
                message: `${error.message}`,
                time: 7000,
            });
        }
    }, [
        navigate,
        showToast,
        contact.phones,
        updatePrimaryContact,
        state,
        leadInfo,
        selectedLeadId,
        contact.firstName,
        contact.lastName,
        contact.leadsId,
        fireEvent,
    ]);

    return (
        <div className={styles.contactName} onClick={onClickHandler}>
            {children}
        </div>
    );
};

export default function ContactSearch({ contacts, onChange, isLoading, state }) {
    const { callLogId, callFrom } = useParams();
    const [searchStr, setSearchStr] = useState("");
    const [leadInfo, setLeadInfo] = useState();

    function renderRow(value, index) {
        const fullname = `${value.firstName} ${value.lastName}`;
        if (isLoading) {
            return (
                <div>
                    <Spinner />
                </div>
            );
        }

        return (
            <ListItem key={`contactindex${index}`} className={styles.contactItem} disablePadding>
                <ListItemButton
                    component={ContactListItemButton}
                    selectedLeadId={value.leadsId}
                    callLogId={callLogId}
                    contact={value}
                    callFrom={callFrom}
                    state={state}
                    leadInfo={leadInfo}
                    setLeadInfo={setLeadInfo}
                >
                    <ListItemText
                        primary={
                            <Typography color={"#0052ce"} variant="subtitle1">
                                {fullname}
                            </Typography>
                        }
                    />
                </ListItemButton>
            </ListItem>
        );
    }

    return (
        <div className={styles.searchContainer}>
            <Heading3 className="pb-1" text="Add to Existing Contact" />
            <SearchInput
                size="small"
                fullWidth
                placeholder={"Start by typing a contact’s name"}
                type="search"
                endAdornment={
                    <InputAdornment position="end">
                        <SearchIcon style={{ color: "#0052CE" }} aria-label="search" edge="end"></SearchIcon>
                    </InputAdornment>
                }
                onChange={(e) => {
                    setSearchStr(e.target.value);
                    onChange(e.target.value);
                }}
            />
            <div className={styles.contactsListContainer}>
                {contacts && contacts.length > 0 && searchStr.length > 0 ? (
                    contacts.map((value, index) => {
                        return renderRow(value, index);
                    })
                ) : (
                    <div className={styles.emptyList}>
                        {" "}
                        {searchStr && searchStr.length > 0 && contacts && contacts.length >= 0
                            ? "No records found"
                            : "Search for a contact"}
                    </div>
                )}
            </div>
        </div>
    );
}
