import React, { useState, useCallback } from "react";
import {
  InputAdornment,
  ListItem,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./styles.module.scss";
import useToast from "hooks/useToast";
import callRecordingsService from "services/callRecordingsService";
import Heading3 from "packages/Heading3";
import { styled } from "@mui/system";
import { useParams } from "react-router-dom";

const SearchInput = styled(OutlinedInput)(() => ({
  background: "#FFFFFF 0% 0% no-repeat padding-box",
  borderRadius: "4px",
  "input::placeholder": {
    color: "#434A51",
    fontSize: "16px",
  },
}));

const ContactListItemButton = ({ leadId, callLogId, children }) => {
  const addToast = useToast();
  const history = useHistory();

  const onClickHandler = useCallback(async () => {
    try {
      if (callLogId) {
        await callRecordingsService.assignsLeadToInboundCallRecord({
          callLogId,
          leadId,
        });
        addToast({
          message: "Contact linked succesfully",
        });
        history.push(`/contact/${leadId}`);
      }
    } catch (error) {
      addToast({
        type: "error",
        message: `${error.message}`,
      });
    }
  }, [history, leadId, callLogId, addToast]);

  return (
    <div className={styles.contactName} onClick={onClickHandler}>
      {children}
    </div>
  );
};

export default function ContactSearch({ contacts, onChange }) {
  const { callLogId } = useParams();
  const [searchStr, setSearchStr] = useState("");

  function renderRow(value, index) {
    const fullname = `${value.firstName} ${value.lastName}`;
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
