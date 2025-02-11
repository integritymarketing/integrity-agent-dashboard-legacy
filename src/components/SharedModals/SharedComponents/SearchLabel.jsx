import React from "react";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    searchTitle: {
        color: "#052A63",
        fontSize: "20px !important",
        fontFamily: "Lato",
        letterSpacing: "0.2px",
        marginTop: "12px !important",
        marginBottom: "12px !important",
        fontWeight: "bold !important",
    },
}));

export default function SearchLabel({ label }) {
    const classes = useStyles();
    return (
        <>
            <Typography className={classes.searchTitle}>{label}</Typography>
        </>
    );
}
