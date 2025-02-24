import { Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";
import CommunicationInputsGroup from "components/ContactForm/CommunicationInputsGroup";
import { SelectableButtonGroup } from "@integritymarketing/clients-ui-kit";
import styles from "./CommunicationDetails.module.scss";

const CommunicationDetails = ({ formik }) => {
    const { touched, errors, values, submitCount, setFieldValue } = formik;

    return (
        <Grid container spacing={2}>
            {/* Email Input */}
            <CommunicationInputsGroup formik={formik} page="addNew" />

            {/* Primary Communication Selection */}
            <Grid item xs={12}>
                <Typography variant="h5" color="#052a63" marginBottom={0.5}>
                    Primary Contact Method*
                </Typography>
                <SelectableButtonGroup
                    buttonOptions={["Email", "Phone"]}
                    buttonClassNames={["email", "phone"].map((option) =>
                        values.primaryCommunication === option.toLowerCase()
                            ? styles.selectedOption
                            : styles.nonSelectedOption
                    )}
                    onSelect={(selected) => {
                        const selectedValue = selected.toLowerCase();
                        setFieldValue("primaryCommunication", selectedValue);
                    }}
                />
                {(touched.primaryCommunication || submitCount > 0) && errors.primaryCommunication && (
                    <Typography variant="body2" color="error" mt={0.5}>
                        {errors.primaryCommunication}
                    </Typography>
                )}
            </Grid>
        </Grid>
    );
};

CommunicationDetails.propTypes = {
    formik: PropTypes.shape({
        touched: PropTypes.object,
        errors: PropTypes.object,
        values: PropTypes.shape({
            primaryCommunication: PropTypes.oneOf(["email", "phone"]).isRequired,
            email: PropTypes.string,
            phones: PropTypes.shape({
                leadPhone: PropTypes.string,
            }).isRequired,
        }).isRequired,
        handleBlur: PropTypes.func.isRequired,
        submitCount: PropTypes.number.isRequired,
        setFieldValue: PropTypes.func.isRequired,
    }).isRequired,
};

export default CommunicationDetails;