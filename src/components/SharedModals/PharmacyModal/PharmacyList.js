import { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import makeStyles from "@mui/styles/makeStyles";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Checkbox } from "components/ui/version-2/Checkbox";
import { formatAddress } from "utils/addressFormatter";

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
    checkboxDisabled: {
        "&:hover": {
            cursor: "not-allowed",
        },
    },

    // Style rules for the list items
    listItem: {
        backgroundColor: "#dddddd !important",
        boxShadow: "inset 0px -1px 0px #cccccc",
        padding: "10px !important",
        "&.Mui-selected, &.Mui-selected:hover, &:hover": {
            backgroundColor: "#f1faff !important",
        },
    },

    listItemDisabled: {
        cursor: "not-allowed !important",
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

    listRoot: {
        maxHeight: "35vh",
        overflowY: "auto",
        marginBottom: "5px",
        borderRadius: "8px",
        padding: "0",
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
    const shouldDisableCheckbox = useMemo(() => {
        if (selectedPharmacies.length >= 3) {
            return true;
        }
        return false;
    }, [selectedPharmacies]);

    const handleSelectionChange = useCallback(
        (pharmacy, isCheckedAlready) => {
            if (isCheckedAlready) {
                setSelectedPharmacies([
                    ...selectedPharmacies.filter(
                        (selectedPharmacy) =>
                            selectedPharmacy.pharmacyID !== pharmacy.pharmacyID &&
                            selectedPharmacy.pharmacyId !== pharmacy.pharmacyID
                    ),
                ]);
            } else if (!shouldDisableCheckbox && selectedPharmacies.length <= 2) {
                setSelectedPharmacies([...selectedPharmacies, pharmacy]);
            }
        },
        [setSelectedPharmacies, shouldDisableCheckbox, selectedPharmacies]
    );

    const renderedPharmacyList = useMemo(
        () =>
            list?.map((pharmacy) => {
                const { name, address1 = "", address2 = "", city = "", state = "", zip = "", pharmacyID } = pharmacy;
                const isChecked =
                    pharmacyID &&
                    selectedPharmacies.some(
                        (selectedPharmacy) =>
                            selectedPharmacy.pharmacyId === pharmacyID || selectedPharmacy.pharmacyID === pharmacyID
                    );
                const disableCheckbox = shouldDisableCheckbox;

                return (
                    <ListItemButton
                        key={pharmacy.pharmacyID}
                        selected={isChecked}
                        classes={{ root: `${classes.listItem} ${disableCheckbox ? classes.listItemDisabled : ""}` }}
                        onClick={() => handleSelectionChange(pharmacy, isChecked)}
                    >
                        <Checkbox
                            bgType="white"
                            className={`${classes.checkbox}`}
                            checked={isChecked}
                            disabled={disableCheckbox}
                        />
                        <ListItemText
                            primary={<span className={classes.primaryText}>{name}</span>}
                            secondary={
                                <span className={classes.secondaryText}>
                                    {formatAddress({
                                        address1,
                                        address2,
                                        city,
                                        stateCode: state,
                                        postalCode: zip,
                                        defaultValue: "Digital Pharmacy",
                                    })}
                                </span>
                            }
                        />
                    </ListItemButton>
                );
            }),
        [list, classes, shouldDisableCheckbox, handleSelectionChange, selectedPharmacies]
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
            zip: PropTypes.string,
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
            zip: PropTypes.string,
        })
    ).isRequired,
};

export default PharmacyList;
