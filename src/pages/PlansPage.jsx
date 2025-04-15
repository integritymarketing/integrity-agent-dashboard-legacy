import * as Sentry from '@sentry/react';
import { useCallback, useEffect, useRef, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Media from 'react-media';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useHealth } from 'providers/ContactDetails/ContactDetailsContext';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  addProviderModalAtom,
  showViewAvailablePlansAtom,
} from 'src/recoil/providerInsights/atom.jsx';

import { getFirstEffectiveDateOption, formatDate } from 'utils/dates';

import getNextAEPEnrollmentYear from 'utils/getNextAEPEnrollmentYear';
import { scrollTop } from 'utils/shared-utils/sharedUtility';

import useAnalytics from 'hooks/useAnalytics';
import useFetch from 'hooks/useFetch';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import useRoles from 'hooks/useRoles';

import closeAudio from '../components/WebChat/close.mp3';
import CMSCompliance from 'components/CMSCompliance';
import CurrentCarrierSummaryBanner from 'components/CurrentCarrierSummaryBanner';
import NonRTSBanner from 'components/Non-RTS-Banner';
import ProviderModal from 'components/SharedModals/ProviderModal';
import WebChatComponent from 'components/WebChat/WebChat';
import Filter from 'components/icons/filter';
import SortIcon from 'components/icons/sort';
import AdditionalFilters from 'components/ui/AdditionalFilters';
import { BackToTop } from 'components/ui/BackToTop';
import { Button } from 'components/ui/Button';
import EffectiveDateFilter from 'components/ui/EffectiveDateFilter';
import PharmacyFilter from 'components/ui/PharmacyFilter';
import PlanTypesFilter, { planTypesMap } from 'components/ui/PlanTypesFilter';
import Radio from 'components/ui/Radio';
import { Select } from 'components/ui/Select';
import WithLoader from 'components/ui/WithLoader';
import Container from 'components/ui/container';
import PlanResults, {
  convertPlanTypeToValue,
} from 'components/ui/plan-results';
import ConditionalProfileBar from 'components/QuickerQuote/Common/ConditionalProfileBar';
import GlobalFooter from 'partials/global-footer';
import GlobalNav from 'partials/global-nav-v2';

import analyticsService from 'services/analyticsService';
import { useClientServiceContext } from 'services/clientServiceProvider';
import { useLeadDetails } from 'providers/ContactDetails';

import ViewAvailablePlans from '../pages/contacts/contactRecordInfo/viewAvailablePlans';
import PreEnrollPDFModal from 'components/SharedModals/PreEnrollPdf';
import SaveToContact from 'components/QuickerQuote/Common/SaveToContact';
import EnrollmentModal from 'components/ui/Enrollment/enrollment-modal';
import { useCreateNewQuote } from 'providers/CreateNewQuote';

import { PlanPageFooter } from './PlanPageFooter';
import styles from './PlansPage.module.scss';

import {
  PLAN_SORT_OPTIONS,
  PLAN_TYPE_ENUMS,
  MAPD,
  MA,
  PDP,
} from '../constants';
import { Box, Typography } from '@mui/material';
import { QUOTE_TYPE_LABEL } from 'components/ContactDetailsContainer/OverviewContainer/overviewContainer.constants';
import { PaginationBar } from '@integritymarketing/clients-ui-kit';

const buildSortOptions = dictionary => {
  const labels = Object.values(dictionary);
  const keys = Object.keys(dictionary);

  return labels.map((item, index) => {
    return {
      ...item,
      value: keys[index],
    };
  });
};

const getSortFunction = sort => PLAN_SORT_OPTIONS[sort]?.sort;

