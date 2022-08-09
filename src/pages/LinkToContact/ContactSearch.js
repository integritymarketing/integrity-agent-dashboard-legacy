import React, {useState} from "react";
import {
  InputAdornment,
  ListItem,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FixedSizeList } from "react-window";
import styles from "./styles.module.scss";
import { Link } from "react-router-dom";

export default function ContactSearch({ contacts, onChange }) {
    const [searchStr, setSearchStr] = useState('');

  function renderRow({ index }) {
    const fullname = `${contacts[index].firstName} ${contacts[index].lastName}`;
    return (
      <ListItem
        key={index}
        className={styles.contactItem}
        component="div"
        disablePadding
      >
        <ListItemButton
          component={Link}
          to={`/contact/${contacts[index].leadsId}`}
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
      <Typography variant="h6" sx={{ mx: 1 }}>
        Add to Existing Contact
      </Typography>
      <OutlinedInput
        size="small"
        fullWidth
        placeholder={"Start by typing a contact’s name"}
        type="search"
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon aria-label="search" edge="end"></SearchIcon>
          </InputAdornment>
        }
        onChange={(e) => {
          setSearchStr(e.target.value);
          onChange(e.target.value);
        }}
      />
      <div className={styles.contactsListContainer}>
        {contacts && contacts.length > 0 && searchStr.length > 0 ? (
          <FixedSizeList
            height={0}
            width={327}
            itemSize={46}
            itemCount={contacts.length}
            overscanCount={5}
            style={{ minHeight: 175, backgroundColor: "#EAEEF0" }}
          >
            {renderRow}
          </FixedSizeList>
        )
         : (<div className={styles.emptyList}> {searchStr && searchStr.length > 0 && (contacts && contacts.length >= 0) ? 'No records found' : 'Search for a contact' }</div>
         )}
      </div>
    </div>
  );
}
