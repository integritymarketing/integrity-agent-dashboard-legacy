import React from "react";
import { styled } from '@mui/material/styles';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
const PREFIX = 'CustomFooter';

const classes = {
  customButton: `${PREFIX}-customButton`,
  customFooterContainer: `${PREFIX}-customFooterContainer`
};

const StyledBox = styled(Box)((
  {
    theme
  }
) => ({
  [`& .${classes.customButton}`]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#4178FF",
    fontSize: "16px",
    fontWeight: "600",
    height: "40px",
    textTransform: "unset",
    padding: "10px 15px",
    "&:hover": {
      backgroundColor: "#FFFFFF",
      borderRadius: "20px",
      boxShadow: "inset 0px -1px 0px #CCCCCC",
    },
  },

  [`&.${classes.customFooterContainer}`]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#F1F1F1",
    width: "90%",
  }
}));

export default function CustomFooter({ buttonName, onClick, icon }) {


  return (
    <StyledBox className={classes.customFooterContainer}>
      <Button
        onClick={onClick}
        endIcon={icon ? <span className={classes.buttonIcon}>{icon}</span> : ""}
        className={classes.customButton}
      >
        {buttonName}
      </Button>
    </StyledBox>
  );
}
