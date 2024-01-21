import React, { useState } from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import PropTypes from "prop-types";

import { formatPhoneNumber } from "utils/phones";

import IconButton from "components/IconButton";
import Arrow from "components/icons/down";
import EditIcon from "components/icons/icon-edit";
import InNetworkIcon from "components/icons/inNetwork";
import OutNetworkIcon from "components/icons/outNetwork";

import ProviderPersonalInfo from "./ProviderPersonalInfo";

// Styled components using MUI's styled utility
const AddressContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
    backgroundColor: "#F1FAFF",
}));

const AddressText = styled(Typography)(({ theme, compareTable }) => ({
    marginLeft: compareTable ? 0 : 10,
    color: "#717171",
    fontSize: "14px",
    width: "100%",
}));

const ListItemStyled = styled(ListItemButton)(({ theme, isMultiple }) => ({
    backgroundColor: "#dddddd",
    "&.Mui-selected, &.Mui-selected:hover": {
        backgroundColor: "#f1faff",
    },
    padding: "unset",
    ...(isMultiple && {
        boxShadow: "inset 0px -1px 0px #CCCCCC",
        "&:first-child": {
            borderRadius: "4px 4px 0px 0px",
        },
        "&:last-child": {
            borderRadius: "0px 0px 4px 4px",
        },
    }),
    ...(!isMultiple && {
        borderRadius: "4px",
    }),
}));

const AdditionalLocationsTypography = styled(Typography)({
    color: "#4178FF",
    fontSize: "16px",
    fontWeight: "600",
    letterSpacing: "-0.16px",
    fontFamily: "Lato",
});

const Address = ({ addresses, isPlanPage }) => (
    <List>
        {addresses?.map((address, index) => (
            <ListItemStyled key={address?.id || index} isMultiple={addresses.length > 1} selected>
                {isPlanPage && <Box>{address?.inNetwork ? <InNetworkIcon /> : <OutNetworkIcon />}</Box>}
                <Box>
                    <AddressText>
                        {address?.streetLine1}, {address?.city}, {address?.state}, {address?.zipCode}
                    </AddressText>
                </Box>
            </ListItemStyled>
        ))}
    </List>
);

Address.propTypes = {
    addresses: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            streetLine1: PropTypes.string,
            city: PropTypes.string,
            state: PropTypes.string,
            zipCode: PropTypes.string,
            inNetwork: PropTypes.bool,
        })
    ).isRequired,
    isPlanPage: PropTypes.bool.isRequired,
};

const MobileAddress = ({ addresses, isPlanPage }) => {
    const [isOpen, setOpenToggle] = useState(false);

    const handleToggle = () => setOpenToggle(!isOpen);

    return (
        <Box>
            <Address addresses={addresses.slice(0, 1)} isPlanPage={isPlanPage} />
            {addresses.length > 1 && (
                <>
                    <Box onClick={handleToggle}>
                        <AdditionalLocationsTypography>
                            Additional Locations ({addresses.length - 1})
                        </AdditionalLocationsTypography>
                        <Arrow color="#0052CE" />
                    </Box>
                    {isOpen && <Address addresses={addresses.slice(1)} isPlanPage={isPlanPage} />}
                </>
            )}
        </Box>
    );
};

MobileAddress.propTypes = {
    addresses: PropTypes.array.isRequired,
    isPlanPage: PropTypes.bool.isRequired,
};

const WebAddress = ({ addresses, isPlanPage, compareTable }) => (
    <Box>
        {addresses?.map((address, index) => (
            <AddressContainer key={address?.id || index}>
                {isPlanPage && <Box>{address?.inNetwork ? <InNetworkIcon /> : <OutNetworkIcon />}</Box>}
                <AddressText compareTable={compareTable}>
                    {address?.streetLine1}, {address?.city}, {address?.state}, {address?.zipCode}
                </AddressText>
            </AddressContainer>
        ))}
    </Box>
);

WebAddress.propTypes = {
    addresses: PropTypes.array.isRequired,
    isPlanPage: PropTypes.bool.isRequired,
    compareTable: PropTypes.bool,
};

const RenderProviders = ({ provider, handleEditProvider, isPlanPage = false, isMobile, compareTable }) => {
    const providerName = [provider?.firstName, provider?.middleName, provider?.lastName].filter(Boolean).join(" ");

    return (
        <>
            <ProviderPersonalInfo
                specialty={provider?.specialty}
                title={provider?.title}
                name={isPlanPage ? providerName : provider?.presentationName}
                phone={formatPhoneNumber(provider?.phone)}
                compareTable={compareTable}
            />
            {isMobile ? (
                <MobileAddress addresses={provider?.addresses} isPlanPage={isPlanPage} />
            ) : (
                <WebAddress addresses={provider?.addresses} isPlanPage={isPlanPage} compareTable={compareTable} />
            )}
            {handleEditProvider && (
                <Box>
                    <IconButton label="Edit" onClick={() => handleEditProvider(provider)} icon={<EditIcon />} />
                </Box>
            )}
        </>
    );
};

RenderProviders.propTypes = {
    provider: PropTypes.shape({
        firstName: PropTypes.string,
        middleName: PropTypes.string,
        lastName: PropTypes.string,
        specialty: PropTypes.string,
        title: PropTypes.string,
        presentationName: PropTypes.string,
        phone: PropTypes.string,
        addresses: PropTypes.array,
    }).isRequired,
    handleEditProvider: PropTypes.func,
    isPlanPage: PropTypes.bool,
    isMobile: PropTypes.bool,
    compareTable: PropTypes.bool,
};

export default RenderProviders;
