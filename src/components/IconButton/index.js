import React from "react";
import Button from "@mui/material/Button";
import makeStyles from "@mui/styles/makeStyles";
import Box from "@mui/material/Box";

const useStyles = makeStyles((theme) => ({
  addButton: {
    color: "#4178FF",
    fontSize: "14px",
    fontWeight: "600",
    height: "40px",
    textTransform: "unset",
    padding: "6px 15px",
    "&:hover": {
      borderRadius: "20px",
      boxShadow: "0px 0px 0px 1px #CCCCCC",
      backgroundColor: "#FFFFFF",
    },
    "&.Mui-disabled": {
      color: "#4178FF",
      cursor: "not-allowed",
      "& svg #Icon_Arrow_path": {
        // targeting the svg path by id
        fill: "transparent", // changing the fill color
      },
      "& svg #Icon_circle_path": {
        // targeting the svg path by id
        fill: "#FFFFFF", // changing the fill color
      },
      "& svg #Icon_Add_path": {
        // targeting the svg path by id
        fill: "transparent", // changing the fill color
      },
    },
  },
  iconWrapper: {
    marginBottom: "2px",
  },
}));

const IconButton = ({ label, onClick, disabled, icon }) => {
  const classes = useStyles();

  return (
    <Box>
      <Button
        onClick={onClick}
        className={classes.addButton}
        endIcon={<span className={classes.iconWrapper}>{icon}</span>}
        disabled={disabled}
      >
        {label}
      </Button>
    </Box>
  );
};

export default IconButton;
