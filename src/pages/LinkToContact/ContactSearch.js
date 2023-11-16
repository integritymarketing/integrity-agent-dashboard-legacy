import React, { useState, useCallback } from "react";
import { InputAdornment, ListItem, ListItemButton, ListItemText, OutlinedInput, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./styles.module.scss";
import useToast from "hooks/useToast";
import Heading3 from "packages/Heading3";
import { styled } from "@mui/system";
import { useParams } from "react-router-dom";
import Spinner from "components/ui/Spinner/index";
import clientsService from "services/clientsService";
import callRecordingsService from "services/callRecordingsService";

const SearchInput = styled(OutlinedInput)(() => ({
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    borderRadius: "4px",
    "input::placeholder": {
        color: "#434A51",
        fontSize: "16px",
    },
}));

const ContactListItemButton = ({ contact, callFrom, leadId, callLogIdNumber, children }) => {
    const showToast = useToast();
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
            if (callLogIdNumber) {
                await callRecordingsService.assignsLeadToInboundCallRecord({
                    callLogIdNumber,
                    leadId,
                });
                showToast({
                    message: "Contact linked succesfully",
                });
                navigate(`/contact/${leadId}`);
            }
        } catch (error) {
            showToast({
                type: "error",
                message: `${error.message}`,
            });
        }
    }, [navigate, leadId, callLogIdNumber, showToast, contact.phones, updatePrimaryContact]);

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
            <ListItem key={"contactindex" + index} className={styles.contactItem} disablePadding>
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
