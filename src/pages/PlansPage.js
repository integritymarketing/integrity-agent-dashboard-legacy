import * as Sentry from "@sentry/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import Media from "react-media";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useHealth } from "providers/ContactDetails/ContactDetailsContext";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { addProviderModalAtom, showViewAvailablePlansAtom } from "recoil/providerInsights/atom.js";

import { getFirstEffectiveDateOption } from "utils/dates";
import { formatDate } from "utils/dates";
import getNextAEPEnrollmentYear from "utils/getNextAEPEnrollmentYear";
import { scrollTop } from "utils/shared-utils/sharedUtility";

import useAnalytics from "hooks/useAnalytics";
import useFetch from "hooks/useFetch";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import useRoles from "hooks/useRoles";

import closeAudio from "../components/WebChat/close.mp3";
import CMSCompliance from "components/CMSCompliance";
import { ContactProfileTabBar } from "components/ContactDetailsContainer/ContactProfileTabBar";
import NonRTSBanner from "components/Non-RTS-Banner";
import ProviderModal from "components/SharedModals/ProviderModal";
import WebChatComponent from "components/WebChat/WebChat";
import Filter from "components/icons/filter";
import SortIcon from "components/icons/sort";
import AdditionalFilters from "components/ui/AdditionalFilters";
import { BackToTop } from "components/ui/BackToTop";
import { Button } from "components/ui/Button";
import ContactEdit from "components/ui/ContactEdit";
import EffectiveDateFilter from "components/ui/EffectiveDateFilter";
import Pagination from "components/ui/Pagination/pagination";
import PharmacyFilter from "components/ui/PharmacyFilter";
import PlanTypesFilter, { planTypesMap } from "components/ui/PlanTypesFilter";
import Radio from "components/ui/Radio";
import { Select } from "components/ui/Select";
import WithLoader from "components/ui/WithLoader";
import Container from "components/ui/container";
import PlanResults, { convertPlanTypeToValue } from "components/ui/plan-results";

import FocusedNav from "partials/focused-nav";
import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";

import analyticsService from "services/analyticsService";
import clientsService from "services/clientsService";
import plansService from "services/plansService";

import ViewAvailablePlans from "../pages/contacts/contactRecordInfo/viewAvailablePlans";

import { PlanPageFooter } from "./PlanPageFooter";
import styles from "./PlansPage.module.scss";

import { PLAN_SORT_OPTIONS, PLAN_TYPE_ENUMS } from "../constants";

const premAsc = (res1, res2) => {
    return res1.annualPlanPremium / 12 > res2.annualPlanPremium / 12
        ? 1
        : res1.annualPlanPremium / 12 < res2.annualPlanPremium / 12
        ? -1
        : 0;
};
const premDsc = (res1, res2) => {
    return res1.annualPlanPremium / 12 < res2.annualPlanPremium / 12
        ? 1
        : res1.annualPlanPremium / 12 > res2.annualPlanPremium / 12
        ? -1
        : 0;
};
const ratings = (res1, res2) => {
    return res1.planRating < res2.planRating ? 1 : res1.planRating > res2.planRating ? -1 : 0;
};
const drugsPrice = (res1, res2) => {
    return res1.estimatedAnnualDrugCost / 12 > res2.estimatedAnnualDrugCost / 12
        ? 1
        : res1.estimatedAnnualDrugCost / 12 < res2.estimatedAnnualDrugCost / 12
        ? -1
        : 0;
};
const pocketAsc = (res1, res2) => {
    return res1.maximumOutOfPocketCost < res2.maximumOutOfPocketCost
        ? -1
        : res1.maximumOutOfPocketCost > res2.maximumOutOfPocketCost
        ? 1
        : 0;
};
const getSortFunction = (sort) => {
    if (sort === PLAN_SORT_OPTIONS[1].value) {
        return premDsc;
    }
    if (sort === PLAN_SORT_OPTIONS[2].value) {
        return ratings;
    }
    if (sort === PLAN_SORT_OPTIONS[3].value) {
        return drugsPrice;
    }
    if (sort === PLAN_SORT_OPTIONS[4].value) {
        return pocketAsc;
    } else {
        return premAsc;
    }
};

