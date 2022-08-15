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
import styles from "./styles.module.scss";
import { Link } from "react-router-dom";

export default function ContactSearch({ contacts, onChange }) {
  const [searchStr, setSearchStr] = useState('');

  function renderRow(value, index) {
    const fullname = `${value.firstName} ${value.lastName}`;
    return (
      <ListItem
        key={'contactindex' + index}
        className={styles.contactItem}
        component="div"
        disablePadding
      >
        <ListItemButton
          component={Link}
          to={`/contact/${value.leadsId}`}
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
            contacts.map((value, index)=>{return renderRow(value, index)})
        )
         : (<div className={styles.emptyList}> {searchStr && searchStr.length > 0 && (contacts && contacts.length >= 0) ? 'No records found' : 'Search for a contact' }</div>
         )}
      </div>
    </div>
  );
}
