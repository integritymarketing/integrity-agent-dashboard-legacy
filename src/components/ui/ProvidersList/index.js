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
    "@media (max-width: 768px)": {
      width: "100%",
    },
  },
  editbtn: {
    "@media (max-width: 768px)": {
      position: "absolute",
      top: "12px",
      right: "15px",
    },
  },
  highlightBox: {
    "@media (max-width: 768px)": {
      background: "#F1FAFF",
      width: "100%",
      padding: "9px 16px",
      borderRadius: "4px",
    },
  },
  selectedText: {
    display: "none",
    "@media (max-width: 768px)": {
      marginTop: "15px",
      marginBottom: "5px",
      color: "#717171",
      fontSize: "14px",
      fontStyle: "italics",
    },
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
        {provider?.addresses?.map((address, index) => {
          return (
            <>
              {index === 0 && (
                <div className={classes.selectedText}>Selected Location</div>
              )}
              <Box
                className={`${classes.addressContainer} ${
                  index === 0 ? classes.highlightBox : ""
                }`}
                key={`Provider-address-${address?.id}`}
              >
                {isPlanPage && (
                  <>
                    {address?.inNetwork ? (
                      <InNetworkIcon />
                    ) : (
                      <OutNetworkIcon />
                    )}
                  </>
                )}
                <Box className={classes.addressText}>
                  {address.streetLine1}, {address.city}, {address.state},
                  {address.zipCode}
                </Box>
              </Box>
            </>
          );
        })}
      </Box>

      <Box className={classes.editbtn}>
        <IconButton
          label="Edit"
          onClick={() => {
            handleEditProvider(provider);
          }}
          icon={<EditIcon />}
        />
      </Box>
    </>
  );
};

export default RenderProviders;
