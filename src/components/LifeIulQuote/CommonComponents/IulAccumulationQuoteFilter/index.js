import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Typography, Grid, useTheme, useMediaQuery, Button } from "@mui/material";
import CounterInput from "components/LifeForms/common/CounterInput";
import { HEALTH_CLASSIFICATION_OPTS, ILLUSTRATED_RATE_OPTS, LOANS_OPTS, PAY_PERIOD_OPTS } from "../constants";
import CustomRadioGroupOption from "components/LifeForms/common/CustomRadioGroupOption/CustomRadioGroupOption";
import CustomCheckboxGroupOption from "components/LifeForms/common/CustomCheckboxGroupOption/CustomCheckboxGroupOption";
import CollapsibleSection from "components/LifeIulQuote/CommonComponents/CollapsibleSection";
import { useLifeIulQuote } from "providers/Life";
import Filter from "components/icons/LifeIul/filter";
import { debounce } from "lodash";
import * as yup from "yup";
import styles from "./styles.module.scss";

const validationSchema = yup.object().shape({
    faceAmounts: yup
        .number()
        .required("Please enter a value between 2000 and 2000000.")
        .typeError("Fixed Annual Premium must be a number")
        .min(2000, "Minimum value for Fixed Annual Premium is 2000")
        .max(2000000, "Maximum value for Fixed Annual Premium is 2000000"),
});

