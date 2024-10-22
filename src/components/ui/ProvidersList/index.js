import React, { useState } from "react";
import Box from "@mui/material/Box";
import EditIcon from "components/icons/icon-edit";
import { formatPhoneNumber } from "utils/phones";
import makeStyles from "@mui/styles/makeStyles";
import { Button } from "components/ui/Button";
import ProviderPersonalInfo from "./ProviderPersonalInfo";
import InNetworkIcon from "components/icons/inNetwork";
import OutNetworkIcon from "components/icons/outNetwork";

import Arrow from "components/icons/down";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import styles from "./providerList.module.scss";

const useWebStyles = makeStyles({
    addressContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: 10,
        width: "100%",
        backgroundColor: "#F1FAFF",
    },
    addressText: {
        marginLeft: 10,
        color: "#717171",
        fontSize: "14px",
        width: "100%",
    },
    addressColumn: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "33%",
    },
    editbtn: {
        "@media (max-width: 768px)": {
            position: "absolute",
            right: "32px",
        },
    },
    editbtn2: {
        "@media (max-width: 768px)": {
            position: "absolute",
            top: "12px",
            right: "0",
        },
    },
    compareTable: {
        width: "100% !important",
        marginTop: "16px",
    },
    addressTextNew: {
        marginLeft: 0,
    },
});

const useMobileStyles = makeStyles({
    list: {
        marginTop: "16px",
        marginBottom: "16px",
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
    },
    singleCard: {
        padding: "16px",
        borderRadius: "8px",
    },
    multipleCard: {
        padding: "16px",
        boxShadow: "inset 0px -1px 0px #CCCCCC",
        "&:first-child": {
            borderRadius: "8px 8px 0px 0px",
        },
        "&:last-child": {
            borderRadius: "0px 0px 8px 8px",
        },
    },

    additional: {
        color: "#717171",
        fontSize: "16px",
        fontWeight: "600",
        letterSpacing: "-0.16px",
        fontFamily: "Lato",
    },
    listItem: {
        backgroundColor: "#dddddd !important",

        "&.Mui-selected, &.Mui-selected:hover": {
            backgroundColor: "#f1faff !important",
        },
        padding: "unset !important",
    },
    isAdditionalGrey: {
        backgroundColor: "rgba(0, 0, 0, 0.15) !important",
    },
    addressText: {
        color: "#434A51",
        fontSize: 16,
    },
    reverse: {
        transform: "rotate(360deg)",
        cursor: "pointer",
        marginRight: "10px",
    },
    icon: {
        cursor: "pointer",
        marginRight: "10px",
        transform: "rotate(270deg)",
    },
    multipleAddresses: {
        display: "flex",
        alignItems: "center",
    },

    isMultiple: {
        boxShadow: "inset 0px -1px 0px #CCCCCC",
        "&:first-child": {
            borderRadius: "4px 4px 0px 0px",
        },
        "&:last-child": {
            borderRadius: "0px 0px 4px 4px",
        },
        isSingle: {
            borderRadius: "4px",
        },
    },

    network: {
        marginRight: 10,
    },
    addressList: {
        width: "100%",
    },
});

const Address = ({ addresses, isPlanPage, isAdditional }) => {
    const classes = useMobileStyles();
    const isMultiple = addresses?.length > 1;

    return (
        <List>
            {addresses?.map((address) => {
                return (
                    <ListItemButton
                        key={address?.id}
                        className={`${classes.listItem}, ${isMultiple ? classes.isMultiple : classes.isSingle} ${
                            isAdditional ? classes.isAdditionalGrey : ""
                        }`}
                        selected={true}
                    >
                        {isPlanPage && (
                            <Box className={classes.network}>
                                {address?.inNetwork ? <InNetworkIcon /> : <OutNetworkIcon />}
                            </Box>
                        )}
                        <Box>
                            <Typography className={classes.addressText}>
                                <div>
                                    <div>
                                        {address
                                            ? [address?.streetLine1, address?.streetLine2].filter(Boolean).join(",")
                                            : null}
                                    </div>
                                    <div>
                                        {address
                                            ? [address?.city, address?.state, address?.zipCode]
                                                  .filter(Boolean)
                                                  .join(",")
                                            : null}
                                    </div>
                                </div>
                            </Typography>
                        </Box>
                    </ListItemButton>
                );
            })}
        </List>
    );
};

const MobileAddress = ({ addresses, isPlanPage }) => {
    const classes = useMobileStyles();
    const [isOpen, setOpenToggle] = useState(false);

    const initialAddresses = addresses?.length > 1 ? addresses?.slice(0, 1) : addresses;

    const additionalAddresses = addresses?.length > 1 ? addresses?.slice(1) : null;
    return (
        <Box className={classes.addressList}>
            <Address addresses={initialAddresses} isPlanPage={isPlanPage} />

            {additionalAddresses?.length > 0 && (
                <>
                    <Box className={classes.multipleAddresses}>
                        <Typography
                            className={isOpen ? classes.reverse : classes.icon}
                            onClick={() => setOpenToggle(!isOpen)}
                        >
                            <Arrow color="#0052CE" width={"12"} />
                        </Typography>
                        <Typography className={classes.additional}>
                            Additional Locations ({additionalAddresses?.length})
                        </Typography>
                    </Box>
                    {isOpen && <Address addresses={additionalAddresses} isPlanPage={isPlanPage} isAdditional={true} />}
                </>
            )}
        </Box>
    );
};

const WebAddress = ({ addresses, isPlanPage, compareTable }) => {
    const classes = useWebStyles();
    return (
        <Box className={`${classes.addressColumn} ${compareTable ? classes.compareTable : ""}`}>
            {addresses?.map((address) => {
                return (
                    <>
                        <Box className={classes.addressContainer} key={`Provider-address-${address?.id}`}>
                            {isPlanPage && <>{address?.inNetwork ? <InNetworkIcon /> : <OutNetworkIcon />}</>}
                            <Box className={`${classes.addressText} ${compareTable ? classes.addressTextNew : ""}`}>
                                {address?.streetLine1}, {address?.city}, {address?.state},{address?.zipCode}
                            </Box>
                        </Box>
                    </>
                );
            })}
        </Box>
    );
};

const RenderProviders = ({ provider, handleEditProvider, isPlanPage = false, isMobile, compareTable }) => {
    const classes = useWebStyles();
    const { firstName, lastName, middleName, specialty, title } = provider || {};

    const providerName = [firstName, middleName, lastName].filter(Boolean).join(" ");

    return (
        <>
            <ProviderPersonalInfo
                specialty={specialty}
                title={title}
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
                <Box className={isPlanPage ? classes.editbtn : classes.editbtn2}>
                    <Button
                        icon={<EditIcon />}
                        label={"Edit"}
                        className={styles.editButton}
                        onClick={() => {
                            handleEditProvider(provider);
                        }}
                        type="tertiary"
                        iconPosition="right"
                    />
                </Box>
            )}
        </>
    );
};

export default RenderProviders;
