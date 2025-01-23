import React, { useState } from "react";
import Arrow from "components/icons/down";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import makeStyles from "@mui/styles/makeStyles";
import Box from "@mui/material/Box";
import InNetworkIcon from "components/icons/inNetwork";
import OutNetworkIcon from "components/icons/outNetwork";
import Modal from "components/Modal";
import CustomFooter from "components/Modal/CustomFooter";
import Plus from "components/icons/plus";
import EditIcon from "components/icons/icon-edit";

import IconButton from "components/IconButton";

import "./styles.module.scss";

const useStyles = makeStyles({
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
    title: {
        color: "#717171",
        fontSize: "14px",
        letterSpacing: "-0.14px",
        fontFamily: "Lato",
    },
    name: {
        color: "#052A63",
        fontSize: "20px",
        letterSpacing: "0.2px",
        fontFamily: "Lato",
    },
    specialty: {
        color: "#4178FF",
        fontSize: "14px",
        fontWeight: "600",
        letterSpacing: "-0.14px",
        fontFamily: "Lato",
        marginTop: "8px",
    },
    additional: {
        color: "#4178FF",
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
    providerInfo: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    network: {
        marginRight: 10,
    },
    planName: {
        color: "#052A63",
        fontSize: 24,
        fontFamily: "Lato",
        letterSpacing: "0.24px",
        marginTop: 30,
    },
    subText: {
        color: "#434A51",
        fontSize: 16,
        fontFamily: "Lato",
        letterSpacing: -0.16,
        marginTop: 30,
    },
});

const Address = ({ addresses, isChecked, inNetwork }) => {
    const classes = useStyles();
    const isMultiple = addresses?.length > 1;

    return (
        <List>
            {addresses?.map((address) => {
                return (
                    <ListItemButton
                        key={address?.id}
                        className={`${classes.listItem}, ${isMultiple ? classes.isMultiple : classes.isSingle}`}
                        selected={isChecked}
                    >
                        <Box className={classes.network}>
                            {inNetwork || address?.inNetwork ? <InNetworkIcon /> : <OutNetworkIcon />}
                        </Box>
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

const ProviderCoverageModal = ({ providers, open, onClose, addNew, planName, onEditProvider }) => {
    const classes = useStyles();

    const [isOpen, setOpenToggle] = useState(true);

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={"Provider Coverage"}
            customFooter={<CustomFooter buttonName={"Add Provider"} onClick={addNew} icon={<Plus />} />}
            hideFooter={true}
        >
            <>
                <Typography className={classes.planName}>{planName}</Typography>
                <Typography className={classes.subText}>
                    Additional Providers locations may be covered. Please review available locations for coverage.
                </Typography>
                <div className={classes.list}>
                    {providers?.map((provider, index) => {
                        const { NPI, presentationName, specialty, addresses, inNetworkAddressList } = provider;

                        return (
                            <div
                                className={providers?.length > 1 ? classes.multipleCard : classes.singleCard}
                                key={`ProviderList-${index}`}
                            >
                                <Box className={classes.providerInfo}>
                                    <Box>
                                        <Typography className={classes.title}>{specialty}</Typography>
                                        <Typography className={classes.name}>{presentationName}</Typography>
                                        <Typography className={classes.specialty}>{NPI}</Typography>
                                    </Box>
                                    {onEditProvider && (
                                        <Box className={classes.editIcon}>
                                            <IconButton
                                                label="Edit"
                                                onClick={() => onEditProvider(provider)}
                                                icon={<EditIcon />}
                                            ></IconButton>
                                        </Box>
                                    )}
                                </Box>
                                <Address addresses={addresses} isChecked={true} />

                                {inNetworkAddressList?.length > 0 && (
                                    <>
                                        <Box className={classes.multipleAddresses}>
                                            <Typography
                                                className={isOpen ? classes.reverse : classes.icon}
                                                onClick={() => setOpenToggle(!isOpen)}
                                            >
                                                <Arrow color="#0052CE" />
                                            </Typography>
                                            <Typography className={classes.additional}>
                                                In-network Locations ({inNetworkAddressList?.length})
                                            </Typography>
                                        </Box>
                                        {isOpen && (
                                            <Address
                                                addresses={inNetworkAddressList}
                                                isChecked={false}
                                                inNetwork={true}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </>
        </Modal>
    );
};

export default ProviderCoverageModal;