export const IulAccumulationQuoteFilter = () => {
    const {
        fetchLifeIulQuoteResults,
        tempUserDetails,
        selectedCarriers,
        handleCarriersChange,
        showFilters,
        setShowFilters,
    } = useLifeIulQuote();

    const lifeQuoteAccumulationDetails = sessionStorage.getItem("lifeQuoteAccumulationDetails");
    const [faceAmountsState, setFaceAmountsState] = useState(0);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const resetQuoteResults = useCallback(
        async (updatedSessionData) => {
            const { birthDate, gender, state, healthClasses, faceAmounts, payPeriods, illustratedRate, loanType } =
                updatedSessionData;

            const payload = {
                inputs: [
                    {
                        birthDate: birthDate,
                        gender: gender,
                        healthClasses: [healthClasses],
                        state: state,
                        faceAmounts: [String(faceAmounts)],
                        payPeriods: [payPeriods],
                        props: {
                            illustratedRate: illustratedRate,
                            loanType: loanType,
                        },
                    },
                ],
                quoteType: "IULACCU-SOLVE",
            };
            await fetchLifeIulQuoteResults(payload);
        },
        [fetchLifeIulQuoteResults]
    );

    const handleFiltersChange = (filterName, value) => {
        const parsedLifeQuoteAccumulationDetails = JSON.parse(lifeQuoteAccumulationDetails);
        const updatedSessionData = {
            ...parsedLifeQuoteAccumulationDetails,
            [filterName]: value,
        };
        sessionStorage.setItem("lifeQuoteAccumulationDetails", JSON.stringify(updatedSessionData));

        resetQuoteResults(updatedSessionData);
    };

    useEffect(() => {
        if (lifeQuoteAccumulationDetails) {
            const parsedLifeQuoteAccumulationDetails = JSON.parse(lifeQuoteAccumulationDetails);
            setFaceAmountsState(parsedLifeQuoteAccumulationDetails.faceAmounts);
        }
    }, [lifeQuoteAccumulationDetails]);

    const { payPeriods, loanType, illustratedRate, healthClasses } = useMemo(() => {
        if (lifeQuoteAccumulationDetails) {
            const parsedLifeQuoteAccumulationDetails = JSON.parse(lifeQuoteAccumulationDetails);
            return {
                payPeriods: parsedLifeQuoteAccumulationDetails.payPeriods,
                loanType: parsedLifeQuoteAccumulationDetails.loanType,
                illustratedRate: parsedLifeQuoteAccumulationDetails.illustratedRate,
                healthClasses: parsedLifeQuoteAccumulationDetails.healthClasses,
            };
        }
        return {
            payPeriods: "65",
            loanType: "LoansFixed",
            illustratedRate: "0",
            healthClasses: "S",
        };
    }, [lifeQuoteAccumulationDetails]);

    const carriers = useMemo(() => {
        if (tempUserDetails) {
            const carriersData = tempUserDetails?.map((quote) => {
                return {
                    value: quote.companyName,
                    label: quote.companyName,
                };
            });
            const uniqueCarriers = carriersData.filter(
                (carrier, index, self) => index === self.findIndex((t) => t.value === carrier.value)
            );
            return [{ value: "All carriers", label: "All carriers" }, ...uniqueCarriers];
        }
    }, [tempUserDetails]);

    const getErrorMessage = (value) => {
        try {
            validationSchema.validateSync({ faceAmounts: value });
            return "";
        } catch (error) {
            return error.message;
        }
    };

    const handleFaceAmountsChange = debounce((value) => {
        setFaceAmountsState(value);

        if (!getErrorMessage(value)) {
            handleFiltersChange("faceAmounts", value);
        }
    }, 2000);

    return (
        <>
            {isMobile && !showFilters && (
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<Filter />}
                        onClick={() => setShowFilters(true)}
                        className={styles.filterButton}
                    >
                        Filter Policy
                    </Button>
                </Box>
            )}
            {((isMobile && showFilters) || !isMobile) && (
                <Box>
                    <Box className={styles.filterTitle}>
                        {!isMobile && (
                            <Typography variant="h4" color="#052A63">
                                Filter by
                            </Typography>
                        )}
                    </Box>
                    <Box className={styles.filterContainer}>
                        <Grid container gap={3}>
                            <Grid item md={12} xs={12}>
                                <Typography className={styles.label}> Fixed Annual Premium* </Typography>

                                <CounterInput
                                    onValueChange={(value) => handleFaceAmountsChange(value)}
                                    min={2000}
                                    max={2000000}
                                    initialValue={faceAmountsState}
                                    incrementOrDecrementValue={50}
                                    initialIncrementValue={2000}
                                />

                                <Typography variant="caption" color="red">
                                    {getErrorMessage(faceAmountsState)}
                                </Typography>
                            </Grid>

                            <Grid item md={12} xs={12}>
                                <CollapsibleSection title="Pay Periods">
                                    <Box className={styles.radioOption}>
                                        {PAY_PERIOD_OPTS?.map((option, index) => {
                                            return (
                                                <CustomRadioGroupOption
                                                    name="payPeriods"
                                                    value={option.value}
                                                    label={option.label}
                                                    stateValue={payPeriods}
                                                    onChange={(e) => handleFiltersChange("payPeriods", e.target.value)}
                                                />
                                            );
                                        })}
                                    </Box>
                                </CollapsibleSection>
                            </Grid>

                            <Grid item md={12} xs={12}>
                                <CollapsibleSection title="Loans">
                                    <Box className={styles.radioOption}>
                                        {LOANS_OPTS.map((option, index) => {
                                            return (
                                                <CustomRadioGroupOption
                                                    name="loanType"
                                                    value={option.value}
                                                    label={option.label}
                                                    stateValue={loanType}
                                                    key={`loanType-${index}`}
                                                    onChange={(e) => handleFiltersChange("loanType", e.target.value)}
                                                />
                                            );
                                        })}
                                    </Box>
                                </CollapsibleSection>
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <CollapsibleSection title="Illustrated Rate">
                                    <Box className={styles.radioOption}>
                                        <Grid container spacing={"8px"}>
                                            {ILLUSTRATED_RATE_OPTS.map((option, index) => {
                                                return (
                                                    <Grid item md={4} xs={4} key={`illustratedRate-${index}`}>
                                                        <CustomRadioGroupOption
                                                            name="illustratedRate"
                                                            value={option.value}
                                                            label={option.label}
                                                            stateValue={illustratedRate}
                                                            onChange={(e) =>
                                                                handleFiltersChange("illustratedRate", e.target.value)
                                                            }
                                                        />
                                                    </Grid>
                                                );
                                            })}
                                        </Grid>
                                    </Box>
                                </CollapsibleSection>
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <CollapsibleSection title="Health Classification">
                                    <Box className={styles.radioOption}>
                                        <Grid container spacing={"8px"}>
                                            {HEALTH_CLASSIFICATION_OPTS.map((option, index) => {
                                                return (
                                                    <Grid item md={6} xs={6} key={`healthClasses-${index}`}>
                                                        <CustomRadioGroupOption
                                                            name="healthClasses"
                                                            value={option.value}
                                                            label={option.label}
                                                            stateValue={healthClasses}
                                                            onChange={(e) =>
                                                                handleFiltersChange("healthClasses", e.target.value)
                                                            }
                                                        />
                                                    </Grid>
                                                );
                                            })}
                                        </Grid>
                                    </Box>
                                </CollapsibleSection>
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <CollapsibleSection title="Carriers">
                                    <Box className={styles.radioOption}>
                                        {carriers?.map((option, index) => {
                                            return (
                                                <CustomCheckboxGroupOption
                                                    name="carriers"
                                                    value={option.value}
                                                    label={option.label}
                                                    stateValue={selectedCarriers}
                                                    onChange={handleCarriersChange}
                                                    key={`carriers-${index}`}
                                                />
                                            );
                                        })}
                                    </Box>
                                </CollapsibleSection>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            )}
        </>
    );
};