function getPlansAvailableSection(planCount, totalPlanCount, plansLoading, planType, isMobile) {
    const planTypeString = convertPlanTypeToValue(planType, planTypesMap);
    if (plansLoading) {
        return <div />;
    } else if (isMobile) {
        return (
            <div className={`${styles["plans-available"]}`}>
                <span className={`${styles["plans-type"]}`}>{planCount || 0} plans available</span>
            </div>
        );
    } else {
        return (
            <div className={`${styles["plans-available"]}`}>
                <span className={`${styles["plans-type"]}`}>
                    {planCount || 0} {planTypeString} plans
                </span>
                {` based on your filters`}
            </div>
        );
    }
}

const currentYear = new Date().getFullYear();
const currentPlanYear = getNextAEPEnrollmentYear();

const EFFECTIVE_YEARS_SUPPORTED =
    currentPlanYear === currentYear ? [currentYear] : [currentYear, currentPlanYear].sort((a, b) => a - b);

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const PlansPage = () => {
    const { contactId: id } = useParams();
    const { fireEvent } = useAnalytics();
    const query = useQuery();
    const showSelected = query && query.get("preserveSelected");
    const jsonStr = sessionStorage.getItem("__plans__");

    const {
        plans: initialPlans,
        effectiveDate: initialEffectiveDate,
        planType: initialPlanType,
        s_options,
    } = jsonStr ? JSON.parse(jsonStr) : {};

    const initialeffDate =
        showSelected && initialEffectiveDate
            ? new Date(initialEffectiveDate)
            : getFirstEffectiveDateOption(EFFECTIVE_YEARS_SUPPORTED);

    const initialSelectedPlans = initialPlans && showSelected ? initialPlans : [];

    const { isNonRTS_User } = useRoles();

    const MY_APPOINTED_PLANS = isNonRTS_User ? false : showSelected ? s_options?.s_myAppointedPlans : true;

    const navigate = useNavigate();
    const location = useLocation();
    const [contact, setContact] = useState();
    const [plansAvailableCount, setPlansAvailableCount] = useState(0);
    const [filteredPlansCount, setFilteredPlansCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [plansLoading, setPlansLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [myAppointedPlans, setMyAppointedPlans] = useState(false);
    const [section, setSection] = useState("details");
    const [sort, setSort] = useState(showSelected ? s_options?.s_sort : PLAN_SORT_OPTIONS[0].value);
    const [isEdit, setIsEdit] = useState(false);
    const [effectiveDate, setEffectiveDate] = useState(initialeffDate);
    const [results, setResults] = useState([]);
    const [providers, setProviders] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [pharmacies, setPharmacies] = useState([]);
    const [selectedPlans, setSelectedPlans] = useState(
        initialSelectedPlans.reduce((acc, p) => {
            acc[p.id] = true;
            return acc;
        }, {})
    );
    const [showViewAvailablePlans, setShowViewAvailablePlans] = useRecoilState(showViewAvailablePlansAtom);
    const showViewAvailablePlansRef = useRef(showViewAvailablePlans);
    const audioRefClose = useRef(null);
    const isAddProviderModalOpen = useRecoilValue(addProviderModalAtom);
    const setModalOpen = useSetRecoilState(addProviderModalAtom);
    const { Post: postSpecialists } = useFetch(
        `${process.env.REACT_APP_QUOTE_URL}/Rxspecialists/${id}?api-version=1.0`
    );
    const [rXToSpecialists, setRXToSpecialists] = useState([]);
    const shouldShowAskIntegrity = useRecoilValue(showViewAvailablePlansAtom);

    const { fetchPrescriptions, fetchPharmacies, fetchProviders } = useHealth() || {};

    useEffect(() => {
        if (id) {
            fetchHealthDetails();
        }
    }, [id]);

    const fetchHealthDetails = useCallback(async () => {
        await Promise.all([fetchPrescriptions(id), fetchPharmacies(id), fetchProviders(id)]);
    }, [id, fetchPrescriptions, fetchPharmacies, fetchProviders]);

    useEffect(() => {
        setMyAppointedPlans(MY_APPOINTED_PLANS);
    }, [isNonRTS_User, MY_APPOINTED_PLANS]);

    useOnClickOutside(showViewAvailablePlansRef, () => {
        if (isAddProviderModalOpen === false) {
            setShowViewAvailablePlans(false);
            playCloseAudio();
        }
    });

    const playCloseAudio = () => {
        if (audioRefClose.current) {
            audioRefClose.current.play().catch((error) => {
                console.error("Error playing open audio:", error);
            });
        }
    };

    const getContactRecordInfo = useCallback(async () => {
        setLoading(true);
        try {
            const [contactData, prescriptionData, providerData, pharmacyData] = await Promise.all([
                clientsService.getContactInfo(id),
                clientsService.getLeadPrescriptions(id),
                clientsService.getLeadProviders(id),
                clientsService.getLeadPharmacies(id),
            ]);
            setContact(contactData);
            setProviders(providerData.providers);
            setPrescriptions(prescriptionData);
            setPharmacies(pharmacyData);
            const { birthdate, shouldHideSpecialistPrompt } = contactData;
            const payload = {
                birthDate: birthdate,
                rxDetails: prescriptionData?.map(({ dosage: { ndc, drugName } }) => ({
                    ndc,
                    drugName,
                })),
                providerDetails: providerData?.providers?.map(({ presentationName, specialty }) => ({
                    providerName: presentationName,
                    providerSpecialty: specialty,
                })),
            };
            const data = await postSpecialists(payload);
            const shouldShowSpecialistPrompt =
                prescriptionData?.length > 0 &&
                providerData?.providers?.length > 0 &&
                !shouldHideSpecialistPrompt &&
                data?.shouldShow;
            //for testing keep !
            if (shouldShowSpecialistPrompt) {
                setShowViewAvailablePlans(true);
                setRXToSpecialists(data);
            }
            analyticsService.fireEvent("event-content-load", {
                pagePath: "/plans/:contactId",
            });
        } catch (e) {
            Sentry.captureException(e);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, postSpecialists, setShowViewAvailablePlans]);

    const [currentPage, setCurrentPage] = useState(1);
    const [planType, setPlanType] = useState((showSelected ? initialPlanType : null) || location.state?.planType || 2);
    const [carrierList, setCarrierList] = useState([]);
    const [subTypeList, setSubTypeList] = useState([]);
    const [pagedResults, setPagedResults] = useState([]);
    const [carrierFilters, setCarrierFilters] = useState(
        showSelected && s_options?.s_carrierFilters ? s_options?.s_carrierFilters : []
    );
    const [policyFilters, setPolicyFilters] = useState(
        showSelected && s_options?.s_policyFilters ? s_options?.s_policyFilters : []
    );
    const [rebatesFilter, setRebatesFilter] = useState(
        showSelected && s_options?.s_rebatesFilter ? s_options?.s_rebatesFilter : false
    );
    const [specialNeedsFilter, setSpecialNeedsFilter] = useState(
        showSelected && s_options?.s_specialNeedsFilter ? s_options?.s_specialNeedsFilter : false
    );
    const [filtersOpen, setfiltersOpen] = useState(false);
    const [sort_mobile, setSort_mobile] = useState(sort);
    const [planType_mobile, setPlanType_mobile] = useState(planType);
    const [effectiveDate_mobile, setEffectiveDate_mobile] = useState(effectiveDate);
    const [myAppointedPlans_mobile, setMyAppointedPlans_mobile] = useState(myAppointedPlans);
    const [specialNeedsFilter_mobile, setSpecialNeedsFilter_mobile] = useState(specialNeedsFilter);
    const [rebatesFilter_mobile, setRebatesFilter_mobile] = useState(rebatesFilter);
    const [policyFilters_mobile, setPolicyFilters_mobile] = useState(policyFilters);
    const [carrierFilters_mobile, setCarrierFilters_mobile] = useState(carrierFilters);

    const toggleAppointedPlans = (e) => {
        healthQuoteResultsUpdatedEvent("my_appointed_plans", e.target.checked);
        if (isMobile) {
            setMyAppointedPlans_mobile(e.target.checked);
        } else {
            setMyAppointedPlans(e.target.checked);
        }
    };
    const toggleNeeds = (e) => {
        healthQuoteResultsUpdatedEvent("special_needs", e.target.checked);

        if (isMobile) {
            setSpecialNeedsFilter_mobile(e.target.checked);
        } else {
            setSpecialNeedsFilter(e.target.checked);
        }
    };
    const toggleRebates = (e) => {
        healthQuoteResultsUpdatedEvent("includes_part_b_rebates", e.target.checked);

        if (isMobile) {
            setRebatesFilter_mobile(e.target.checked);
        } else {
            setRebatesFilter(e.target.checked);
        }
    };

    const healthQuoteResultsUpdatedEvent = (key, value) => {
        HealthQuoteResultsEvent("Health Quote Results Updated", key, value);
    };

    const HealthQuoteResultsEvent = (event, key, value) => {
        let enabledFilters = [];
        if (myAppointedPlans) {
            enabledFilters.push("my_appointed_plans");
        }
        if (specialNeedsFilter) {
            enabledFilters.push("special_needs");
        }
        if (rebatesFilter) {
            enabledFilters.push("includes_part_b_rebates");
        }
        if (key && value !== undefined) {
            if (value) {
                enabledFilters.push(key);
            } else {
                enabledFilters = enabledFilters.filter((filter) => filter !== key);
            }
        }

        fireEvent(event, {
            leadid: id,
            line_of_business: "Health",
            product_type: `${PLAN_TYPE_ENUMS[planType]?.toLowerCase()}`,
            enabled_filters: enabledFilters,
        });
    };

    const changeFilters = (e) => {
        const { checked, value, name } = e.target;
        let policy_filters = isMobile ? policyFilters_mobile : policyFilters;
        let carrier_filters = isMobile ? carrierFilters_mobile : carrierFilters;
        const list = name === "policy" ? policy_filters : carrier_filters;
        let resultingList = [];
        if (checked === true) {
            resultingList = [...new Set([...list, value])];
        } else {
            resultingList = [...list].filter((item) => item !== value);
        }
        if (name === "policy" && isMobile) {
            setPolicyFilters_mobile(resultingList);
        } else if (name === "policy" && !isMobile) {
            setPolicyFilters(resultingList);
        }

        if (name === "carrier" && isMobile) {
            setCarrierFilters_mobile(resultingList);
        } else if (name === "carrier" && !isMobile) {
            setCarrierFilters(resultingList);
        }
    };
    const changeEffectiveDate = (value) => {
        if (isMobile) {
            setEffectiveDate_mobile(value);
        } else {
            setEffectiveDate(value);
        }
        healthQuoteResultsUpdatedEvent();
    };

    const changePlanType = (value) => {
        if (isMobile) {
            setPlanType_mobile(value);
        } else {
            setPlanType(value);
            navigate({ state: { planType: parseInt(value) } });
        }
        setSelectedPlans({});
        healthQuoteResultsUpdatedEvent();
    };

    const refreshPlans = useCallback(async () => {
        if (contact) {
            setPlansAvailableCount(0);
            setFilteredPlansCount(0);
            setPlansLoading(true);
            try {
                setResults([]);
                setSubTypeList([]);
                setCarrierList([]);
                const plansData = await plansService.getPlans(contact.leadsId, {
                    fips: contact.addresses?.[0].countyFips.toString(),
                    zip: contact.addresses?.[0].postalCode.toString(),
                    year: effectiveDate.getFullYear(),
                    ReturnAllMedicarePlans: !myAppointedPlans,
                    ShowFormulary: true,
                    ShowPharmacy: true,
                    PlanType: planType,
                    effectiveDate: `${effectiveDate.getFullYear()}-${effectiveDate.getMonth() + 1}-01`,
                });
                setPlansAvailableCount(plansData?.medicarePlans?.length);
                setCurrentPage(1);
                setResults(plansData?.medicarePlans);
                const carriers = [...new Set(plansData?.medicarePlans.map((plan) => plan.marketingName))];
                const subTypes = [...new Set(plansData?.medicarePlans.map((plan) => plan?.planSubType || "PDP"))];
                setSubTypeList(subTypes);
                setCarrierList(carriers);
            } catch (e) {
                Sentry.captureException(e);
            } finally {
                setPlansLoading(false);
            }
        }
    }, [contact, effectiveDate, planType, myAppointedPlans]);

    useEffect(() => {
        HealthQuoteResultsEvent("Health Quote Results Viewed");
    }, []);

    const getAllPlans = useCallback(async () => {
        if (contact) {
            setPlansAvailableCount(0);
            setFilteredPlansCount(0);
            setPlansLoading(true);
            try {
                setResults([]);
                setSubTypeList([]);
                setCarrierList([]);
                const plansData = await plansService.getPlans(contact.leadsId, {
                    fips: contact.addresses?.[0].countyFips.toString(),
                    zip: contact.addresses?.[0].postalCode.toString(),
                    year: effectiveDate.getFullYear(),
                    ReturnAllMedicarePlans: !myAppointedPlans,
                    ShowFormulary: true,
                    ShowPharmacy: true,
                    PlanType: planType,
                    effectiveDate: `${effectiveDate.getFullYear()}-${effectiveDate.getMonth() + 1}-01`,
                });
                setPlansAvailableCount(plansData?.medicarePlans?.length);
                setCurrentPage(1);
                setResults(plansData?.medicarePlans);
                const carriers = [...new Set(plansData?.medicarePlans.map((plan) => plan.marketingName))];
                const subTypes = [...new Set(plansData?.medicarePlans.map((plan) => plan?.planSubType || "PDP"))];
                setSubTypeList(subTypes);
                setCarrierList(carriers);
                analyticsService.fireEvent("event-quoting-plans");
            } catch (e) {
                Sentry.captureException(e);
            } finally {
                setPlansLoading(false);
            }
        }
    }, [contact, effectiveDate, planType, myAppointedPlans]);

    const pageSize = 10;

    useEffect(() => {
        const pagedStart = (currentPage - 1) * pageSize;
        const pageLimit = pageSize * currentPage;
        const sortFunction = getSortFunction(sort);
        const resultsList = results || [];
        const carrierGroup =
            carrierFilters?.length > 0
                ? resultsList?.filter((res) => carrierFilters?.includes(res.marketingName))
                : resultsList;
        const policyGroup =
            policyFilters?.length > 0
                ? carrierGroup.filter((res) => policyFilters?.includes(res.planSubType))
                : carrierGroup;
        const specialNeedsPlans = specialNeedsFilter
            ? [...policyGroup].filter((plan) => plan?.planName.includes("SNP"))
            : policyGroup;

        const rebatePlans = rebatesFilter
            ? [...specialNeedsPlans].filter((plan) => {
                  if (plan.planDataFields && plan.planDataFields.length > 0) {
                      return plan.planDataFields.find((detail) =>
                          detail.name.toLowerCase().includes("part b giveback")
                      );
                  } else {
                      return false;
                  }
              })
            : specialNeedsPlans;

        const sortedResults = [...rebatePlans]?.sort(sortFunction);
        setFilteredPlansCount(sortedResults?.length || 0);
        const slicedResults = [...sortedResults]?.slice(pagedStart, pageLimit);
        setPagedResults(slicedResults);
        // scrolling to top of the page while displaying new set of plans list with pagination
        scrollTop();
    }, [results, currentPage, pageSize, sort, carrierFilters, policyFilters, rebatesFilter, specialNeedsFilter]);

    useEffect(() => {
        getContactRecordInfo();
    }, [getContactRecordInfo]);

    useEffect(() => {
        getAllPlans();
    }, [getAllPlans]);

    const openFilters = () => {
        setMyAppointedPlans_mobile(myAppointedPlans);
        setEffectiveDate_mobile(effectiveDate);
        setCarrierFilters_mobile(carrierFilters);
        setPolicyFilters_mobile(policyFilters);
        setRebatesFilter_mobile(rebatesFilter);
        setSpecialNeedsFilter_mobile(specialNeedsFilter);
        setPlanType_mobile(planType);
        setSort_mobile(sort);
        setfiltersOpen(true);
    };

    const resetFilters = () => {
        setMyAppointedPlans_mobile(true);
        setEffectiveDate_mobile(getFirstEffectiveDateOption(EFFECTIVE_YEARS_SUPPORTED));
        setCarrierFilters_mobile([]);
        setPolicyFilters_mobile([]);
        setRebatesFilter_mobile(false);
        setSpecialNeedsFilter_mobile(false);
        setPlanType_mobile(2);
        setSort_mobile(PLAN_SORT_OPTIONS[0].value);
    };

    const applyFilters = () => {
        setMyAppointedPlans(myAppointedPlans_mobile);
        setEffectiveDate(effectiveDate_mobile);
        setCarrierFilters(carrierFilters_mobile);
        setPolicyFilters(policyFilters_mobile);
        setRebatesFilter(rebatesFilter_mobile);
        setSpecialNeedsFilter(specialNeedsFilter_mobile);
        setPlanType(planType_mobile);
        setSort(sort_mobile);
        setfiltersOpen(false);
    };
    let selectedOptions = {
        s_sort: sort,
        s_carrierFilters: carrierFilters,
        s_policyFilters: policyFilters,
        s_rebatesFilter: rebatesFilter,
        s_specialNeedsFilter: specialNeedsFilter,
        s_myAppointedPlans: myAppointedPlans,
    };

    const setSessionData = () => {
        let s_plans = results?.filter((plan) => selectedPlans[plan.id]);
        sessionStorage.setItem(
            "__plans__",
            JSON.stringify({
                plans: s_plans,
                effectiveDate: effectiveDate,
                planType,
                s_options: selectedOptions,
            })
        );
    };
    const isLoading = loading;
    const { firstName = "", lastName = "", birthdate = "", leadsId = "" } = contact || {};
    const toSentenceCase = (name) => name?.charAt(0).toUpperCase() + name?.slice(1).toLowerCase();
    const fullName = `${toSentenceCase(firstName)} ${toSentenceCase(lastName)}`;
    const userZipCode = contact?.addresses?.[0]?.postalCode;
    return (
        <>
            <audio ref={audioRefClose} src={closeAudio} />
            {showViewAvailablePlans && (
                <>
                    <div className={styles.backdrop} />
                    <ViewAvailablePlans
                        providers={providers}
                        prescriptions={prescriptions}
                        fullName={fullName}
                        birthdate={birthdate}
                        leadsId={leadsId}
                        showViewAvailablePlansRef={showViewAvailablePlansRef}
                        showViewAvailablePlans={showViewAvailablePlans}
                        personalInfo={contact}
                        rXToSpecialists={rXToSpecialists}
                        setShowViewAvailablePlans={setShowViewAvailablePlans}
                    />
                </>
            )}
            {isAddProviderModalOpen && (
                <ProviderModal
                    open={isAddProviderModalOpen}
                    onClose={() => {
                        setModalOpen(false);
                    }}
                    userZipCode={userZipCode}
                    leadId={leadsId}
                />
            )}
            <div className={`${styles["plans-page"]}`}>
                <Media
                    query={"(max-width: 500px)"}
                    onChange={(isMobile) => {
                        setIsMobile(isMobile);
                    }}
                />
                <WithLoader isLoading={isLoading}>
                    {!shouldShowAskIntegrity && <WebChatComponent />}
                    <Helmet>
                        <title>Integrity - Plans</title>
                    </Helmet>
                    <GlobalNav />
                    {!isEdit || (isEdit && isMobile)}
                    {(isEdit || (isMobile && filtersOpen)) && (
                        <FocusedNav
                            backText={"Back to plans page"}
                            onBackClick={() => {
                                if (isEdit) {
                                    getContactRecordInfo();
                                }
                                setfiltersOpen(false);
                                setIsEdit(false);
                                window.location = `/plans/${id}?preserveSelected=true`;
                            }}
                        />
                    )}
                    {((contact && !isEdit && !isMobile) || (isMobile && !filtersOpen && !isEdit)) && (
                        <ContactProfileTabBar contactId={id} />
                    )}

                    {isMobile && !filtersOpen && !isEdit && (
                        <Button
                            icon={<Filter />}
                            label={"Filter Plans"}
                            onClick={openFilters}
                            type="secondary"
                            className={`${styles["filter-plans-btn"]}`}
                        />
                    )}

                    {!isEdit && (
                        <>
                            {isNonRTS_User && <NonRTSBanner />}
                            <Container className={`${styles["search-container"]}`}>
                                {(!isMobile || (isMobile && filtersOpen)) && (
                                    <div className={`${styles["filters"]}`}>
                                        {isMobile && (
                                            <>
                                                <div className={`${styles["plans-count-mobile"]}`}>
                                                    {getPlansAvailableSection(
                                                        filteredPlansCount,
                                                        plansAvailableCount,
                                                        plansLoading,
                                                        planType,
                                                        isMobile
                                                    )}
                                                </div>

                                                <div className={`${styles["filter-section"]}`}>
                                                    <div className="header">Sort By</div>

                                                    {effectiveDate &&
                                                        PLAN_SORT_OPTIONS.map((sortOption, sortIndex) => {
                                                            return (
                                                                <Radio
                                                                    id={sortOption.label}
                                                                    key={`${sortOption.label} - ${sortIndex}`}
                                                                    name="sortBy"
                                                                    value={sortOption.value}
                                                                    label={sortOption.label}
                                                                    checked={sort_mobile === sortOption.value}
                                                                    onChange={() => setSort_mobile(sortOption.value)}
                                                                />
                                                            );
                                                        })}
                                                </div>
                                            </>
                                        )}
                                        <div className={`${styles["filter-section"]}`}>
                                            {effectiveDate && (
                                                <PlanTypesFilter
                                                    changeFilter={changePlanType}
                                                    initialValue={isMobile ? planType_mobile : planType}
                                                />
                                            )}
                                        </div>
                                        <div className={`${styles["filter-section"]}`}>
                                            {effectiveDate && (
                                                <EffectiveDateFilter
                                                    years={EFFECTIVE_YEARS_SUPPORTED}
                                                    initialValue={isMobile ? effectiveDate_mobile : effectiveDate}
                                                    onChange={(date) => changeEffectiveDate(date)}
                                                />
                                            )}
                                        </div>

                                        <div className={`${styles["filter-section"]}`}>
                                            {effectiveDate && (
                                                <PharmacyFilter pharmacies={pharmacies} onChange={() => {}} />
                                            )}
                                        </div>

                                        <div className={`${styles["filter-section"]}`}>
                                            {effectiveDate && (
                                                <AdditionalFilters
                                                    planType={planType}
                                                    onChange={() => {}}
                                                    toggleAppointedPlans={toggleAppointedPlans}
                                                    carriers={carrierList}
                                                    policyTypes={subTypeList}
                                                    onFilterChange={changeFilters}
                                                    toggleRebates={toggleRebates}
                                                    toggleNeeds={toggleNeeds}
                                                    myAppointedPlans={
                                                        isMobile ? myAppointedPlans_mobile : myAppointedPlans
                                                    }
                                                    carrierFilters={isMobile ? carrierFilters_mobile : carrierFilters}
                                                    policyFilters={isMobile ? policyFilters_mobile : policyFilters}
                                                    rebatesFilter={isMobile ? rebatesFilter_mobile : rebatesFilter}
                                                    specialNeedsFilter={
                                                        isMobile ? specialNeedsFilter_mobile : specialNeedsFilter
                                                    }
                                                    isNonRTS_User={isNonRTS_User}
                                                />
                                            )}
                                        </div>
                                        {isMobile && (
                                            <div className={`${styles["filter-btn-section"]}`}>
                                                <Button
                                                    label={"Reset Filters"}
                                                    onClick={resetFilters}
                                                    type="secondary"
                                                    className={`${styles["filter-grey-btn"]}`}
                                                />
                                                <Button
                                                    label={"Apply"}
                                                    onClick={applyFilters}
                                                    type="primary"
                                                    className={`${styles["filter-blue-btn"]}`}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                                {((isMobile && !filtersOpen) || !isMobile) && (
                                    <div className={`${styles["results"]}`}>
                                        {!isNonRTS_User && (
                                            <CMSCompliance
                                                leadId={contact?.leadsId}
                                                countyFips={contact?.addresses?.[0]?.countyFips}
                                                postalCode={contact?.addresses?.[0]?.postalCode}
                                            />
                                        )}

                                        <div className={`${styles["sort"]}`}>
                                            {getPlansAvailableSection(
                                                filteredPlansCount,
                                                plansAvailableCount,
                                                plansLoading,
                                                planType,
                                                isMobile
                                            )}
                                            {!isMobile && (
                                                <div className={`${styles["sort-select"]}`}>
                                                    <Select
                                                        mobileLabel={<SortIcon />}
                                                        initialValue={sort}
                                                        onChange={(value) => setSort(value)}
                                                        options={PLAN_SORT_OPTIONS}
                                                        prefix="Sort by: "
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className={`${styles["plans"]}`}>
                                            <PlanResults
                                                plans={pagedResults}
                                                isMobile={isMobile}
                                                loading={plansLoading}
                                                effectiveDate={effectiveDate}
                                                contact={contact}
                                                leadId={id}
                                                pharmacies={pharmacies}
                                                planType={planType}
                                                selectedPlans={selectedPlans}
                                                setSelectedPlans={setSelectedPlans}
                                                setSessionData={setSessionData}
                                                refresh={refreshPlans}
                                            />
                                            {!plansLoading && filteredPlansCount > 0 && (
                                                <div>
                                                    <BackToTop />
                                                    <Pagination
                                                        currentPage={currentPage}
                                                        resultName="plans"
                                                        totalPages={Math.ceil(filteredPlansCount / 10)}
                                                        totalResults={filteredPlansCount}
                                                        pageSize={pageSize}
                                                        onPageChange={(page) => setCurrentPage(page)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Container>
                        </>
                    )}
                    {isEdit && (
                        <Container className={`${styles["edit-container"]}`}>
                            <ContactEdit
                                leadId={id}
                                personalInfo={contact}
                                initialSection={section}
                                initialEdit={isEdit}
                                getContactRecordInfo={getContactRecordInfo}
                                successNavigationRoute={`/plans/${id}`}
                                isMobile={isMobile}
                                page={"plansPage"}
                            />
                        </Container>
                    )}
                    <GlobalFooter />
                    <PlanPageFooter
                        leadId={id}
                        effectiveDate={formatDate(effectiveDate, "yyyy-MM-01")}
                        plans={results?.filter((plan) => selectedPlans[plan.id])}
                        onRemove={(plan) => {
                            setSelectedPlans((prev) => ({ ...prev, [plan.id]: false }));
                        }}
                        setSessionData={setSessionData}
                        isMobile={isMobile}
                    />
                </WithLoader>
            </div>
        </>
    );
};

export default PlansPage;
