import React, { useState } from "react";
import Arrow from "components/icons/down";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Checkbox from "@mui/material/Checkbox";
import makeStyles from "@mui/styles/makeStyles";
import Box from "@mui/material/Box";
import { sortAddressesBySelectedIds } from "utils/address";

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
        "&.Mui-selected, &.Mui-selected:hover, &:hover": {
            backgroundColor: "#f1faff !important",
        },
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
    checkbox: {
        color: "#434A51",
        "&.Mui-checked": {
            color: "#4178FF",
        },
    },
    isSingle: {
        borderRadius: "4px",
        boxShadow: "unset",
    },
    isMultiple: {
        boxShadow: "inset 0px -1px 0px #CCCCCC",
        "&:first-child": {
            borderRadius: "4px 4px 0px 0px",
        },
        "&:last-child": {
            borderRadius: "0px 0px 4px 4px",
            boxShadow: "unset",
        },
    },
});

const Address = ({
    addresses,
    provider,
    setSelectedProvider,
    setSelectAddressIds,
    selectAddressIds,
    selectedProvider,
    disableAddressSelect,
}) => {
    const classes = useStyles();
    const isMultiple = addresses?.length > 1;

    const handleSelectAddress = (address) => {
        const isAddressExist = selectAddressIds?.includes(address?.id);

        if (selectAddressIds?.length > 0 && selectedProvider?.NPI?.toString() === provider?.NPI?.toString()) {
            if (isAddressExist) {
                setSelectAddressIds(selectAddressIds.filter((addressId) => addressId !== address?.id));
            } else {
                setSelectAddressIds([...selectAddressIds, address?.id]);
            }
        } else {
            setSelectAddressIds([address?.id]);
            setSelectedProvider(provider);
        }
    };

    const disableOtherAddresses = (id) => {
        if (disableAddressSelect && !selectAddressIds?.includes(id)) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <List>
            {addresses?.map((address) => {
                const isChecked =
                    selectAddressIds?.includes(address?.id) &&
                    selectedProvider?.NPI?.toString() === provider?.NPI?.toString();

                return (
                    <ListItemButton
                        key={address?.id}
                        className={`${classes.listItem} ${isMultiple ? classes.isMultiple : classes.isSingle}`}
                        selected={isChecked}
                        disabled={disableOtherAddresses(address?.id)}
                    >
                        <Checkbox
                            className={classes.checkbox}
                            onClick={() => handleSelectAddress(address)}
                            checked={isChecked}
                            disabled={disableOtherAddresses(address?.id)}
                        />

                        <Typography className={classes.addressText}>
                            <div>
                                <div>
                                    {address
                                        ? [address?.streetLine1, address?.streetLine2].filter(Boolean).join(",")
                                        : null}
                                </div>
                                <div>
                                    {address
                                        ? [address?.city, address?.state, address?.zipCode].filter(Boolean).join(",")
                                        : null}
                                </div>
                            </div>
                        </Typography>
                    </ListItemButton>
                );
            })}
        </List>
    );
};

const ProviderCard = ({
    list,
    onProviderSelection,
    selectAddressIds,
    setSelectAddressIds,
    isEdit,
    selectedProvider,
    providerToEdit,
    disableAddressSelect,
}) => {
    const classes = useStyles();
    const [isOpen, setOpenToggle] = useState({});

    const selectedAddresses = providerToEdit?.addresses?.map((address) => address.id);

    const handleToggleOpen = (NPI, event) => {
        event.stopPropagation(); // Prevents event bubbling
        setOpenToggle((prevOpen) => ({
            ...prevOpen,
            [NPI]: !prevOpen[NPI],
        }));
    };

    return (
        <div className={classes.list}>
            {list?.map((provider, index) => {
                const { NPI, presentationName, specialty, addresses } = provider;

                const sortedAddresses = sortAddressesBySelectedIds(addresses, selectedAddresses);

                const addressList = isEdit ? sortedAddresses : addresses;

                const defaultAddressIdLength = isEdit ? selectedAddresses?.length : 1;

                const initialAddresses =
                    addressList?.length > 1 ? addressList?.slice(0, defaultAddressIdLength) : addressList;

                const additionalAddresses = addressList?.length > 1 ? addressList?.slice(defaultAddressIdLength) : null;

                return (
                    <div
                        className={list.length > 1 ? classes.multipleCard : classes.singleCard}
                        style={{ position: "relative" }}
                        key={`ProviderList-${index}`}
                    >
                        <Typography className={classes.title}>{specialty}</Typography>
                        <Typography className={classes.name}>{presentationName}</Typography>
                        <Typography className={classes.specialty}>{NPI}</Typography>

                        <Address
                            addresses={initialAddresses}
                            provider={provider}
                            setSelectedProvider={onProviderSelection}
                            setSelectAddressIds={setSelectAddressIds}
                            selectAddressIds={selectAddressIds}
                            selectedProvider={selectedProvider}
                            disableAddressSelect={disableAddressSelect}
                        />

                        {additionalAddresses?.length > 0 && (
                            <>
                                <Box className={classes.multipleAddresses}>
                                    <Typography
                                        className={isOpen[provider.NPI] ? classes.reverse : classes.icon}
                                        onClick={(event) => handleToggleOpen(provider.NPI, event)}
                                    >
                                        <Arrow color="#0052CE" />
                                    </Typography>
                                    <Typography className={classes.additional}>
                                        Additional Locations ({additionalAddresses?.length})
                                    </Typography>
                                </Box>
                                {isOpen[provider.NPI] && (
                                    <Address
                                        addresses={additionalAddresses}
                                        provider={provider}
                                        setSelectedProvider={onProviderSelection}
                                        setSelectAddressIds={setSelectAddressIds}
                                        selectAddressIds={selectAddressIds}
                                        selectedProvider={selectedProvider}
                                        disableAddressSelect={disableAddressSelect}
                                    />
                                )}
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ProviderCard;
