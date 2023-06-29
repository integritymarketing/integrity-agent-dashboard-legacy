import React, { useState, useCallback, useEffect } from "react";
import {
  InputAdornment,
  ListItem,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  Typography,
} from "@mui/material";
import * as Sentry from "@sentry/react";
import { useHistory } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./styles.module.scss";
import useToast from "hooks/useToast";
import Heading3 from "packages/Heading3";
import { styled } from "@mui/system";
import { useParams } from "react-router-dom";
import Spinner from "components/ui/Spinner/index";
import clientsService from "services/clientsService";
import enrollPlansService from "services/enrollPlansService";

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
  leadId,
  callLogId,
  children,
  state,
  leadInfo,
  setLeadInfo, // Accessing setLeadInfo here
}) => {
  const addToast = useToast();
  const history = useHistory();
  useEffect(() => {
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
  }, [state, setLeadInfo]);

  const updatePrimaryContact = useCallback(() => {
    return clientsService.updateLeadPhone(contact, callFrom);
  }, [contact, callFrom]);

  const onClickHandler = useCallback(async () => {
    const { policyId, agentNpn, policyStatus, leadId, policyHolder } = state;
    try {
      const reverseArray = contact?.phones?.reverse();
      const updateBusinessBookPayload = {
        agentNpn: agentNpn,
        leadId: leadId,
        policyNumber: policyId,
        consumerFirstName: policyHolder.split(" ")[0],
        consumerLastName: policyHolder.split(" ")[1],
        leadDate: leadInfo?.createDate,
        leadStatus: policyStatus,
      };
      const hasPhone = reverseArray[0]?.leadPhone;
      if (!hasPhone) {
        await updatePrimaryContact();
      }
      const response = await enrollPlansService.updateBookOfBusiness(
        updateBusinessBookPayload
      );
      if (response.leadId) {
        addToast({
          message: "Contact linked succesfully",
        });
        history.push(`/contact/${response.leadId}`);
      }
    } catch (error) {
      addToast({
        type: "error",
        message: `${error.message}`,
      });
    }
  }, [
    history,
    addToast,
    contact.phones,
    updatePrimaryContact,
    state,
    leadInfo,
  ]);

  return (
    <div className={styles.contactName} onClick={onClickHandler}>
      {children}
    </div>
  );
};

export default function ContactSearch({
  contacts,
  onChange,
  isLoading,
  state,
}) {
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
      <ListItem
        key={"contactindex" + index}
        className={styles.contactItem}
        disablePadding
      >
        <ListItemButton
          component={ContactListItemButton}
          leadId={value.leadsId}
          callLogId={callLogId}
          contact={value}
          callFrom={callFrom}
          state={state}
          leadInfo={leadInfo}
          setLeadInfo={setLeadInfo} // Passing setLeadInfo as a prop here
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
            <SearchIcon
              style={{ color: "#0052CE" }}
              aria-label="search"
              edge="end"
            ></SearchIcon>
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
            {searchStr &&
            searchStr.length > 0 &&
            contacts &&
            contacts.length >= 0
              ? "No records found"
              : "Search for a contact"}
          </div>
        )}
      </div>
    </div>
  );
}
