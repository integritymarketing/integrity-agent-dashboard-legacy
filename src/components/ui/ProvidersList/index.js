import React from "react";
import Box from "@mui/material/Box";
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
    marginBottom: 10,
  },
  addressText: {
    marginLeft: 10,
    color: "#717171",
    fontSize: "14px",
  },
  addressColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "40%",
  },
});

const RenderProviders = ({
  provider,
  handleEditProvider,
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

      <Box className={classes.addressColumn}>
        {provider?.addresses?.map((address) => (
          <Box
            className={classes.addressContainer}
            key={`Provider-address-${address?.id}`}
          >
            {isPlanPage && provider?.inNetwork ? (
              <InNetworkIcon />
            ) : (
              <OutNetworkIcon />
            )}
            <Box className={classes.addressText}>
              {address.streetLine1}, {address.city}, {address.state},
              {address.zipCode}
            </Box>
          </Box>
        ))}
      </Box>

      <Box>
        {!isPlanPage && (
          <IconButton
            label="Edit"
            onClick={() => {
              handleEditProvider(provider);
            }}
            icon={<EditIcon />}
          />
        )}
      </Box>
    </>
  );
};

export default RenderProviders;
