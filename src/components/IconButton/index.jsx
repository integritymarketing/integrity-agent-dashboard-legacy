import React from "react";
import Button from "@mui/material/Button";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  addButton: {
    color: "#4178FF",
    fontSize: "14px",
    fontWeight: "500",
    textTransform: "unset !important",
    padding: "5px 20px !important",
    cursor: "pointer",
    borderRadius: "8px !important",
    "&:hover": {
      backgroundColor: "#FFFFFF 0% 0 % no - repeat padding- box",
      boxShadow: "0px 0px 10px 1px rgba(0, 0, 0, 0.2)",
      color: "#1357FF !important",
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
    <Button
      onClick={onClick}
      className={classes.addButton}
      endIcon={<span className={classes.iconWrapper}>{icon}</span>}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

export default IconButton;