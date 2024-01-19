import React, { useCallback, useMemo } from "react";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Radio from "@mui/material/Radio";
import { styled } from "@mui/material/styles";

import PropTypes from "prop-types";

const PREFIX = "PrescriptionList";

const classes = {
    radio: `${PREFIX}-radio`,
    listItem: `${PREFIX}-listItem`,
    primaryText: `${PREFIX}-primaryText`,
    secondaryText: `${PREFIX}-secondaryText`,
    listRoot: `${PREFIX}-listRoot`,
};

const StyledList = styled(List)(({ theme }) => ({
    // Style rules for the radio buttons
    [`& .${classes.radio}`]: {
        color: "#434A51",
        "&.Mui-checked": {
            color: "#4178FF",
        },
    },

    // Style rules for the list items
    [`& .${classes.listItem}`]: {
        backgroundColor: "#dddddd !important",
        height: 56,
        boxShadow: "inset 0px -1px 0px #cccccc",
        "&.Mui-selected, &.Mui-selected:hover, &:hover": {
            backgroundColor: "#f1faff !important",
        },
    },

    // Style rules for the primary and secondary text of list items
    [`& .${classes.primaryText}`]: {
        color: "#434A51",
        fontFamily: "Lato",
        fontSize: "16px",
        letterSpacing: "0.16px",
    },

    [`& .${classes.secondaryText}`]: {
        color: "#717171",
        fontFamily: "Lato",
        fontSize: "14px",
    },

    // Style rules for the list Root

    [`&.${classes.listRoot}`]: {
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

const usePrescriptionListStyles = styled(({ theme }) => ({
    // Style rules for the radio buttons
    [`& .${classes.radio}`]: {
        color: "#434A51",
        "&.Mui-checked": {
            color: "#4178FF",
        },
    },

    // Style rules for the list items
    [`& .${classes.listItem}`]: {
        backgroundColor: "#dddddd !important",
        height: 56,
        boxShadow: "inset 0px -1px 0px #cccccc",
        "&.Mui-selected, &.Mui-selected:hover, &:hover": {
            backgroundColor: "#f1faff !important",
        },
    },

    // Style rules for the primary and secondary text of list items
    [`& .${classes.primaryText}`]: {
        color: "#434A51",
        fontFamily: "Lato",
        fontSize: "16px",
        letterSpacing: "0.16px",
    },

    [`& .${classes.secondaryText}`]: {
        color: "#717171",
        fontFamily: "Lato",
        fontSize: "14px",
    },

    // Style rules for the list Root

    [`&.${classes.listRoot}`]: {
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

const PrescriptionList = ({ onDrugSelection, prescriptionList, selected, multiple }) => {
    const classes = usePrescriptionListStyles();
    const handleSelectionChange = useCallback(
        (drug) => {
            onDrugSelection(drug);
        },
        [onDrugSelection]
    );

    const verifySelected = useCallback(
        (drug) => {
            return multiple ? drug?.label === selected?.label : selected;
        },
        [selected, multiple]
    );

    const renderedPrescriptionList = useMemo(
        () =>
            prescriptionList.map((drug) => (
                <ListItemButton
                    key={drug.label}
                    selected={verifySelected(drug)}
                    onClick={() => handleSelectionChange(drug)}
                    classes={{ root: classes.listItem }}
                >
                    <Radio
                        disableRipple
                        onClick={() => handleSelectionChange(drug)}
                        checked={verifySelected(drug)}
                        classes={{ root: classes.radio }}
                    />
                    <ListItemText
                        primary={<span className={classes.primaryText}>{drug.label}</span>}
                        secondary={<span className={classes.secondaryText}>{drug.description}</span>}
                    />
                </ListItemButton>
            )),
        [prescriptionList, handleSelectionChange, classes, verifySelected]
    );

    return <StyledList className={classes.listRoot}>{renderedPrescriptionList}</StyledList>;
};

PrescriptionList.propTypes = {
    onDrugSelection: PropTypes.func.isRequired,
    prescriptionList: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            description: PropTypes.string,
        })
    ).isRequired,
};

PrescriptionList.defaultProps = {
    prescriptionList: [],
};

export default PrescriptionList;
