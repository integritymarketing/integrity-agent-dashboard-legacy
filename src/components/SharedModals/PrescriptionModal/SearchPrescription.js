import React from "react";
import PropTypes from "prop-types";
import {
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";

import SearchIcon from "../Icons/SearchIcon";

const useStyles = makeStyles((theme) => ({
  searchTitle: {
    color: "#052A63",
    fontSize: 20,
    fontFamily: "Lato",
    letterSpacing: "0.2px",
    marginTop: 12,
  },
  searchField: {
    backgroundColor: "#FFFFFF",
    border: "1px solid var(--gray-lt-dddddd)",
    borderRadius: 4,
    width: "100%",
  },
  prescriptionText: {
    color: "#717171",
    fontSize: 14,
    fontFamily: "Lato, Italic",
    letterSpacing: "0.14px",
  },
}));

export default function SearchPrescription({
  searchString,
  handleSearch,
  prescriptionList,
}) {
  const classes = useStyles();

  const title = "Search for a Prescription";
  const prescriptionCountText = `${prescriptionList?.length} Prescriptions found`;

  return (
    <>
      <Typography className={classes.searchTitle}>{title}</Typography>
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

      <Typography className={classes.prescriptionText}>
        {prescriptionCountText}
      </Typography>
    </>
  );
}

SearchPrescription.propTypes = {
  searchString: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
  prescriptionList: PropTypes.array.isRequired,
};

SearchPrescription.defaultProps = {
  searchString: "",
  handleSearch: () => {},
  prescriptionList: [],
};