function getPlansAvailableSection(
  planCount,
  totalPlanCount,
  plansLoading,
  planType,
  isMobile
) {
  const planTypeString = convertPlanTypeToValue(planType, planTypesMap);
  if (plansLoading) {
    return <div />;
  } else if (isMobile) {
    return (
      <div className={`${styles['plans-available']}`}>
        <span className={`${styles['plans-type']}`}>
          {planCount || 0} plans available
        </span>
      </div>
    );
  } else {
    return (
      <div className={`${styles['plans-available']}`}>
        <span className={`${styles['plans-type']}`}>
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
  currentPlanYear === currentYear
    ? [currentYear]
    : [currentYear, currentPlanYear].sort((a, b) => a - b);

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const PlansPage = () => {
  const { contactId: id } = useParams();
  const { fireEvent } = useAnalytics();
  const query = useQuery();
  const showSelected = query && query.get('preserveSelected');
  const jsonStr = sessionStorage.getItem('__plans__');

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

  const MY_APPOINTED_PLANS = isNonRTS_User
    ? false
    : showSelected
    ? s_options?.s_myAppointedPlans
    : true;
  const { clientsService, plansService } = useClientServiceContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [plansAvailableCount, setPlansAvailableCount] = useState(0);
  const [filteredPlansCount, setFilteredPlansCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [myAppointedPlans, setMyAppointedPlans] = useState(false);
  const [sort, setSort] = useState(
    showSelected ? s_options?.s_sort : 'total-asc'
  );
  const [effectiveDate, setEffectiveDate] = useState(initialeffDate);
  const [results, setResults] = useState([]);
  const [providers, setProviders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState(
    initialSelectedPlans.reduce((acc, p) => {
      acc[p.id] = true;
      return acc;
    }, {})
  );

  const [showViewAvailablePlans, setShowViewAvailablePlans] = useRecoilState(
    showViewAvailablePlansAtom
  );
  const showViewAvailablePlansRef = useRef(showViewAvailablePlans);
  const audioRefClose = useRef(null);
  const isAddProviderModalOpen = useRecoilValue(addProviderModalAtom);
  const setModalOpen = useSetRecoilState(addProviderModalAtom);
  const { Post: postSpecialists } = useFetch(
    `${import.meta.env.VITE_QUOTE_URL}/Rxspecialists/${id}?api-version=1.0`
  );
  const [rXToSpecialists, setRXToSpecialists] = useState([]);
  const shouldShowAskIntegrity = useRecoilValue(showViewAvailablePlansAtom);

  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [enrollingPlan, setEnrollingPlan] = useState();
  const [preCheckListPdfModal, setPreCheckListPdfModal] = useState(false);
  const [contactSearchModalOpen, setContactSearchModalOpen] = useState(false);
  const [linkToExistContactId, setLinkToExistContactId] = useState(null);

  const { pharmacies, fetchPharmacies, fetchPrescriptions, fetchProviders } =
    useHealth() || {};

  const { leadDetails, getLeadDetails } = useLeadDetails();
  const { isQuickQuotePage } = useCreateNewQuote();

  useEffect(() => {
    if (id) {
      fetchHealthDetails();
    }
  }, [id]);

  useEffect(() => {
    if (!leadDetails && id && !isQuickQuotePage) {
      getLeadDetails(id);
    }
  }, [id, getLeadDetails, leadDetails, isQuickQuotePage]);

  const fetchHealthDetails = useCallback(async () => {
    await Promise.all([
      fetchPrescriptions(id),
      fetchPharmacies(id),
      fetchProviders(id),
    ]);
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
      audioRefClose.current.play().catch(error => {
        console.error('Error playing open audio:', error);
      });
    }
  };

  const getContactRecordInfo = useCallback(async () => {
    setLoading(true);
    try {
      const [prescriptionData, providerData, pharmacyData] = await Promise.all([
        clientsService.getLeadPrescriptions(id),
        clientsService.getLeadProviders(id),
        clientsService.getLeadPharmacies(id),
      ]);

      checkForCurrentCarrierSummary(contactData);

      setProviders(providerData.providers);
      setPrescriptions(prescriptionData);

      const { birthdate, shouldHideSpecialistPrompt } = contactData;
      const payload = {
        birthDate: birthdate,
        rxDetails: prescriptionData?.map(({ dosage: { ndc, drugName } }) => ({
          ndc,
          drugName,
        })),
        providerDetails: providerData?.providers?.map(
          ({ presentationName, specialty }) => ({
            providerName: presentationName,
            providerSpecialty: specialty,
          })
        ),
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
      analyticsService.fireEvent('event-content-load', {
        pagePath: '/plans/:contactId',
      });
    } catch (e) {
      Sentry.captureException(e);
    } finally {
      setLoading(false);
    }
  }, [id, postSpecialists, setShowViewAvailablePlans]);

  const [showCurrentCarrierSummary, setShowCurrentCarrierSummary] =
    useState(false);

  const checkForCurrentCarrierSummary = contactData => {
    const currentCarrierTag = contactData.leadTags.find(t => {
      const labelMatches =
        t.interactionUrlLabel?.toLowerCase() === 'current carrier plans';
      if (!labelMatches) {
        return false;
      }
      const [, currentCarrierQuery] = t.interactionUrl.split('?');
      const urlMatches = `?${currentCarrierQuery}` === window.location.search;
      return labelMatches && urlMatches;
    });
    if (currentCarrierTag) {
      const [, currentCarrierQuery] =
        currentCarrierTag.interactionUrl.split('?');
      if (`?${currentCarrierQuery}` === window.location.search) {
        setCarrierFilters([query.get('carrierName')]);
        setPlanType(Number(query.get('planType')));
        setMyAppointedPlans(false);
        if (isMobile) {
          setCarrierFilters_mobile([query.get('carrierName')]);
          setPlanType_mobile(Number(query.get('planType')));
          setMyAppointedPlans_mobile(false);
        }
        setShowCurrentCarrierSummary(true);
      }
    }
  };

  const handleClearSummaryBanner = () => {
    setMyAppointedPlans(MY_APPOINTED_PLANS);
    setCarrierFilters([]);
    if (isMobile) {
      setMyAppointedPlans_mobile(MY_APPOINTED_PLANS);
      setCarrierFilters_mobile([]);
    }
    history.pushState(null, '', window.location.href.split('?')[0]);
    setShowCurrentCarrierSummary(false);
    refreshPlans();
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [planType, setPlanType] = useState(
    (showSelected ? initialPlanType : null) || location.state?.planType || 2
  );
  const [carrierList, setCarrierList] = useState([]);
  const [subTypeList, setSubTypeList] = useState([]);
  const [pagedResults, setPagedResults] = useState([]);
  const [carrierFilters, setCarrierFilters] = useState(
    showSelected && s_options?.s_carrierFilters
      ? s_options?.s_carrierFilters
      : []
  );
  const [policyFilters, setPolicyFilters] = useState(
    showSelected && s_options?.s_policyFilters ? s_options?.s_policyFilters : []
  );
  const [rebatesFilter, setRebatesFilter] = useState(
    showSelected && s_options?.s_rebatesFilter
      ? s_options?.s_rebatesFilter
      : false
  );
  const [specialNeedsFilter, setSpecialNeedsFilter] = useState(
    showSelected && s_options?.s_specialNeedsFilter
      ? s_options?.s_specialNeedsFilter
      : false
  );
  const [filtersOpen, setfiltersOpen] = useState(false);
  const [sort_mobile, setSort_mobile] = useState(sort);
  const [planType_mobile, setPlanType_mobile] = useState(planType);
  const [effectiveDate_mobile, setEffectiveDate_mobile] =
    useState(effectiveDate);
  const [myAppointedPlans_mobile, setMyAppointedPlans_mobile] =
    useState(myAppointedPlans);
  const [specialNeedsFilter_mobile, setSpecialNeedsFilter_mobile] =
    useState(specialNeedsFilter);
  const [rebatesFilter_mobile, setRebatesFilter_mobile] =
    useState(rebatesFilter);
  const [policyFilters_mobile, setPolicyFilters_mobile] =
    useState(policyFilters);
  const [carrierFilters_mobile, setCarrierFilters_mobile] =
    useState(carrierFilters);

  const toggleAppointedPlans = e => {
    healthQuoteResultsUpdatedEvent('my_appointed_plans', e.target.checked);
    if (isMobile) {
      setMyAppointedPlans_mobile(e.target.checked);
    } else {
      setMyAppointedPlans(e.target.checked);
    }
  };
  const toggleNeeds = e => {
    healthQuoteResultsUpdatedEvent('special_needs', e.target.checked);

    if (isMobile) {
      setSpecialNeedsFilter_mobile(e.target.checked);
    } else {
      setSpecialNeedsFilter(e.target.checked);
    }
  };
  const toggleRebates = e => {
    healthQuoteResultsUpdatedEvent('includes_part_b_rebates', e.target.checked);

    if (isMobile) {
      setRebatesFilter_mobile(e.target.checked);
    } else {
      setRebatesFilter(e.target.checked);
    }
  };

  const healthQuoteResultsUpdatedEvent = (key, value) => {
    healthQuoteResultsEvent('Health Quote Results Updated', key, value);
  };

  const healthQuoteResultsEvent = (event, key, value) => {
    let enabledFilters = [];
    let planTypeValue = PLAN_TYPE_ENUMS[planType]?.toLowerCase();
    if (myAppointedPlans) {
      enabledFilters.push('my_appointed_plans');
    }
    if (specialNeedsFilter) {
      enabledFilters.push('special_needs');
    }
    if (rebatesFilter) {
      enabledFilters.push('includes_part_b_rebates');
    }
    if (key && key !== 'planType' && value !== undefined) {
      if (value) {
        enabledFilters.push(key);
      } else {
        enabledFilters = enabledFilters.filter(filter => filter !== key);
      }
    }
    if (key === 'planType') {
      planTypeValue = PLAN_TYPE_ENUMS[value]?.toLowerCase();
    }

    fireEvent(event, {
      leadid: id,
      line_of_business: 'Health',
      product_type: planTypeValue,
      enabled_filters: enabledFilters,
    });
  };

  const changeFilters = e => {
    setShowCurrentCarrierSummary(false);
    const { checked, value, name } = e.target;
    const policy_filters = isMobile ? policyFilters_mobile : policyFilters;
    const carrier_filters = isMobile ? carrierFilters_mobile : carrierFilters;
    const list = name === 'policy' ? policy_filters : carrier_filters;
    let resultingList = [];
    if (checked === true) {
      resultingList = [...new Set([...list, value])];
    } else {
      resultingList = [...list].filter(item => item !== value);
    }
    if (name === 'policy' && isMobile) {
      setPolicyFilters_mobile(resultingList);
    } else if (name === 'policy' && !isMobile) {
      setPolicyFilters(resultingList);
    }

    if (name === 'carrier' && isMobile) {
      setCarrierFilters_mobile(resultingList);
    } else if (name === 'carrier' && !isMobile) {
      setCarrierFilters(resultingList);
    }
  };
  const changeEffectiveDate = value => {
    if (isMobile) {
      setEffectiveDate_mobile(value);
    } else {
      setEffectiveDate(value);
    }
    healthQuoteResultsUpdatedEvent();
  };

  const changePlanType = value => {
    if (isMobile) {
      setPlanType_mobile(value);
    } else {
      setPlanType(value);
      navigate({
        pathname: location.pathname, // Keep the current path
        search: location.search, // Retain the current query string (e.g., ?quick-quote=true)
        state: { planType: parseInt(value) },
      });
    }
    setSelectedPlans({});
    healthQuoteResultsUpdatedEvent('planType', value);
  };

  const refreshPlans = useCallback(async () => {
    if (leadDetails) {
      setPlansAvailableCount(0);
      setFilteredPlansCount(0);
      setPlansLoading(true);
      try {
        setResults([]);
        setSubTypeList([]);
        setCarrierList([]);
        const params = {
          fips: leadDetails.addresses?.[0].countyFips.toString(),
          zip: leadDetails.addresses?.[0].postalCode.toString(),
          year: effectiveDate.getFullYear(),
          ReturnAllMedicarePlans: !myAppointedPlans,
          ShowFormulary: true,
          ShowPharmacy: true,
          PlanType: planType,
          effectiveDate: `${effectiveDate.getFullYear()}-${
            effectiveDate.getMonth() + 1
          }-01`,
        };
        const plansData = await plansService.getPlans(
          leadDetails.leadsId,
          params
        );
        setPlansAvailableCount(plansData?.medicarePlans?.length);
        setCurrentPage(1);
        setResults(plansData?.medicarePlans);
        const carriers = [
          ...new Set(plansData?.medicarePlans.map(plan => plan.marketingName)),
        ];
        const subTypes = [
          ...new Set(
            plansData?.medicarePlans.map(plan => plan?.planSubType || 'PDP')
          ),
        ];
        setSubTypeList(subTypes);
        setCarrierList(carriers);
      } catch (e) {
        Sentry.captureException(e);
      } finally {
        setPlansLoading(false);
      }
    }
  }, [leadDetails, effectiveDate, planType, myAppointedPlans, pharmacies]);

  useEffect(() => {
    if (
      pharmacies?.length > 0 &&
      pharmacies.find(pharmacy => pharmacy.isPrimary)
    ) {
      refreshPlans();
    }
  }, [refreshPlans, pharmacies]);

  useEffect(() => {
    const timer = setTimeout(() => {
      healthQuoteResultsEvent('Health Quote Results Viewed');
    }, 10000);
    return () => clearTimeout(timer);
  }, [myAppointedPlans]);

  useEffect(() => {
    if (leadDetails && leadDetails?.hasMedicAid && !isQuickQuotePage) {
      setSpecialNeedsFilter(true);
      setSpecialNeedsFilter_mobile(true);
    }
  }, [leadDetails, isQuickQuotePage]);

  const getAllPlans = useCallback(async () => {
    if (leadDetails) {
      setPlansAvailableCount(0);
      setFilteredPlansCount(0);
      setPlansLoading(true);
      try {
        setResults([]);
        setSubTypeList([]);
        setCarrierList([]);
        const params = {
          fips: leadDetails.addresses?.[0].countyFips.toString(),
          zip: leadDetails.addresses?.[0].postalCode.toString(),
          year: effectiveDate.getFullYear(),
          ReturnAllMedicarePlans: !myAppointedPlans,
          ShowFormulary: true,
          ShowPharmacy: true,
          PlanType: planType,
          effectiveDate: `${effectiveDate.getFullYear()}-${
            effectiveDate.getMonth() + 1
          }-01`,
        };
        const plansData = await plansService.getPlans(
          leadDetails.leadsId,
          params
        );
        setPlansAvailableCount(plansData?.medicarePlans?.length);
        setCurrentPage(1);
        setResults(plansData?.medicarePlans);
        const carriers = [
          ...new Set(plansData?.medicarePlans.map(plan => plan.marketingName)),
        ];
        const subTypes = [
          ...new Set(
            plansData?.medicarePlans.map(plan => plan?.planSubType || 'PDP')
          ),
        ];
        setSubTypeList(subTypes);
        setCarrierList(carriers);
        analyticsService.fireEvent('event-quoting-plans');
      } catch (e) {
        Sentry.captureException(e);
      } finally {
        setPlansLoading(false);
      }
    }
  }, [leadDetails, effectiveDate, planType, myAppointedPlans]);

  const pageSize = 10;

  useEffect(() => {
    const pagedStart = (currentPage - 1) * pageSize;
    const pageLimit = pageSize * currentPage;
    const sortFunction = getSortFunction(sort);

    const resultsList = results || [];
    const carrierGroup =
      carrierFilters?.length > 0
        ? resultsList?.filter(res =>
            carrierFilters?.includes(res.marketingName)
          )
        : resultsList;
    const policyGroup =
      policyFilters?.length > 0
        ? carrierGroup.filter(res => policyFilters?.includes(res.planSubType))
        : carrierGroup;

    const specialNeedsPlans = specialNeedsFilter
      ? policyGroup.filter(plan => plan?.planName.includes('SNP'))
      : policyGroup.filter(plan =>
          planType === 2 ? !plan?.planName.includes('SNP') : true
        );

    const rebatePlans = rebatesFilter
      ? [...specialNeedsPlans].filter(plan => {
          if (plan.planDataFields && plan.planDataFields.length > 0) {
            return plan.planDataFields.find(detail =>
              detail.name.toLowerCase().includes('part b giveback')
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
    scrollTop();
  }, [
    results,
    currentPage,
    pageSize,
    sort,
    carrierFilters,
    policyFilters,
    rebatesFilter,
    specialNeedsFilter,
  ]);

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
    setEffectiveDate_mobile(
      getFirstEffectiveDateOption(EFFECTIVE_YEARS_SUPPORTED)
    );
    setCarrierFilters_mobile([]);
    setPolicyFilters_mobile([]);
    setRebatesFilter_mobile(false);
    setSpecialNeedsFilter_mobile(false);
    setPlanType_mobile(2);
    setSort_mobile('total-asc');
  };

  const applyFilters = () => {
    setShowCurrentCarrierSummary(false);
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
  const selectedOptions = {
    s_sort: sort,
    s_carrierFilters: carrierFilters,
    s_policyFilters: policyFilters,
    s_rebatesFilter: rebatesFilter,
    s_specialNeedsFilter: specialNeedsFilter,
    s_myAppointedPlans: myAppointedPlans,
  };

  const setSessionData = () => {
    const s_plans = results?.filter(plan => selectedPlans[plan.id]);
    sessionStorage.setItem(
      '__plans__',
      JSON.stringify({
        plans: s_plans,
        effectiveDate: effectiveDate,
        planType,
        s_options: selectedOptions,
      })
    );
  };
  const isLoading = loading;
  const {
    firstName = '',
    lastName = '',
    birthdate = '',
    leadsId = '',
  } = leadDetails || {};
  const toSentenceCase = name =>
    name?.charAt(0).toUpperCase() + name?.slice(1).toLowerCase();
  const fullName = `${toSentenceCase(firstName)} ${toSentenceCase(lastName)}`;
  const userZipCode = leadDetails?.addresses?.[0]?.postalCode;

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
            personalInfo={leadDetails}
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
      <div className={`${styles['plans-page']}`}>
        <Media
          query={'(max-width: 500px)'}
          onChange={isMobileDevice => {
            setIsMobile(isMobileDevice);
          }}
        />
        <WithLoader isLoading={isLoading}>
          {!shouldShowAskIntegrity && <WebChatComponent />}
          <Helmet>
            <title>Integrity - Plans</title>
          </Helmet>
          <GlobalNav showQuoteType={QUOTE_TYPE_LABEL.MEDICARE} />

          {((leadDetails && !isMobile) || (isMobile && !filtersOpen)) && (
            <ConditionalProfileBar leadId={id} page='healthPlans' />
          )}

          {isMobile && !filtersOpen && (
            <Button
              icon={<Filter />}
              label={'Filter Plans'}
              onClick={openFilters}
              type='secondary'
              className={`${styles['filter-plans-btn']}`}
            />
          )}

          <>
            <Box sx={{ padding: '56px 24px', pb: 0 }}>
              <Box sx={{ pb: 3 }} display={'flex'} justifyContent={'center'}>
                <Typography variant='h2' gutterBottom color={'#052a63'}>
                  {planType === 2 && MAPD}
                  {planType === 4 && MA}
                  {planType === 1 && PDP}
                </Typography>
              </Box>
            </Box>
            {isNonRTS_User && <NonRTSBanner />}

            <Container className={`${styles['search-container']}`}>
              {(!isMobile || (isMobile && filtersOpen)) && (
                <div className={`${styles['filters']}`}>
                  {!isNonRTS_User && !isMobile && showCurrentCarrierSummary && (
                    <CMSCompliance
                      leadId={leadDetails?.leadsId}
                      countyFips={leadDetails?.addresses?.[0]?.countyFips}
                      postalCode={leadDetails?.addresses?.[0]?.postalCode}
                    />
                  )}
                  {isMobile && (
                    <>
                      <div className={`${styles['plans-count-mobile']}`}>
                        {getPlansAvailableSection(
                          filteredPlansCount,
                          plansAvailableCount,
                          plansLoading,
                          planType,
                          isMobile
                        )}
                      </div>

                      <div className={`${styles['filter-section']}`}>
                        <div className='header'>Sort By</div>

                        {effectiveDate &&
                          buildSortOptions(PLAN_SORT_OPTIONS).map(
                            (sortOption, sortIndex) => {
                              return (
                                <Radio
                                  id={sortOption.label}
                                  key={`${sortOption.label} - ${sortIndex}`}
                                  name='sortBy'
                                  value={sortOption.value}
                                  label={sortOption.label}
                                  checked={sort_mobile === sortOption.value}
                                  onChange={() =>
                                    setSort_mobile(sortOption.value)
                                  }
                                />
                              );
                            }
                          )}
                      </div>
                    </>
                  )}
                  <div className={`${styles['filter-section']}`}>
                    {effectiveDate && (
                      <PlanTypesFilter
                        changeFilter={changePlanType}
                        initialValue={isMobile ? planType_mobile : planType}
                      />
                    )}
                  </div>
                  <div className={`${styles['filter-section']}`}>
                    {effectiveDate && (
                      <EffectiveDateFilter
                        years={EFFECTIVE_YEARS_SUPPORTED}
                        initialValue={
                          isMobile ? effectiveDate_mobile : effectiveDate
                        }
                        onChange={date => changeEffectiveDate(date)}
                      />
                    )}
                  </div>

                  <div className={`${styles['filter-section']}`}>
                    {effectiveDate && <PharmacyFilter />}
                  </div>

                  <div className={`${styles['filter-section']}`}>
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
                        carrierFilters={
                          isMobile ? carrierFilters_mobile : carrierFilters
                        }
                        policyFilters={
                          isMobile ? policyFilters_mobile : policyFilters
                        }
                        rebatesFilter={
                          isMobile ? rebatesFilter_mobile : rebatesFilter
                        }
                        specialNeedsFilter={
                          isMobile
                            ? specialNeedsFilter_mobile
                            : specialNeedsFilter
                        }
                        isNonRTS_User={isNonRTS_User}
                      />
                    )}
                  </div>
                  {isMobile && (
                    <div className={`${styles['filter-btn-section']}`}>
                      <Button
                        label={'Reset Filters'}
                        onClick={resetFilters}
                        type='secondary'
                        className={`${styles['filter-grey-btn']}`}
                      />
                      <Button
                        label={'Apply'}
                        onClick={applyFilters}
                        type='primary'
                        className={`${styles['filter-blue-btn']}`}
                      />
                    </div>
                  )}
                </div>
              )}
              {((isMobile && !filtersOpen) || !isMobile) && (
                <div className={`${styles['results']}`}>
                  {!isNonRTS_User &&
                    ((isMobile && showCurrentCarrierSummary) ||
                      !showCurrentCarrierSummary) && (
                      <CMSCompliance
                        leadId={leadDetails?.leadsId}
                        countyFips={leadDetails?.addresses?.[0]?.countyFips}
                        postalCode={leadDetails?.addresses?.[0]?.postalCode}
                      />
                    )}
                  {results.length > 0 && showCurrentCarrierSummary && (
                    <CurrentCarrierSummaryBanner
                      plans={results}
                      plansCount={filteredPlansCount}
                      handleClear={handleClearSummaryBanner}
                    />
                  )}

                  <div className={`${styles['sort']}`}>
                    {getPlansAvailableSection(
                      filteredPlansCount,
                      plansAvailableCount,
                      plansLoading,
                      planType,
                      isMobile
                    )}
                    {!isMobile && (
                      <div className={`${styles['sort-select']}`}>
                        <Select
                          inputBoxClassName={`${styles['sort-select-box']}`}
                          mobileLabel={<SortIcon />}
                          initialValue={'total-asc'}
                          onChange={value => setSort(value)}
                          options={buildSortOptions(PLAN_SORT_OPTIONS)}
                          prefix='Sort by: '
                        />
                      </div>
                    )}
                  </div>
                  <div className={`${styles['plans']}`}>
                    <PlanResults
                      plans={pagedResults}
                      isMobile={isMobile}
                      loading={plansLoading}
                      effectiveDate={effectiveDate}
                      contact={leadDetails}
                      leadId={id}
                      pharmacies={pharmacies}
                      planType={planType}
                      selectedPlans={selectedPlans}
                      setSelectedPlans={setSelectedPlans}
                      setSessionData={setSessionData}
                      refresh={refreshPlans}
                      setEnrollingPlan={setEnrollingPlan}
                      onEnrollClick={plan => {
                        setEnrollingPlan(plan);
                        if (isQuickQuotePage) {
                          setContactSearchModalOpen(true);
                        } else {
                          setPreCheckListPdfModal(true);
                        }
                      }}
                    />
                    {!plansLoading && filteredPlansCount > 0 && (
                      <div>
                        <BackToTop />

                        <PaginationBar
                          totalCount={filteredPlansCount}
                          currentPage={currentPage}
                          itemsPerPage={10}
                          onChange={page => setCurrentPage(page)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Container>
          </>

          <GlobalFooter />

          <PlanPageFooter
            leadId={id}
            effectiveDate={formatDate(effectiveDate, 'yyyy-MM-01')}
            plans={results?.filter(plan => selectedPlans[plan.id])}
            onRemove={plan => {
              setSelectedPlans(prev => ({ ...prev, [plan.id]: false }));
            }}
            setSessionData={setSessionData}
            isMobile={isMobile}
          />
        </WithLoader>

        {enrollModalOpen && (
          <EnrollmentModal
            modalOpen={enrollModalOpen}
            planData={enrollingPlan}
            contact={leadDetails}
            handleCloseModal={() => setEnrollModalOpen(false)}
            effectiveDate={formatDate(effectiveDate, 'yyyy-MM-01')}
            isApplyProcess={isQuickQuotePage}
            linkToExistContactId={linkToExistContactId}
            navPath={''}
          />
        )}
        {preCheckListPdfModal && (
          <PreEnrollPDFModal
            open={preCheckListPdfModal}
            onClose={() => {
              setPreCheckListPdfModal(false);
              setEnrollModalOpen(true);
            }}
          />
        )}

        <SaveToContact
          contactSearchModalOpen={contactSearchModalOpen}
          handleClose={() => setContactSearchModalOpen(false)}
          handleCallBack={response => {
            setLinkToExistContactId(response?.leadsId);
            setPreCheckListPdfModal(true);
          }}
          page='healthPlans'
          isApplyProcess={true}
        />
      </div>
    </>
  );
};

export default PlansPage;
