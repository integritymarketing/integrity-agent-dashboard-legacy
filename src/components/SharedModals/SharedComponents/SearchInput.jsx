import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@mui/styles/makeStyles";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";

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
    countText: {
        color: "#717171",
        fontSize: 14,
        fontFamily: "Lato, Italic",
        letterSpacing: "0.14px",
    },
}));

export default function SearchPrescription({ searchString, handleSearch, label, total }) {
    const classes = useStyles();

    const countText = searchString ? `${total} ${label} found` : "";

    return (
        <>
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
        </>
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
