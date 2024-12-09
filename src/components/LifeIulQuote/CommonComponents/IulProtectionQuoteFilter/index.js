import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Box, Typography, Grid, useTheme, useMediaQuery, Button } from "@mui/material";
import CounterInput from "components/LifeForms/common/CounterInput";
import {
    PROTECTION_PAY_PERIOD_OPTS,
    PROTECTION_ILLUSTRATED_RATE_OPTS,
    PROTECTION_PRODUCT_SOLVES,
    HEALTH_CLASSIFICATION_OPTS,
} from "../constants";
import CustomRadioGroupOption from "components/LifeForms/common/CustomRadioGroupOption/CustomRadioGroupOption";
import { CollapsibleSection } from "@integritymarketing/clients-ui-kit";
import CustomCheckboxGroupOption from "components/LifeForms/common/CustomCheckboxGroupOption/CustomCheckboxGroupOption";
import { useLifeIulQuote } from "providers/Life";
import Filter from "components/icons/LifeIul/filter";
import styles from "./styles.module.scss";
import { debounce } from "lodash";

export const IulProtectionQuoteFilter = () => {
    const {
        fetchLifeIulQuoteResults,
        tempUserDetails,
        selectedCarriers,
        handleCarriersChange,
        showFilters,
        setShowFilters,
    } = useLifeIulQuote();

    const lifeQuoteProtectionDetails = sessionStorage.getItem("lifeQuoteProtectionDetails");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [faceAmount1, setFaceAmount1] = useState(0);
    const [faceAmount2, setFaceAmount2] = useState(0);
    const [faceAmount3, setFaceAmount3] = useState(0);
    const [commonError, setCommonError] = useState("");

    const validateFaceAmounts = (amount1, amount2, amount3) => {
        if (!amount1 && !amount2 && !amount3) {
            return "At least one Death Benefit is required.";
        }
        const amounts = [amount1, amount2, amount3].filter((val) => val > 0);
        if (new Set(amounts).size !== amounts.length) {
            return "Death Benefits cannot be duplicate.";
        }
        if (amount1 && (amount1 < 2000 || amount1 > 2000000)) {
            return "Death Benefit 1 must be between 2000 and 2000000.";
        }
        if (amount2 && (amount2 < 2000 || amount2 > 3000000)) {
            return "Death Benefit 2 must be between 2000 and 3000000.";
        }
        if (amount3 && (amount3 < 2000 || amount3 > 4000000)) {
            return "Death Benefit 3 must be between 2000 and 4000000.";
        }
        return "";
    };

    const resetQuoteResults = useCallback(
        async (updatedSessionData) => {
            const { birthDate, gender, state, healthClasses, faceAmounts, payPeriods, illustratedRate, solves } =
                updatedSessionData;

            const filteredFaceAmounts = faceAmounts.filter((amount) => Boolean(amount));

            const payload = {
                inputs: [
                    {
                        birthDate: birthDate,
                        gender: gender,
                        healthClasses: [healthClasses],
                        state: state,
                        faceAmounts: filteredFaceAmounts,
                        solves: [solves],
                        payPeriods: [payPeriods],
                        props: {
                            illustratedRate: illustratedRate,
                        },
                    },
                ],
                quoteType: "IULPROT-SOLVE",
            };
            await fetchLifeIulQuoteResults(payload);
        },
        [fetchLifeIulQuoteResults]
    );

    const handleFiltersChange = (filterName, value, index) => {
        let parsedLifeQuoteProtectionDetails = JSON.parse(lifeQuoteProtectionDetails);
        if (filterName === "faceAmounts") {
            parsedLifeQuoteProtectionDetails[filterName][index] = value.toString();
        } else {
            parsedLifeQuoteProtectionDetails = {
                ...parsedLifeQuoteProtectionDetails,
                [filterName]: value,
            };
        }
        sessionStorage.setItem("lifeQuoteProtectionDetails", JSON.stringify(parsedLifeQuoteProtectionDetails));
        resetQuoteResults(parsedLifeQuoteProtectionDetails);
    };

    useEffect(() => {
        if (lifeQuoteProtectionDetails) {
            const parsedLifeQuoteProtectionDetails = JSON.parse(lifeQuoteProtectionDetails);
            const amount1 = parsedLifeQuoteProtectionDetails.faceAmounts[0] || 0;
            const amount2 = parsedLifeQuoteProtectionDetails.faceAmounts[1] || 0;
            const amount3 = parsedLifeQuoteProtectionDetails.faceAmounts[2] || 0;
            setFaceAmount1(parseInt(amount1));
            setFaceAmount2(parseInt(amount2));
            setFaceAmount3(parseInt(amount3));
        }
    }, [lifeQuoteProtectionDetails]);

    const { payPeriods, illustratedRate, healthClasses, solves } = useMemo(() => {
        if (lifeQuoteProtectionDetails) {
            const parsedLifeQuoteProtectionDetails = JSON.parse(lifeQuoteProtectionDetails);
            return {
                payPeriods: parsedLifeQuoteProtectionDetails.payPeriods,
                loanType: parsedLifeQuoteProtectionDetails.loanType,
                illustratedRate: parsedLifeQuoteProtectionDetails.illustratedRate,
                healthClasses: parsedLifeQuoteProtectionDetails.healthClasses,
                solves: parsedLifeQuoteProtectionDetails.solves,
            };
        }
        return {
            faceAmounts: 2000,
            payPeriods: "65",
            loanType: "LoansFixed",
            illustratedRate: "0",
            healthClasses: "S",
        };
    }, [lifeQuoteProtectionDetails]);

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

    const handleFaceAmountsChange = debounce((value, index) => {
        const updatedValues = {
            faceAmounts1: index === 0 ? value : faceAmount1,
            faceAmounts2: index === 1 ? value : faceAmount2,
            faceAmounts3: index === 2 ? value : faceAmount3,
        };

        const { faceAmounts1, faceAmounts2, faceAmounts3 } = updatedValues;
        setFaceAmount1(faceAmounts1);
        setFaceAmount2(faceAmounts2);
        setFaceAmount3(faceAmounts3);

        const error = validateFaceAmounts(faceAmounts1, faceAmounts2, faceAmounts3);
        setCommonError(error);

        if (!error) {
            handleFiltersChange("faceAmounts", value, index);
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
                                <Typography className={styles.label}> Death Benefits </Typography>
                                <Box marginBottom={1}>
                                    <CounterInput
                                        onValueChange={(value) => handleFaceAmountsChange(value, 0)}
                                        min={2000}
                                        max={2000000}
                                        initialValue={faceAmount1}
                                        incrementOrDecrementValue={10000}
                                        initialIncrementValue={2000}
                                    />
                                </Box>
                                <Box marginBottom={1}>
                                    <CounterInput
                                        onValueChange={(value) => handleFaceAmountsChange(value, 1)}
                                        min={2000}
                                        max={3000000}
                                        initialValue={faceAmount2}
                                        incrementOrDecrementValue={10000}
                                        initialIncrementValue={2000}
                                    />
                                </Box>
                                <Box marginBottom={1}>
                                    <CounterInput
                                        onValueChange={(value) => handleFaceAmountsChange(value, 2)}
                                        min={2000}
                                        max={4000000}
                                        initialValue={faceAmount3}
                                        incrementOrDecrementValue={10000}
                                        initialIncrementValue={2000}
                                    />
                                </Box>
                                {commonError && (
                                    <Typography variant="caption" color="red">
                                        {commonError}
                                    </Typography>
                                )}
                            </Grid>

                            <Grid item md={12} xs={12}>
                                <CollapsibleSection title="Pay Periods">
                                    <Box className={styles.radioOption}>
                                        {PROTECTION_PAY_PERIOD_OPTS?.map((option, index) => {
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
                                <CollapsibleSection title="Product Solves">
                                    <Box className={styles.radioOption}>
                                        {PROTECTION_PRODUCT_SOLVES.map((option, index) => {
                                            return (
                                                <CustomRadioGroupOption
                                                    name="solves"
                                                    value={option.value}
                                                    label={option.label}
                                                    stateValue={solves}
                                                    onChange={(e) => handleFiltersChange("solves", e.target.value)}
                                                    key={`productSolves-${index}`}
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
                                            {PROTECTION_ILLUSTRATED_RATE_OPTS.map((option, index) => {
                                                return (
                                                    <Grid item md={3} xs={6} key={`illustratedRate-${index}`}>
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