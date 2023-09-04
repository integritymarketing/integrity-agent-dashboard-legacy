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
  item,
  setProviderEditFlag,
  setProviderToEdit,
  setIsOpen,
  isPlanPage = false,
}) => {
  const classes = useStyles();
  const { firstName, lastName, middleName, specialty, title } = item;

  const providerName = [firstName, middleName, lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <ProviderPersonalInfo
        specialty={specialty}
        title={title}
        name={isPlanPage ? providerName : item?.presentationName}
        phone={
          isPlanPage
            ? getProviderPhone(item?.address)
            : formatPhoneNumber(item?.phone)
        }
      />

      <Box>
        {item?.addresses?.map((address, index) => (
          <Box className={classes.addressContainer}>
            {isPlanPage && item?.inNetwork ? (
              <InNetworkIcon />
            ) : (
              <OutNetworkIcon />
            )}
            <Typography key={index} variant="body2" className={classes.address}>
              {address.streetLine1}, {address.city}, {address.state},{" "}
              {address.zipCode}
            </Typography>
          </Box>
        ))}
      </Box>
      {/*   USE THIS WHILE WE ARE WORKING ON GLOBAL MODALS */}

      <Box>
        {!isPlanPage && (
          <IconButton
            label="Edit"
            onClick={() => {
              setProviderEditFlag(true);
              setProviderToEdit(item);
              setIsOpen(true);
            }}
            icon={<EditIcon />}
          />
        )}
      </Box>
    </>
  );
};

export default RenderProviders;
