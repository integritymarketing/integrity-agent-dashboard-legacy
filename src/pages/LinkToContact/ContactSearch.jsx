import React, {useCallback, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";

import {InputAdornment, ListItem, ListItemButton, ListItemText, OutlinedInput, Typography, Box} from "@mui/material";
import {DropdownAContact} from "@integritymarketing/icons";

import {styled} from "@mui/system";

import useToast from "hooks/useToast";
import useAnalytics from "hooks/useAnalytics";

import Spinner from "components/ui/Spinner/index";

import {useClientServiceContext} from "services/clientServiceProvider";

import styles from "./styles.module.scss";

const SearchInput = styled(OutlinedInput)(() => ({
    background: "#FFFFFF 0 0 no-repeat padding-box",
    borderRadius: "4px",
    "input::placeholder": {
        color: "#717171",
        fontSize: "16px",
    },
}));

const ContactListItemButton = ({contact, callFrom, leadId, callLogId, children, tagIds, inbound, name}) => {
    const showToast = useToast();
    const {fireEvent} = useAnalytics();
    const navigate = useNavigate();

    const {clientsService, callRecordingsService} = useClientServiceContext();
    const updatePrimaryContact = useCallback(() => {
        return clientsService.updateLeadPhone(contact, callFrom);
    }, [clientsService, contact, callFrom]);

    const onClickHandler = useCallback(async () => {
        try {
            const reverseArray = contact?.phones?.reverse();
            const hasPhone = reverseArray[0]?.leadPhone;
            if (!hasPhone) {
                await updatePrimaryContact();
            }
            if (callLogId) {
                if (name === "Text") {
                    await callRecordingsService.assignsLeadToOutboundSmsRecord({
                        smsLogId: callLogId,
                        leadId,
                        tagIds: tagIds || [],
                    });
                } else {
                    await callRecordingsService.assignsLeadToInboundCallRecord({
                        callLogId,
                        leadId,
                        tagIds: tagIds || [],
                        isInbound: inbound,
                    });
                }
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
    }, [
        contact?.phones,
        callLogId,
        updatePrimaryContact,
        callRecordingsService,
        leadId,
        tagIds,
        showToast,
        fireEvent,
        navigate,
    ]);

    return (
        <div className={styles.contactName} onClick={onClickHandler}>
            {children}
        </div>
    );
};

export default function ContactSearch({contacts, onChange, isLoading, tagIds, inbound, name}) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const callLogId = queryParams.get("id");
    const callFrom = queryParams.get("phoneNumber");

    const [searchStr, setSearchStr] = useState("");
    const callLogIdNumber = Number(callLogId);

    function renderRow(value, index) {
        const fullname = `${value.firstName} ${value.lastName}`;
        if (isLoading) {
            return (
                <div>
                    <Spinner/>
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
                    tagIds={tagIds}
                    inbound={inbound}
                    name={name}
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
            <Box marginBottom="8px">
                <Typography variant="h4" color="#052a63">
                    Add to Existing Contact
                </Typography>
            </Box>
            <SearchInput
                size="small"
                fullWidth
                placeholder={"Search for a contact"}
                type="search"
                startAdornment={
                    <InputAdornment position="end">
                        <DropdownAContact color="#4178FF" size="md"/>
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
                        <Typography variant="body2" color="#434A51">
                            {searchStr && searchStr.length > 0 && contacts && contacts.length >= 0
                                ? "No records found"
                                : "Search for a contact"}
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
}
