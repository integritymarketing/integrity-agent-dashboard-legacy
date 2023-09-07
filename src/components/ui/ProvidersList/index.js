import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditIcon from "components/icons/icon-edit";
import { formatPhoneNumber } from "utils/phones";
import makeStyles from "@mui/styles/makeStyles";
import IconButton from "components/IconButton";
import ProviderPersonalInfo from "./ProviderPersonalInfo";
import { getProviderPhone } from "utils/primaryContact";
import InNetworkIcon from "components/icons/inNetwork";
import OutNetworkIcon from "components/icons/outNetwork";

const useStyles = makeStyles({
  addressContainer: {
    display: "flex",
    alignItems: "center",
  },
  address: {
    color: "#717171",
    fontSize: "14px",
  },
});

const RenderProviders = ({
  provider,
  setProviderEditFlag,
  setProviderToEdit,
  setIsOpen,
  isPlanPage = false,
}) => {
  const classes = useStyles();
  const { firstName, lastName, middleName, specialty, title } = provider || {};

  const providerName = [firstName, middleName, lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <ProviderPersonalInfo
        specialty={specialty}
        title={title}
        name={isPlanPage ? providerName : provider?.presentationName}
        phone={
          isPlanPage
            ? getProviderPhone(provider?.address)
            : formatPhoneNumber(provider?.phone)
        }
      />

      <Box>
        {provider?.addresses?.map((address, index) => (
          <Box className={classes.addressContainer}>
            {isPlanPage && provider?.inNetwork ? (
              <InNetworkIcon />
            ) : (
              <OutNetworkIcon />
            )}
            <Typography key={index} variant="body2" className={classes.address}>
              {address.streetLine1}, {address.city}, {address.state},
              {address.zipCode}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box>
        <IconButton
          label="Edit"
          onClick={() => {
            setProviderEditFlag(true);
            setProviderToEdit(provider);
            setIsOpen(true);
          }}
          icon={<EditIcon />}
        />
      </Box>
    </>
  );
};

export default RenderProviders;
