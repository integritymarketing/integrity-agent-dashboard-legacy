import { useCallback, useEffect, useMemo, useState } from "react";
import Media from "react-media";
import { useLocation, useParams } from "react-router-dom";

import { Text } from "@integritymarketing/ui-text-components";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import useFetch from "hooks/useFetch";
import usePreferences from "hooks/usePreferences";
import Popover from "components/ui/Popover";

import { ContactProfileTabBar } from "components/ContactDetailsContainer";
import { CurrencyAdjuster } from "components/CurrencyAdjuster";
import {
    AGENT_SERVICE_NON_RTS,
    COVERAGE_AMOUNT,
    MONTHLY_PREMIUM,
    SIMPLIFIED_IUL_TITLE,
} from "components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants";
import CheckedIcon from "components/icons/CheckedIcon";
import UnCheckedIcon from "components/icons/unChecked";
import { Select } from "components/ui/Select";
import { Box, Typography } from "@mui/material";
import { CollapsibleSection } from "@integritymarketing/clients-ui-kit";
import { faCircleInfo } from "@awesome.me/kit-7ab3488df1/icons/classic/light";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    COVERAGE_AMT_VALIDATION,
    COVERAGE_AMT_VALIDATION_SIMPLIFIED_IUL,
    COVERAGE_TYPE,
    COVERAGE_TYPE_HEADING,
    DEFAULT_COVERAGE_AMOUNT,
    DEFAULT_COVERAGE_AMOUNT_SIMPLIFIED_IUL,
    DEFAULT_MONTHLY_PREMIUM,
    DEFAULT_MONTHLY_PREMIUM_SIMPLIFIED_IUL,
    EXCLUDE_LABEL,
    MONTHLY_PREMIUM_VALIDATION,
    MONTHLY_PREMIUM_VALIDATION_SIMPLIFIED_IUL,
    MY_APPOINTED_LABEL,
    PLAN_OPTIONS_HEADING,
    STEPPER_FILTER,
    STEPPER_FILTER_SIMPLIFIED_IUL,
    ALTERNATIVE_PRODUCTS_LABEL,
} from "./FinalExpensePlansResultContainer.constants";
import styles from "./FinalExpensePlansResultContainer.module.scss";
import { PlanDetailsContainer } from "./PlanDetailsContainer/PlanDetailsContainer";
import { useCreateNewQuote } from "../../../providers/CreateNewQuote";
import QuoteConditions from "components/FinalExpenseHealthConditionsContainer/QuoteConditions";
import QuoteOptionsInfoModal from "./InfoModals/QuoteOptionsInfoModal";
import CoverageTypeInfoModal from "./InfoModals/CoverageTypeInfoModal";

