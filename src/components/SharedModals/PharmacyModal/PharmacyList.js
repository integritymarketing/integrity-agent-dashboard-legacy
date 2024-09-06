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
const PharmacyList = ({ selectedPharmacies, list, setSelectedPharmacies }) => {
    const classes = usePharmacyListStyles();
    const handleSelectionChange = useCallback(
        (pharmacy) => {
            const isSelected = selectedPharmacies.some((selectedPharmacy) => selectedPharmacy.pharmacyID === pharmacy.pharmacyID);
            if (isSelected) {
                setSelectedPharmacies(selectedPharmacies.filter((selectedPharmacy) => selectedPharmacy.pharmacyID !== pharmacy.pharmacyID));
            } else if (selectedPharmacies.length <= 2) {
                setSelectedPharmacies([...selectedPharmacies, pharmacy]);
            }
        },
        [setSelectedPharmacies, selectedPharmacies]
    );

    const renderedPharmacyList = useMemo(
        () =>
            list?.map((pharmacy) => {
                const { name, address1 = "", address2 = "", city = "", state = "", pharmacyID } = pharmacy;
                const isChecked = selectedPharmacies.some((selectedPharmacy) => selectedPharmacy.pharmacyID === pharmacyID);
                const disableCheckbox = selectedPharmacies.length >= 3 && !isChecked;

                return (
                    <ListItemButton
                        key={pharmacy.pharmacyID}
                        selected={isChecked}
                        classes={{ root: classes.listItem }}
                        onClick={() => handleSelectionChange(pharmacy)}
                    >
                        <Checkbox
                            className={classes.checkbox}
                            checked={isChecked}
                            disabled={disableCheckbox}
                        />
                        <ListItemText
                            primary={<span className={classes.primaryText}>{name}</span>}
                            secondary={
                                <span className={classes.secondaryText}>
                                    {address1}
                                    {address2 ? ` ${  address2}` : ""}, {city}, {state}
                                </span>
                            }
                        />
                    </ListItemButton>
                );
            }),
        [list, classes, handleSelectionChange, selectedPharmacies]
    );

    return <List className={classes.listRoot}>{renderedPharmacyList}</List>;
};

PharmacyList.propTypes = {
    selectedPharmacies: PropTypes.arrayOf(
        PropTypes.shape({
            pharmacyID: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            address1: PropTypes.string,
            address2: PropTypes.string,
            city: PropTypes.string,
            state: PropTypes.string,
        })
    ).isRequired,
    setSelectedPharmacies: PropTypes.func.isRequired,
    list: PropTypes.arrayOf(
        PropTypes.shape({
            pharmacyID: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            address1: PropTypes.string,
            address2: PropTypes.string,
            city: PropTypes.string,
            state: PropTypes.string,
        })
    ).isRequired,
};

export default PharmacyList;
