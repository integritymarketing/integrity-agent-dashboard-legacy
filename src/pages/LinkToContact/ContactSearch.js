import React, { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, ListItem, ListItemButton, ListItemText, OutlinedInput, Typography } from "@mui/material";
import { styled } from "@mui/system";

import useToast from "hooks/useToast";
import useAnalytics from "hooks/useAnalytics";

import Heading3 from "packages/Heading3";

import Spinner from "components/ui/Spinner/index";

import callRecordingsService from "services/callRecordingsService";
import clientsService from "services/clientsService";

import styles from "./styles.module.scss";

const SearchInput = styled(OutlinedInput)(() => ({
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    borderRadius: "4px",
    "input::placeholder": {
        color: "#434A51",
        fontSize: "16px",
    },
}));

const ContactListItemButton = ({ contact, callFrom, leadId, callLogId, children }) => {
    const showToast = useToast();
    const { fireEvent } = useAnalytics();
    const navigate = useNavigate();

    const updatePrimaryContact = useCallback(() => {
        return clientsService.updateLeadPhone(contact, callFrom);
    }, [contact, callFrom]);

    const onClickHandler = useCallback(async () => {
        try {
            const reverseArray = contact?.phones?.reverse();
            const hasPhone = reverseArray[0]?.leadPhone;
            if (!hasPhone) {
                await updatePrimaryContact();
            }
            if (callLogId) {
                await callRecordingsService.assignsLeadToInboundCallRecord({
                    callLogId,
                    leadId,
                    isInbound: true,
                });
                showToast({
                    message: "Contact linked successfully",
                });
                fireEvent("Call Linked", {
                    leadid: leadId,
                });
                navigate(`/contact/${leadId}`);
            }
        } catch (error) {
            showToast({
                type: "error",
                message: `${error.message}`,
            });
        }
    }, [navigate, leadId, callLogId, showToast, contact.phones, fireEvent, updatePrimaryContact]);

    return (
        <div className={styles.contactName} onClick={onClickHandler}>
            {children}
        </div>
    );
};

export default function ContactSearch({ contacts, onChange, isLoading }) {
    const { callLogId, callFrom } = useParams();
    const [searchStr, setSearchStr] = useState("");
    const callLogIdNumber = Number(callLogId);

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
                    leadId={value.leadsId}
                    callLogId={callLogIdNumber}
                    contact={value}
                    callFrom={callFrom}
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
