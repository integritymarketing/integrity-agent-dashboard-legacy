import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import PropTypes from "prop-types";

import { formatPhoneNumber } from "utils/phones";

// Styled components using MUI's styled utility
const StyledRoot = styled(Box)(({ theme, compareTable }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: compareTable ? "100%" : "40%",
    [theme.breakpoints.down("sm")]: {
        width: "100%", // Adjust width for small screens
    },
}));

const SpecialtyTypography = styled(Typography)({
    color: "#717171",
    fontSize: "14px",
});

const NameTypography = styled(Typography)({
    color: "#052A63",
    fontSize: "20px",
});

const PhoneTypography = styled(Typography)({
    color: "#4178FF",
    fontSize: "14px",
});

const ProviderPersonalInfo = ({ specialty, title, phone, name, compareTable }) => (
    <StyledRoot compareTable={compareTable}>
        <SpecialtyTypography variant="body1">
            {specialty} {title ? `/ ${title}` : ""}
        </SpecialtyTypography>
        <NameTypography variant="h6">{name}</NameTypography>
        <PhoneTypography variant="body1">{formatPhoneNumber(phone)}</PhoneTypography>
    </StyledRoot>
);

ProviderPersonalInfo.propTypes = {
    specialty: PropTypes.string.isRequired,
    title: PropTypes.string,
    phone: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    compareTable: PropTypes.bool,
};

ProviderPersonalInfo.defaultProps = {
    title: "",
    compareTable: false,
};

export default ProviderPersonalInfo;
