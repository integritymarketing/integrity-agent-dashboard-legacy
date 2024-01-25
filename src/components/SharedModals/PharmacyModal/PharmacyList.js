import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import makeStyles from "@mui/styles/makeStyles";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

const usePharmacyListStyles = makeStyles((theme) => ({
    // Style rules for the radio buttons
    radio: {
        color: "#434A51",
        "&.Mui-checked": {
            color: "#4178FF",
        },
    },

    checkbox: {
        color: "#434A51",
        "&.Mui-checked": {
            color: "#4178FF",
        },
    },

    // Style rules for the list items
    listItem: {
        backgroundColor: "#dddddd !important",
        height: 70,
        boxShadow: "inset 0px -1px 0px #cccccc",
        padding: "10px !important",
        "&.Mui-selected, &.Mui-selected:hover, &:hover": {
            backgroundColor: "#f1faff !important",
        },
    },

    // Style rules for the primary and secondary text of list items
    primaryText: {
        color: "#052A63",
        fontFamily: "Lato",
        fontSize: "20px",
        letterSpacing: "0.16px",
    },
    secondaryText: {
        color: "#434A51",
        fontFamily: "Lato",
        fontSize: "16px",
    },

    singleCard: {
        padding: "16px",
        borderRadius: "8px",
    },
    multipleCard: {
        padding: "16px",
        boxShadow: "inset 0px -1px 0px #CCCCCC",
        backgroundColor: "#dddddd !important",
        "&:first-child": {
            borderRadius: "8px 8px 0px 0px",
        },
        "&:last-child": {
            borderRadius: "0px 0px 8px 8px",
        },
    },

    // Style rules for the list Root

    listRoot: {
        maxHeight: "35vh",
        overflowY: "auto",
        marginBottom: "5px",
        "& li:first-of-type": {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
        },
        "& li:last-of-type": {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
        },
        "&.MuiIconButton-colorSecondary:hover": {
            backgroundColor: "transparent !important",
        },
    },
}));
const PharmacyList = ({ setSelectedPharmacy, list, selectedPharmacy }) => {
    const classes = usePharmacyListStyles();

    const handleSelectionChange = useCallback(
        (pharmacy) => {
            if (pharmacy.pharmacyID === selectedPharmacy?.pharmacyID) {
                setSelectedPharmacy(null);
            } else {
                setSelectedPharmacy(pharmacy);
            }
        },
        [setSelectedPharmacy, selectedPharmacy]
    );

    const renderedPharmacyList = useMemo(
        () =>
            list?.map((pharmacy) => {
                const { name, address1 = "", address2 = "", city = "", state = "", pharmacyID } = pharmacy;
                console.log("pharmacy", pharmacyID, selectedPharmacy?.pharmacyID);
                return (
                    <ListItemButton
                        key={pharmacy.label}
                        selected={pharmacyID === selectedPharmacy?.pharmacyID}
                        classes={{ root: classes.listItem }}
                    >
                        <Checkbox
                            className={classes.checkbox}
                            onClick={() => handleSelectionChange(pharmacy)}
                            checked={pharmacyID === selectedPharmacy?.pharmacyID}
                        />
                        <ListItemText
                            primary={<span className={classes.primaryText}>{name}</span>}
                            secondary={
                                <span className={classes.secondaryText}>
                                    {address1}
                                    {address2 ? " " + address2 : ""}, {city}, {state}
                                </span>
                            }
                        />
                    </ListItemButton>
                );
            }),
        [list, classes, setSelectedPharmacy, selectedPharmacy]
    );

    return <List className={classes.listRoot}>{renderedPharmacyList}</List>;
};

export default PharmacyList;
