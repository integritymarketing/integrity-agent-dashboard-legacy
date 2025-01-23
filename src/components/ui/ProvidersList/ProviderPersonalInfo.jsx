import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { formatPhoneNumber } from "utils/phones";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles({
    infoColumn: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "45% !important",
        "@media (max-width: 768px)": {
            width: "100% !important",
        },
    },
    specialty: {
        color: "#717171",
        fontSize: "14px",
    },
    name: {
        color: "#052A63",
        fontSize: "20px",
    },
    phone: {
        color: "#4178FF",
        fontSize: "14px",
    },
    compareTable: {
        width: "100% !important",
    },
});

const ProviderPersonalInfo = ({ specialty, title, phone, name, compareTable }) => {
    const classes = useStyles();

    return (
        <>
            <Box className={`${classes.infoColumn} ${compareTable ? classes.compareTable : ""}`}>
                <Typography variant="body1" className={classes.specialty}>
                    {specialty} {title ? `/ ${title}` : ""}
                </Typography>
                <Typography variant="h6" className={classes.name}>
                    {name}
                </Typography>
                <Typography variant="body1" className={classes.phone}>
                    {formatPhoneNumber(phone)}
                </Typography>
            </Box>
        </>
    );
};

export default ProviderPersonalInfo;