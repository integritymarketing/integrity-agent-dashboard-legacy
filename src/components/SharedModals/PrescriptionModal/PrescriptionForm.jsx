import PropTypes from "prop-types";
import makeStyles from "@mui/styles/makeStyles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Select } from "components/ui/Select";
import FREQUENCY_OPTIONS from "utils/frequencyOptions";
import styles from "./styles.module.scss";

const useStyles = makeStyles(() => ({
    customTypography: {
        color: "#052A63",
        fontSize: 16,
        fontFamily: "Lato",
        letterSpacing: "0.16px",
        fontWeight: "bold",
        marginBottom: 10,
    },
}));

const PrescriptionForm = ({
    dosage,
    dosageOptions,
    setDosage,
    quantity,
    handleQuantity,
    frequency,
    setFrequency,
    packageOptions,
    dosagePackage,
    setDosagePackage,
}) => {
    const classes = useStyles();

    return (
        <Grid container rowSpacing={1} columnSpacing={3}>
            <Grid item xs={12} md={12}>
                <Box>
                    <Typography className={classes.customTypography}>Dosage</Typography>
                    <Select
                        initialValue={dosage}
                        selectContainerClassName={styles.distanceSelectContainer}
                        inputBoxClassName={styles.distanceInputBox}
                        providerModal={true}
                        options={dosageOptions}
                        placeholder="Dosage"
                        onChange={setDosage}
                        selectClassName={styles.distanceSelect}
                    />
                </Box>
            </Grid>
            <Grid item xs={4} md={4}>
                <Box>
                    <Typography className={classes.customTypography}>Quantity</Typography>
                    <TextField
                        sx={{ backgroundColor: "#FFFFFF" }}
                        id="Quantity"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={quantity}
                        onChange={handleQuantity}
                    />
                </Box>
            </Grid>
            <Grid item xs={8} md={8}>
                <Box>
                    <Typography className={classes.customTypography}>Frequency</Typography>
                    <Select
                        providerModal={true}
                        initialValue={frequency}
                        selectContainerClassName={styles.distanceSelectContainer}
                        inputBoxClassName={styles.distanceInputBox}
                        options={FREQUENCY_OPTIONS}
                        placeholder="Frequency"
                        onChange={setFrequency}
                    />
                </Box>
            </Grid>
            {packageOptions?.length > 0 && (
                <Grid item xs={12} md={12}>
                    <Box>
                        <Typography className={classes.customTypography}>Packaging</Typography>
                        <Select
                            selectContainerClassName={styles.distanceSelectContainer}
                            inputBoxClassName={styles.distanceInputBox}
                            providerModal={true}
                            initialValue={dosagePackage}
                            options={packageOptions}
                            placeholder="Packaging"
                            onChange={setDosagePackage}
                        />
                    </Box>
                </Grid>
            )}
        </Grid>
    );
};

PrescriptionForm.propTypes = {
    dosage: PropTypes.any,
    dosageOptions: PropTypes.arrayOf(PropTypes.object),
    setDosage: PropTypes.func.isRequired,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    handleQuantity: PropTypes.func.isRequired,
    frequency: PropTypes.any,
    setFrequency: PropTypes.func.isRequired,
    packageOptions: PropTypes.arrayOf(PropTypes.object),
    dosagePackage: PropTypes.any,
    setDosagePackage: PropTypes.func.isRequired,
};

PrescriptionForm.defaultProps = {
    dosage: null,
    dosageOptions: [],
    quantity: null,
    frequency: null,
    packageOptions: [],
    dosagePackage: null,
};

export default PrescriptionForm;
