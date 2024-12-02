import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Grid, Stack } from "@mui/material";
import {
    HEALTH_CLASSIFICATION_OPTS,
    ILLUSTRATED_RATE_OPTS,
    LIFE_FORM_TYPES,
    LOANS_OPTS,
    PAY_PERIOD_OPTS,
} from "components/LifeForms/LifeForm.constants";
import styles from "./ProductPreferenceForm.module.scss";
import CounterInput from "components/LifeForms/common/CounterInput";
import CustomFieldContainer from "components/LifeForms/common/CustomFieldContainer/CustomFieldContainer";
import CustomRadioGroupOption from "components/LifeForms/common/CustomRadioGroupOption/CustomRadioGroupOption";
import { Formik } from "formik";
import { ProductPreferenceFormSchema } from "schemas/ProductPreferenceFormSchema";
import FullWidthButton from "components/ui/FullWidthButton";
import ButtonCircleArrow from "components/icons/button-circle-arrow";
import { useLeadDetails } from "providers/ContactDetails";

export const ProductPreferenceForm = () => {
    const [formData, setFormData] = useState({
        payPeriods: "65",
        loanType: "LoansFixed",
        illustratedRate: "5",
        healthClasses: "",
        faceAmounts: "",
    });

    const navigate = useNavigate();

    const { leadDetails } = useLeadDetails();

    const handleSubmitData = useCallback(
        async (value) => {
            const { healthClasses, faceAmounts, payPeriods, illustratedRate, loanType } = value;

            const stateCode =
                leadDetails?.addresses && leadDetails?.addresses[0] ? leadDetails?.addresses[0]?.stateCode : null;

            const sessionData = {
                birthDate: leadDetails?.birthdate,
                isTobaccoUser: leadDetails?.isTobaccoUser,
                gender: leadDetails?.gender === "female" ? "F" : "M",
                healthClasses: healthClasses,
                state: stateCode,
                faceAmounts: faceAmounts,
                payPeriods: payPeriods,
                illustratedRate: illustratedRate,
                loanType: loanType,
            };

            sessionStorage.setItem("lifeQuoteAccumulationDetails", JSON.stringify(sessionData));
            navigate(`/life/iul-accumulation/${leadDetails?.leadsId}/quote`);
        },
        [leadDetails, navigate]
    );

    const handleFaceAmountChange = useCallback((value, setFieldValue) => {
        setFieldValue("faceAmounts", value);
    }, []);
    return (
        <Formik
            initialValues={formData}
            validateOnMount={true}
            enableReinitialize={true}
            validationSchema={ProductPreferenceFormSchema}
            onSubmit={(values) => {
                handleSubmitData(values);
            }}
        >
            {({
                values,
                errors,
                isValid,
                dirty,
                touched,
                handleChange,
                handleSubmit,
                setFieldValue,
                setFieldTouched,
            }) => {
                return (
                    <>
                        <Grid container direction={"row"} rowSpacing={2} columnSpacing={{ xs: 0, md: 3 }} style={{}}>
                            <Grid item md={6} xs={12}>
                                <CustomFieldContainer label="Pay Period*">
                                    <Grid item xs={12} container spacing={1}>
                                        {PAY_PERIOD_OPTS.map((option, index) => {
                                            return (
                                                <Grid
                                                    item
                                                    md={6}
                                                    xs={12}
                                                    className={styles.radioOptionGrid}
                                                    key={index}
                                                >
                                                    <CustomRadioGroupOption
                                                        name="payPeriods"
                                                        value={option.value}
                                                        label={option.label}
                                                        stateValue={values.payPeriods}
                                                        onChange={handleChange}
                                                    />
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </CustomFieldContainer>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <CustomFieldContainer label="Loans*">
                                    <Grid item xs={12} container spacing={1}>
                                        {LOANS_OPTS.map((option, index) => {
                                            return (
                                                <Grid
                                                    item
                                                    md={6}
                                                    xs={12}
                                                    className={styles.radioOptionGrid}
                                                    key={index}
                                                >
                                                    <CustomRadioGroupOption
                                                        name="loanType"
                                                        value={option.value}
                                                        label={option.label}
                                                        stateValue={values.loanType}
                                                        onChange={handleChange}
                                                    />
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </CustomFieldContainer>
                            </Grid>
                            <Grid item xs={12}>
                                <CustomFieldContainer label="Illustrated Rate*">
                                    <Grid item xs={12} container spacing={1}>
                                        {ILLUSTRATED_RATE_OPTS.map((option, index) => {
                                            return (
                                                <Grid item xs={4} className={styles.radioOptionGrid} key={index}>
                                                    <CustomRadioGroupOption
                                                        name="illustratedRate"
                                                        value={option.value}
                                                        label={option.label}
                                                        stateValue={values.illustratedRate}
                                                        onChange={handleChange}
                                                    />
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </CustomFieldContainer>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <CustomFieldContainer
                                    label="Health Classification*"
                                    error={touched.healthClasses && errors.healthClasses}
                                >
                                    <Grid item xs={12} container spacing={1}>
                                        {HEALTH_CLASSIFICATION_OPTS.map((option, index) => {
                                            return (
                                                <Grid
                                                    item
                                                    md={3}
                                                    xs={6}
                                                    display={"flex"}
                                                    className={styles.radioOptionGrid}
                                                    key={index}
                                                >
                                                    <CustomRadioGroupOption
                                                        name="healthClasses"
                                                        value={option.value}
                                                        label={option.label}
                                                        stateValue={values.healthClasses}
                                                        onChange={(e) => {
                                                            setFieldTouched("healthClasses", true);
                                                            handleChange(e);
                                                        }}
                                                    />
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </CustomFieldContainer>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <CustomFieldContainer
                                    label="Fixed Annual Premium*"
                                    error={touched.faceAmounts && errors.faceAmounts}
                                    style={{ height: "100%" }}
                                >
                                    <Stack flex alignItems={"stretch"} flexGrow={1} justifyContent="center">
                                        <CounterInput
                                            onValueChange={(value) => {
                                                setFieldTouched("faceAmounts", true);
                                                handleFaceAmountChange(value, setFieldValue);
                                            }}
                                            min={2000}
                                            max={2000000}
                                            initialValue={0}
                                            incrementOrDecrementValue={50}
                                            inputStyles={{ padding: "23.1px 14px" }}
                                        />
                                    </Stack>
                                </CustomFieldContainer>
                            </Grid>
                        </Grid>
                        <Stack flex>
                            <FullWidthButton
                                disabled={!isValid || !dirty}
                                label="Continue to Quote"
                                type="primary"
                                onClick={() => {
                                    handleSubmit();
                                }}
                                icon={<ButtonCircleArrow />}
                                iconPosition="right"
                                style={{ border: "none", justifyContent: "space-between" }}
                                className={styles.nextButton}
                            />
                        </Stack>
                    </>
                );
            }}
        </Formik>
    );
};

ProductPreferenceForm.propTypes = {
    contactId: PropTypes.string.isRequired,
    quoteType: PropTypes.oneOf([
        LIFE_FORM_TYPES.IUL_ACCUMULATION,
        LIFE_FORM_TYPES.IUL_PROTECTION,
        LIFE_FORM_TYPES.TERM,
    ]),
};

export default ProductPreferenceForm;
