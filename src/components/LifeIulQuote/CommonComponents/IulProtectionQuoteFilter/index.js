import React, { useCallback, useMemo } from "react";
import { Box, Typography, Grid, useTheme, useMediaQuery, Button } from "@mui/material";
import CounterInput from "components/LifeForms/common/CounterInput";
import {
    PROTECTION_PAY_PERIOD_OPTS,
    PROTECTION_ILLUSTRATED_RATE_OPTS,
    PROTECTION_PRODUCT_SOLVES,
    HEALTH_CLASSIFICATION_OPTS,
} from "../constants";
import CustomRadioGroupOption from "components/LifeForms/common/CustomRadioGroupOption/CustomRadioGroupOption";
import CollapsibleSection from "components/LifeIulQuote/CommonComponents/CollapsibleSection";
import CustomCheckboxGroupOption from "components/LifeForms/common/CustomCheckboxGroupOption/CustomCheckboxGroupOption";
import { useLifeIulQuote } from "providers/Life";
import Filter from "components/icons/LifeIul/filter";
import styles from "./styles.module.scss";

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

    const resetQuoteResults = useCallback(
        async (updatedSessionData) => {
            const { birthDate, gender, state, healthClasses, faceAmounts, payPeriods, illustratedRate, solves } =
                updatedSessionData;

            const payload = {
                inputs: [
                    {
                        birthDate: birthDate,
                        gender: gender,
                        healthClasses: [healthClasses],
                        state: state,
                        faceAmounts: faceAmounts,
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

    const { faceAmounts, payPeriods, illustratedRate, healthClasses, solves } = useMemo(() => {
        if (lifeQuoteProtectionDetails) {
            const parsedLifeQuoteProtectionDetails = JSON.parse(lifeQuoteProtectionDetails);
            return {
                faceAmounts: parsedLifeQuoteProtectionDetails.faceAmounts,
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
                                        onValueChange={(value) => handleFiltersChange("faceAmounts", value, 0)}
                                        min={2000}
                                        max={2000000}
                                        initialValue={faceAmounts[0]}
                                        incrementOrDecrementValue={50}
                                        inputStyles={{ padding: "23.1px 14px" }}
                                    />
                                </Box>
                                <Box marginBottom={1}>
                                    <CounterInput
                                        onValueChange={(value) => handleFiltersChange("faceAmounts", value, 1)}
                                        min={2000}
                                        max={2000000}
                                        initialValue={faceAmounts[1]}
                                        incrementOrDecrementValue={50}
                                        inputStyles={{ padding: "23.1px 14px" }}
                                    />
                                </Box>
                                <Box marginBottom={1}>
                                    <CounterInput
                                        onValueChange={(value) => handleFiltersChange("faceAmounts", value, 2)}
                                        min={2000}
                                        max={2000000}
                                        initialValue={faceAmounts[2]}
                                        incrementOrDecrementValue={50}
                                        inputStyles={{ padding: "23.1px 14px" }}
                                    />
                                </Box>
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
