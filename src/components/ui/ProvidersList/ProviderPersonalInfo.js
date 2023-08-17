import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { formatPhoneNumber } from "utils/phones";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles({
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
});

const ProviderPersonalInfo = ({ specialty, title, phone, name }) => {
  const classes = useStyles();

  return (
    <>
      <Box>
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
