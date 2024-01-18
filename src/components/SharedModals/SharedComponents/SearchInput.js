import React from "react";
import { styled } from '@mui/material/styles';
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";

import SearchIcon from "../Icons/SearchIcon";

const PREFIX = 'SearchInput';

const classes = {
  searchTitle: `${PREFIX}-searchTitle`,
  searchField: `${PREFIX}-searchField`,
  countText: `${PREFIX}-countText`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.searchTitle}`]: {
    color: "#052A63",
    fontSize: 20,
    fontFamily: "Lato",
    letterSpacing: "0.2px",
    marginTop: 12,
  },

  [`& .${classes.searchField}`]: {
    backgroundColor: "#FFFFFF",
    border: "1px solid var(--gray-lt-dddddd)",
    borderRadius: 4,
    width: "100%",
  },

  [`& .${classes.countText}`]: {
    color: "#717171",
    fontSize: 14,
    fontFamily: "Lato, Italic",
    letterSpacing: "0.14px",
  }
}));

export default function SearchPrescription({
  searchString,
  handleSearch,
  label,
  total,
}) {


  const countText = `${total} ${label} found`;

  return (
    (<Root>
      <TextField
        margin="dense"
        id="prescription"
        type="text"
        fullWidth
        variant="outlined"
        placeholder="Search"
        value={searchString}
        onChange={handleSearch}
        className={classes.searchField}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Typography className={classes.countText}>{countText}</Typography>
    </Root>)
  );
}

SearchPrescription.propTypes = {
  searchString: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

SearchPrescription.defaultProps = {
  searchString: "",
  handleSearch: () => {},
  list: [],
};
