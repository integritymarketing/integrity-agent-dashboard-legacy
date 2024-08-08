import React from "react";
import Box from "@mui/material/Box";
import InNetworkIcon from "components/icons/inNetwork";
import OutNetworkIcon from "components/icons/outNetwork";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import makeStyles from "@mui/styles/makeStyles";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import FREQUENCY_OPTIONS from "utils/frequencyOptions";
import Modal from "components/Modal";
import CustomFooter from "components/Modal/CustomFooter";
import Plus from "components/icons/plus";

import Edit from "components/Edit";
import EditIcon from "components/icons/edit2";
import "../PrescriptionModal/styles.module.scss";

const useStyles = makeStyles((theme) => ({
    listRoot: {
        "& li:first-of-type": {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
        },
        "& li:last-of-type": {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
        },
    },
    listItem: {
        backgroundColor: "#FFFFFF",
        height: 80,
        boxShadow: "inset 0px -1px 0px #DDDDDD;",
    },
    network: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    drugType: {
        color: "#717171",
        fontSize: 14,
        fontFamily: "Lato",
        letterSpacing: "0.24px",
    },
    planName: {
        color: "#052A63",
        fontSize: 24,
        fontFamily: "Lato",
        letterSpacing: "0.24px",
        marginTop: 30,
    },
    details: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    labelName: {
        color: "#052A63",
        fontSize: 14,
        fontFamily: "Lato",
        letterSpacing: "0.24px",
    },
    packDetails: {
        color: "#717171",
        fontSize: 14,
        fontFamily: "Lato",
        letterSpacing: "0.24px",
    },
    customButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#4178FF",
        fontSize: "16px",
        fontWeight: "600",
        height: "40px",
        textTransform: "unset",
        padding: "10px 15px",
        "&:hover": {
            backgroundColor: "#FFFFFF",
            borderRadius: "20px",
            boxShadow: "inset 0px -1px 0px #CCCCCC",
        },
    },
}));

const getFrequencyValue = (dayofSupply) => {
    const frequencyOptions = FREQUENCY_OPTIONS.filter((option) => option.value === dayofSupply);
    const result = frequencyOptions[0]?.label;
    return result;
};

const PrescriptionRow = ({ item, coveredDrugs, onEditPrescription }) => {
    const classes = useStyles();

    const { dosage, dosageDetails } = item;
    const { labelName, daysOfSupply, drugType, selectedPackage, userQuantity, ndc } = dosage;
    const selectPackageDetails = selectedPackage
        ? `${userQuantity} X ${selectedPackage.packageDisplayText} ${getFrequencyValue(daysOfSupply)}`
        : dosageDetails
        ? `${userQuantity} ${dosageDetails.dosageFormName.toLowerCase()} ${getFrequencyValue(daysOfSupply)}`
        : "";

    const isNetwork = coveredDrugs?.some((item) => ndc === item?.ndc && item.tierNumber > 0);

    return (
        <ListItem className={classes.listItem}>
            <Box className={classes.network}>{isNetwork ? <InNetworkIcon /> : <OutNetworkIcon />}</Box>
            <ListItemText
                primary={drugType}
                secondary={
                    <Box className={classes.details}>
                        <Typography component="span" variant="body2" className={classes.labelName}>
                            {labelName}
                        </Typography>
                        <Typography component="span" variant="body2" className={classes.packDetails}>
                            {selectPackageDetails}
                        </Typography>
                    </Box>
                }
                classes={{
                    primary: classes.drugType,
                }}
            />

            <Edit label={"Edit"} onClick={() => onEditPrescription(item)} icon={<EditIcon />} />
        </ListItem>
    );
};

const PrescriptionCoverageModal = ({
    prescriptions,
    onClose,
    open,
    planName,
    coveredDrugs,
    addNew,
    onEditPrescription,
}) => {
    const classes = useStyles();

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={"Prescription Coverage"}
            customFooter={<CustomFooter buttonName={"Add Prescription"} onClick={addNew} icon={<Plus />} />}
            hideFooter={true}
        >
            <>
                <Typography className={classes.planName}>{planName}</Typography>
                <List className={classes.listRoot}>
                    {prescriptions.map((item, index) => (
                        <PrescriptionRow
                            key={index}
                            item={item}
                            coveredDrugs={coveredDrugs}
                            onEditPrescription={onEditPrescription}
                        />
                    ))}
                </List>
            </>
        </Modal>
    );
};

PrescriptionCoverageModal.propTypes = {
    prescriptions: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    planName: PropTypes.string.isRequired,
    coveredDrugs: PropTypes.array,
};

export default PrescriptionCoverageModal;