const FinalExpensePlansResultContainer = () => {
    const [isMobile, setIsMobile] = useState(false);
    const { contactId } = useParams();

    const [isRTS, setIsRTS] = useState();
    const [quoteOptionsInfoModalOpen, setQuoteOptionsInfoModalOpen] = useState(false);
    const [coverageTypeInfoModalOpen, setCoverageTypeInfoModalOpen] = useState(false);

    const { agentInformation } = useAgentInformationByID();
    const { isSimplifiedIUL } = useCreateNewQuote();

    const agentNPN = agentInformation?.agentNPN;

    const { Get: getAgentNonRTS, loading: getAgentNonRTSLoading } = useFetch(`${AGENT_SERVICE_NON_RTS}${agentNPN}`);

    const [selectedTab, setSelectedTab] = useState(COVERAGE_AMOUNT);

    const stepperFilter = useMemo(() => {
        return isSimplifiedIUL() ? STEPPER_FILTER_SIMPLIFIED_IUL : STEPPER_FILTER;
    }, [isSimplifiedIUL]);

    const { min: covMin, max: covMax, step: covStep } = stepperFilter[COVERAGE_AMOUNT];
    const { min, max, step } = stepperFilter[MONTHLY_PREMIUM];
    const location = useLocation();

    const defaultIsMyAppointedProducts = useMemo(
        () => ({
            contactId: contactId || null,
            preferenceFlag: false,
        }),
        [contactId]
    );

    const defaultCoverageAmount = useMemo(() => {
        return isSimplifiedIUL() ? DEFAULT_COVERAGE_AMOUNT_SIMPLIFIED_IUL : DEFAULT_COVERAGE_AMOUNT;
    }, [isSimplifiedIUL]);

    const defaultMonthlyPremium = useMemo(() => {
        return isSimplifiedIUL() ? DEFAULT_MONTHLY_PREMIUM_SIMPLIFIED_IUL : DEFAULT_MONTHLY_PREMIUM;
    }, [isSimplifiedIUL]);

    const [coverageAmount, setCoverageAmount] = usePreferences(defaultCoverageAmount, "coverage");
    const [monthlyPremiumAmount, setMonthlyPremiumAmount] = usePreferences(defaultMonthlyPremium, "monthlyPremium");
    const [coverageType, setCoverageType] = usePreferences(COVERAGE_TYPE[4].value, "sessionCoverageType");
    const [isMyAppointedProducts, setIsMyAppointedProducts] = usePreferences(
        defaultIsMyAppointedProducts,
        "sessionIsMyAppointedProducts"
    );
    const [appointmentSession, setAppointmentSession] = usePreferences(false, "appointmentSession");
    const [isShowExcludedProducts, setIsShowExcludedProducts] = usePreferences(false, "sessionIsShowExcludedProducts");
    const [sessionLead, setSessionLead] = usePreferences(null, "sessionLead");

    useEffect(() => {
        const handleFinalExpensePlanClick = async () => {
            const isAgentNonRTS = await getAgentNonRTS();
            if (isAgentNonRTS === "True") {
                setIsMyAppointedProducts(false);
                setIsRTS(false);
            } else {
                if (!appointmentSession) {
                    setIsRTS(true);
                } else {
                    setIsRTS(false);
                }
            }
        };
        if (agentNPN) {
            handleFinalExpensePlanClick();
        }
    }, [agentNPN]);

    useEffect(() => {
        if (contactId !== sessionLead) {
            setSessionLead(contactId);
            resetToDefaultPreferences();
        }
    }, [contactId, sessionLead, setSessionLead]);

    useEffect(() => {
        setCoverageAmount(isSimplifiedIUL() ? DEFAULT_COVERAGE_AMOUNT_SIMPLIFIED_IUL : DEFAULT_COVERAGE_AMOUNT);
    }, [isSimplifiedIUL]);

    const resetToDefaultPreferences = () => {
        setCoverageAmount(defaultCoverageAmount);
        setMonthlyPremiumAmount(defaultMonthlyPremium);
        setCoverageType(COVERAGE_TYPE[4].value);
        setIsMyAppointedProducts(defaultIsMyAppointedProducts);
        setIsShowExcludedProducts(false);
        setAppointmentSession(false);
    };

    const updateCoverageAmount = (value) => {
        setCoverageAmount(value);
    };

    const updateMonthlyPremiumAmount = (value) => {
        setMonthlyPremiumAmount(value);
    };

    const increment = () => {
        if (selectedTab === COVERAGE_AMOUNT) {
            if (coverageAmount + covStep <= covMax) {
                updateCoverageAmount(coverageAmount + covStep);
            } else {
                setCoverageAmount(covMax);
            }
        } else {
            if (monthlyPremiumAmount + step <= max) {
                updateMonthlyPremiumAmount(monthlyPremiumAmount + step);
            } else {
                setMonthlyPremiumAmount(max);
            }
        }
    };

    const decrement = () => {
        if (selectedTab === COVERAGE_AMOUNT) {
            if (coverageAmount - covStep >= covMin) {
                updateCoverageAmount(coverageAmount - covStep);
            } else {
                setCoverageAmount(covMin);
            }
        } else {
            if (monthlyPremiumAmount - step >= min) {
                updateMonthlyPremiumAmount(monthlyPremiumAmount - step);
            } else {
                setMonthlyPremiumAmount(min);
            }
        }
    };

    const handleCoverageTypeChange = (value) => {
        setCoverageType(value);
    };

    const handleInputChange = (e) => {
        const value = Number(e.target.value.replace(/[^0-9]/g, "")) || 0;
        if (selectedTab === COVERAGE_AMOUNT) {
            updateCoverageAmount(value);
        } else {
            updateMonthlyPremiumAmount(value);
        }
    };

    const handleTabSelect = (tab) => {
        setSelectedTab(tab);
    };

    const handleMyAppointedProductsCheck = useCallback(
        (isChecked = false) => {
            if (!isRTS) {
                return;
            }
            setIsMyAppointedProducts(isChecked || !isMyAppointedProducts);
        },
        [isRTS, isMyAppointedProducts]
    );

    const handleIsShowExcludedProductsCheck = useCallback(
        (isChecked = false) => {
            setIsShowExcludedProducts(isChecked || !isShowExcludedProducts);
        },
        [isShowExcludedProducts]
    );

    const covAmtError = useMemo(() => {
        return coverageAmount < covMin || coverageAmount > covMax;
    }, [coverageAmount, covMin, covMax]);

    const monthlyPremError = useMemo(() => {
        return monthlyPremiumAmount < min || monthlyPremiumAmount > max;
    }, [monthlyPremiumAmount, min, max]);

    return (
        <>
            <Media
                query={"(max-width: 800px)"}
                onChange={(val) => {
                    setIsMobile(val);
                }}
            />
            <ContactProfileTabBar
                contactId={contactId}
                showTabs={false}
                backButtonLabel={"Back"}
                backButtonRoute={location.state?.from}
            />
            <div className={styles.pageHeading}>
                <Typography variant="h2" color="#052A63">
                    {" "}
                    {isSimplifiedIUL() ? SIMPLIFIED_IUL_TITLE : "Final Expense"}
                </Typography>
            </div>
            <div className={`${styles.contentWrapper} ${isMobile ? styles.column : ""}`}>
                <div className={styles.filterContent}>
                    <CurrencyAdjuster
                        stepperValue={selectedTab === COVERAGE_AMOUNT ? coverageAmount : monthlyPremiumAmount}
                        selectedTab={selectedTab}
                        setSelectedTab={handleTabSelect}
                        disableMin={
                            selectedTab === COVERAGE_AMOUNT ? coverageAmount <= covMin : monthlyPremiumAmount <= min
                        }
                        disableMax={
                            selectedTab === COVERAGE_AMOUNT ? coverageAmount >= covMax : monthlyPremiumAmount >= max
                        }
                        increment={increment}
                        decrement={decrement}
                        onChange={handleInputChange}
                        inputErrorStyle={
                            (covAmtError && selectedTab === COVERAGE_AMOUNT) ||
                            (monthlyPremError && selectedTab === MONTHLY_PREMIUM)
                                ? styles.inputError
                                : ""
                        }
                    />
                    {selectedTab === COVERAGE_AMOUNT && covAmtError && (
                        <div className={styles.error}>
                            {isSimplifiedIUL() ? COVERAGE_AMT_VALIDATION_SIMPLIFIED_IUL : COVERAGE_AMT_VALIDATION}
                        </div>
                    )}
                    {selectedTab === MONTHLY_PREMIUM && monthlyPremError && (
                        <div className={styles.error}>
                            {isSimplifiedIUL() ? MONTHLY_PREMIUM_VALIDATION_SIMPLIFIED_IUL : MONTHLY_PREMIUM_VALIDATION}
                        </div>
                    )}
                    <div className={styles.planOptionsBox}>
                        <Box>
                            <Box className={styles.filterHeader}>
                                <Typography variant="h4" color="#052A63" padding="16px">
                                    Filter by
                                </Typography>
                            </Box>

                            <Box padding="24px">
                                {!isSimplifiedIUL() && (
                                    <Box>
                                        <CollapsibleSection
                                            title="Select Coverage Type"
                                            togglePosition="left"
                                            infoIcon={
                                                <Box
                                                    onClick={() => setCoverageTypeInfoModalOpen(true)}
                                                    sx={{ cursor: "pointer" }}
                                                >
                                                    <FontAwesomeIcon icon={faCircleInfo} color="blue" />
                                                </Box>
                                            }
                                        >
                                            <Select
                                                initialValue={coverageType}
                                                onChange={handleCoverageTypeChange}
                                                options={COVERAGE_TYPE}
                                                selectContainerClassName={styles.selectCoverageType}
                                                showValueAlways
                                            />
                                        </CollapsibleSection>
                                    </Box>
                                )}
                                <Box marginTop={!isSimplifiedIUL() ? 2 : 0}>
                                    <CollapsibleSection
                                        title="Quote Options"
                                        togglePosition="left"
                                        infoIcon={
                                            <Box
                                                onClick={() => setQuoteOptionsInfoModalOpen(true)}
                                                sx={{ cursor: "pointer" }}
                                            >
                                                <FontAwesomeIcon icon={faCircleInfo} color="blue" />
                                            </Box>
                                        }
                                    >
                                        <div className={styles.checkboxesWrapper}>
                                            <div
                                                className={`${styles.checkbox} ${
                                                    isMyAppointedProducts ? styles.selectedCheckbox : ""
                                                } ${!isRTS ? styles.inActive : ""}`}
                                                onClick={() => handleMyAppointedProductsCheck(!isMyAppointedProducts)}
                                            >
                                                {isMyAppointedProducts ? <CheckedIcon /> : <UnCheckedIcon />}{" "}
                                                <Typography variant="body2" color="#434A51">
                                                    {MY_APPOINTED_LABEL}
                                                </Typography>
                                            </div>
                                            <div
                                                className={`${styles.checkbox} ${
                                                    isShowExcludedProducts ? styles.selectedCheckbox : ""
                                                }`}
                                                onClick={() =>
                                                    handleIsShowExcludedProductsCheck(!isShowExcludedProducts)
                                                }
                                            >
                                                {isShowExcludedProducts ? <CheckedIcon /> : <UnCheckedIcon />}{" "}
                                                <Typography variant="body2" color="#434A51">
                                                    {EXCLUDE_LABEL}
                                                </Typography>
                                            </div>
                                            <div
                                                className={`${styles.checkbox} ${
                                                    isShowExcludedProducts ? styles.selectedCheckbox : ""
                                                }`}
                                                onClick={() => {}}
                                            >
                                                {false ? <CheckedIcon /> : <UnCheckedIcon />}{" "}
                                                <Typography variant="body2" color="#434A51">
                                                    {ALTERNATIVE_PRODUCTS_LABEL}
                                                </Typography>
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                </Box>
                                {!isSimplifiedIUL() && (
                                    <Box marginTop={2}>
                                        <CollapsibleSection
                                            title="Rate Class"
                                            togglePosition="left"
                                            infoIcon={
                                                <Popover
                                                    openOn="hover"
                                                    description="Select the rating classes displayed in results. Note: Some products may have additional qualifications for preferred rates.  Please validate eligibility with the carrier when applying for preferred rates"
                                                    positions={isMobile ? ["bottom"] : ["right", "bottom"]}
                                                >
                                                    <FontAwesomeIcon icon={faCircleInfo} color="blue" />
                                                </Popover>
                                            }
                                        >
                                            <div className={styles.checkboxesWrapper}>
                                                <div
                                                    className={`${styles.checkbox} ${
                                                        isMyAppointedProducts ? styles.selectedCheckbox : ""
                                                    } ${!isRTS ? styles.inActive : ""}`}
                                                    onClick={() =>
                                                        handleMyAppointedProductsCheck(!isMyAppointedProducts)
                                                    }
                                                >
                                                    {isMyAppointedProducts ? <CheckedIcon /> : <UnCheckedIcon />}{" "}
                                                    <Typography variant="body2" color="#434A51">
                                                        Standard
                                                    </Typography>
                                                </div>
                                                <div
                                                    className={`${styles.checkbox} ${
                                                        isShowExcludedProducts ? styles.selectedCheckbox : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleIsShowExcludedProductsCheck(!isShowExcludedProducts)
                                                    }
                                                >
                                                    {isShowExcludedProducts ? <CheckedIcon /> : <UnCheckedIcon />}{" "}
                                                    <Typography variant="body2" color="#434A51">
                                                        Preferred
                                                    </Typography>
                                                </div>
                                                <div
                                                    className={`${styles.checkbox} ${
                                                        isShowExcludedProducts ? styles.selectedCheckbox : ""
                                                    }`}
                                                    onClick={() => {}}
                                                >
                                                    {false ? <CheckedIcon /> : <UnCheckedIcon />}{" "}
                                                    <Typography variant="body2" color="#434A51">
                                                        Super Preferred
                                                    </Typography>
                                                </div>
                                                <div
                                                    className={`${styles.checkbox} ${
                                                        isShowExcludedProducts ? styles.selectedCheckbox : ""
                                                    }`}
                                                    onClick={() => {}}
                                                >
                                                    {false ? <CheckedIcon /> : <UnCheckedIcon />}{" "}
                                                    <Typography variant="body2" color="#434A51">
                                                        Sub Standard
                                                    </Typography>
                                                </div>
                                            </div>
                                        </CollapsibleSection>
                                    </Box>
                                )}
                                <Box marginTop={2}>
                                    <CollapsibleSection
                                        title="Conditions"
                                        togglePosition="left"
                                        infoIcon={
                                            <Popover
                                                openOn="hover"
                                                description="The conditions you have entered here are filtering your quote results to plans which you are likely eligible"
                                                positions={isMobile ? ["bottom"] : ["right", "bottom"]}
                                            >
                                                <FontAwesomeIcon icon={faCircleInfo} color="blue" />
                                            </Popover>
                                        }
                                    >
                                        <QuoteConditions contactId={contactId} />
                                    </CollapsibleSection>
                                </Box>
                            </Box>
                        </Box>
                    </div>
                </div>
                <QuoteOptionsInfoModal
                    open={quoteOptionsInfoModalOpen}
                    onClose={() => setQuoteOptionsInfoModalOpen(false)}
                />
                <CoverageTypeInfoModal
                    open={coverageTypeInfoModalOpen}
                    onClose={() => setCoverageTypeInfoModalOpen(false)}
                />
                {!getAgentNonRTSLoading && (
                    <PlanDetailsContainer
                        coverageAmount={coverageAmount}
                        monthlyPremium={monthlyPremiumAmount}
                        coverageType={coverageType}
                        handleTabSelect={handleTabSelect}
                        selectedTab={selectedTab}
                        isMyAppointedProducts={isMyAppointedProducts}
                        isShowExcludedProducts={isShowExcludedProducts}
                        handleMyAppointedProductsCheck={handleMyAppointedProductsCheck}
                        handleIsShowExcludedProductsCheck={handleIsShowExcludedProductsCheck}
                        isRTS={isRTS}
                        setIsRTS={setIsRTS}
                    />
                )}
                <div className={styles.resultContent}></div>
            </div>
        </>
    );
};

export default FinalExpensePlansResultContainer;
