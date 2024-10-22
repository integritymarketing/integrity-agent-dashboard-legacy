import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    customButton: {
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

    customFooterContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        borderRadius: "0px 0px 8px 8px",
        backgroundColor: "#F1F1F1",
    },
}));

export default function CustomFooter({ buttonName, onClick, icon }) {
    const classes = useStyles();

    return (
        <Box className={classes.customFooterContainer}>
            <Button
                onClick={onClick}
                endIcon={icon ? <span className={classes.buttonIcon}>{icon}</span> : ""}
                className={classes.customButton}
            >
                {buttonName}
            </Button>
        </Box>
    );
}
