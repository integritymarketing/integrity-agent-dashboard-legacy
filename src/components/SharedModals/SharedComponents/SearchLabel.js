import React from "react";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  searchTitle: {
    color: "#052A63",
    fontSize: 20,
    fontFamily: "Lato",
    letterSpacing: "0.2px",
    marginTop: 12,
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
