import React, { useContext, useEffect, useState } from "react";
import { FormControl, Grid, Select, Typography } from "@mui/material";
import { TextInput } from "components/MuiComponents";
import PropTypes from "prop-types";
import MenuItem from "@mui/material/MenuItem";
import CountyContext from "../../../contexts/counties";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Box from "@mui/material/Box";

const AddressDetails = ({ formik }) => {
    const { values, errors, touched, submitCount, handleChange, handleBlur, setFieldValue } = formik;
    const {
        allCounties = [],
        allStates = [],
        fetchCountyAndState,
        loading: loadingCountyAndState,
    } = useContext(CountyContext);

    const [zipLengthValid, setZipLengthValid] = useState(false);

    useEffect(() => {
        fetchCountyAndState("");
    }, [fetchCountyAndState]);

    const isInvalidZip =
        (values.address.postalCode.length === 5 && !loadingCountyAndState && allStates?.length === 0) ||
        (values.address.postalCode > 0 && values.address.postalCode.length < 5);

    useEffect(() => {
        if (!loadingCountyAndState) {
            if (allCounties.length === 1) {
                setFieldValue("address.county", allCounties[0].value);
                setFieldValue("address.countyFips", allCounties[0].key);
            }
            if (allStates.length === 1) {
                setFieldValue("address.stateCode", allStates[0].value);
            }
        }
    }, [loadingCountyAndState]);

    useEffect(() => {
        if (allCounties.length > 0 && values?.address?.stateCode) {
            const countiesForState = allCounties.filter((county) => county.state === values.address.stateCode);
            if (countiesForState.length === 1) {
                setFieldValue("address.county", countiesForState[0].value);
                setFieldValue("address.countyFips", countiesForState[0].key);
            }
        }
    }, [allStates, allCounties, values]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <TextInput
                    label="Address"
                    fullWidth
                    name="address.address1"
                    value={values.address.address1}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean((touched.address?.address1 || submitCount > 0) && errors.address?.address1)}
                />
                {(touched.address?.address1 || submitCount > 0) && errors.address?.address1 && (
                    <Typography variant="body2" color="error" mt={0.5}>
                        {errors.address?.address1}
                    </Typography>
                )}
            </Grid>
            <Grid item xs={12} md={6}>
                <TextInput
                    label="Apt, Suite, Unit, etc."
                    fullWidth
                    name="address.address2"
                    value={values.address.address2}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean((touched.address?.address2 || submitCount > 0) && errors.address?.address2)}
                />
                {(touched.address?.address2 || submitCount > 0) && errors.address?.address2 && (
                    <Typography variant="body2" color="error" mt={0.5}>
                        {errors.address?.address2}
                    </Typography>
                )}
            </Grid>
            <Grid item xs={12} md={6}>
                <TextInput
                    label="City"
                    fullWidth
                    name="address.city"
                    value={values.address.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean((touched.address?.city || submitCount > 0) && errors.address?.city)}
                />
                {(touched.address?.city || submitCount > 0) && errors.address?.city && (
                    <Typography variant="body2" color="error" mt={0.5}>
                        {errors.address?.city}
                    </Typography>
                )}
            </Grid>
            <Grid item xs={12} md={6}>
                <TextInput
                    label="Zip"
                    fullWidth
                    name="address.postalCode"
                    placeholder="#####"
                    inputprops={{ maxLength: 5 }}
                    value={values.address.postalCode}
                    onChange={(e) => {
                        setFieldValue("address.postalCode", e.target.value);
                        setFieldValue("address.county", "");
                        setFieldValue("address.stateCode", "");
                        fetchCountyAndState(e.target.value);
                        setZipLengthValid(e.target.value.length >= 5);
                    }}
                    onBlur={handleBlur}
                    onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 5);
                    }}
                    error={Boolean(errors.address?.postalCode || isInvalidZip)}
                />
                {errors.address?.postalCode && (
                    <Typography variant="body2" color="error" mt={0.5}>
                        {errors.address?.postalCode}
                    </Typography>
                )}
                {!errors.address?.postalCode &&
                    values.address.postalCode.length > 0 &&
                    !loadingCountyAndState &&
                    allStates?.length === 0 && (
                        <Typography variant="body2" color="error" mt={0.5}>
                            Invalid ZIP Code
                        </Typography>
                    )}
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h5" color="#052a63" marginBottom={0.5}>
                    State
                </Typography>
                <FormControl variant="outlined" fullWidth>
                    <Select
                        value={values.address.stateCode}
                        onChange={(ev) => {
                            setFieldValue("address.stateCode", ev.target.value);
                        }}
                        renderValue={(selected) => {
                            if (selected.length === 0) {
                                return "Select";
                            }
                            return selected;
                        }}
                        displayEmpty
                        IconComponent={(props) => (
                            <Box mr={1} {...props}>
                                <FontAwesomeIcon icon={faChevronDown} color="#4178FF" size={"lg"} />
                            </Box>
                        )}
                    >
                        {allStates?.length > 0 &&
                            allStates.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h5" color="#052a63" marginBottom={0.5}>
                    County
                </Typography>
                <FormControl variant="outlined" fullWidth>
                    <Select
                        value={values.address.county}
                        onChange={(ev) => {
                            setFieldValue("address.county", ev.target.value);
                            const fip = allCounties.find((item) => item.value === ev.target.value)?.key;
                            setFieldValue("address.countyFips", fip);
                        }}
                        renderValue={(selected) => {
                            if (selected.length === 0) {
                                return "Select";
                            }
                            return selected;
                        }}
                        displayEmpty
                        IconComponent={(props) => (
                            <Box mr={1} {...props}>
                                <FontAwesomeIcon icon={faChevronDown} color="#4178FF" size={"lg"} />
                            </Box>
                        )}
                    >
                        {allCounties.length > 0 &&
                            allCounties.map(
                                (option) =>
                                    option.state === values.address.stateCode && (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ),
                            )}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};

AddressDetails.propTypes = {
    formik: PropTypes.object.isRequired,
};

export default AddressDetails;
