import React from "react";
import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { formatPhoneNumber } from "utils/phones";
const PREFIX = 'ProviderPersonalInfo';

const classes = {
    infoColumn: `${PREFIX}-infoColumn`,
    specialty: `${PREFIX}-specialty`,
    name: `${PREFIX}-name`,
    phone: `${PREFIX}-phone`,
    compareTable: `${PREFIX}-compareTable`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')({
    [`& .${classes.infoColumn}`]: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "40% !important",
        "@media (max-width: 768px)": {
            width: "100% !important",
        },
    },
    [`& .${classes.specialty}`]: {
        color: "#717171",
        fontSize: "14px",
    },
    [`& .${classes.name}`]: {
        color: "#052A63",
        fontSize: "20px",
    },
    [`& .${classes.phone}`]: {
        color: "#4178FF",
        fontSize: "14px",
    },
    [`& .${classes.compareTable}`]: {
        width: "100% !important",
    },
});

const ProviderPersonalInfo = ({ specialty, title, phone, name, compareTable }) => {


    return (
        (<Root>
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
        </Root>)
    );
};

export default ProviderPersonalInfo;
