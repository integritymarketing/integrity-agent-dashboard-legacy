import { useCallback, useEffect, useState, useMemo } from 'react';
import { Grid, Box } from '@mui/material';
import {
  CompareHeader,
  ProductFeature,
  UnderwritingRequirements,
} from '@integritymarketing/clients-ui-kit';
import {
  IulQuoteContainer,
  ApplyErrorModal,
  IulCompareShareModal,
} from '../CommonComponents';
import { useNavigate, useParams } from 'react-router-dom';
import { useLifeIulQuote } from 'providers/Life';

import styles from './styles.module.scss';
import { useLeadDetails } from 'providers/ContactDetails';
import useAgentInformationByID from 'hooks/useAgentInformationByID';
import WithLoader from 'components/ui/WithLoader';
import * as Sentry from '@sentry/react';
import SaveToContact from 'components/QuickerQuote/Common/SaveToContact';
import { useCreateNewQuote } from 'providers/CreateNewQuote';

const IulProtectionComparePlans = () => {
  const [results, setResults] = useState([]);
  const { planIds: comparePlanIds, contactId } = useParams();
  const planIds = useMemo(() => comparePlanIds.split(','), [comparePlanIds]);
  const [disabledPlans, setDisabledPlans] = useState({});
  const [applyErrorModalOpen, setApplyErrorModalOpen] = useState(false);
  const [compareShareModalOpen, setCompareShareModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [contactSearchModalOpen, setContactSearchModalOpen] = useState(false);
  const [linkToExistContactId, setLinkToExistContactId] = useState(null);

  const { leadDetails, getLeadDetailsAfterSearch } = useLeadDetails();
  const { agentInformation } = useAgentInformationByID();
  const comparePlansSessionData = sessionStorage.getItem('iul-compare-plans');
  const comparePlans = JSON.parse(comparePlansSessionData);

  const lifeQuoteProtectionDetails = sessionStorage.getItem(
    'lifeQuoteProtectionDetails'
  );
  const parsedLifeQuoteProtectionDetails = (() => {
    try {
      return lifeQuoteProtectionDetails
        ? JSON.parse(lifeQuoteProtectionDetails)
        : {};
    } catch (error) {
      console.error('Error parsing lifeQuoteProtectionDetails:', error);
      return {};
    }
  })();

  const {
    fetchLifeIulQuoteDetails,
    handleIULQuoteApplyClick,
    isLoadingApplyLifeIulQuote,
  } = useLifeIulQuote();
  const navigate = useNavigate();
  const { isQuickQuotePage } = useCreateNewQuote();

  const getPlanDetails = useCallback(async () => {
    const getAllPlanDetails = () => {
      return Promise.all(
        planIds.filter(Boolean).map(planId => fetchLifeIulQuoteDetails(planId))
      );
    };
    const plansData = await getAllPlanDetails();
    setResults(plansData);
  }, [planIds, fetchLifeIulQuoteDetails]);

  useEffect(() => {
    getPlanDetails();
  }, [planIds, getPlanDetails]);

  const features = useMemo(() => {
    const combinedBenefits = [];
    const benefitNames = new Set();

    results.forEach(item => {
      item.benefits.forEach(benefit => {
        benefitNames.add(benefit.name);
      });
    });

    benefitNames.forEach(name => {
      const benefitObj = {
        name: name,
        description: 'Feature Description',
        plans: results.map(item => {
          const benefit = item.benefits.find(benefit => benefit.name === name);
          return benefit ? benefit.value : 'Excluded';
        }),
      };
      combinedBenefits.push(benefitObj);
    });

    return combinedBenefits;
  }, [results]);

  const uwRequirements = useMemo(() => {
    const combinedRequirements = results.flatMap(
      item => item.uwRequirements || []
    );

    const result = combinedRequirements.reduce((acc, requirement) => {
      const title = requirement.sectionName;
      const items = requirement.names;

      const existingCategory = acc.find(category => category.title === title);
      if (existingCategory) {
        existingCategory.data.push({ items });
      } else {
        acc.push({
          title,
          data: [{ items }],
          displayType: requirement.displayType,
        });
      }
      return acc;
    }, []);

    return result;
  }, [results]);

  const plansData = useMemo(() => {
    return comparePlans.map(plan => {
      return {
        logoURL: plan.companyLogoImageUrl,
        id: plan.recId,
        annualPlanPremium: plan.targetPremium,
        deathBenefitAmount: plan.deathBenefit,
        carrierName: plan.companyName,
        planRating: plan.amBest,
        planName: plan.productName,
        isRts: plan.isRts,
      };
    });
  }, [comparePlans]);

  const handleComparePlanRemove = id => {
    const updatedPlans = comparePlans.filter(plan => plan.recId !== id);
    sessionStorage.setItem('iul-compare-plans', JSON.stringify(updatedPlans));
    window.location.reload();
  };

  const handleShareModal = val => {
    setCompareShareModalOpen(true);
  };

  const returnBackToPlansPage = () => {
    navigate(`/life/iul-protection/${contactId}/quote?preserveSelected=true`);
  };

  const handleApplyClick = async (plan, leadData) => {
    const updatedLeadDetails = leadData || leadDetails;
    const updatedLeadId = updatedLeadDetails?.leadsId || contactId;
    const planData = comparePlans.find(p => p.recId === plan.id);
    const emailAddress =
      updatedLeadDetails?.emails?.length > 0
        ? updatedLeadDetails.emails[0].leadEmail
        : null;
    const phoneNumber =
      updatedLeadDetails?.phones?.length > 0
        ? updatedLeadDetails.phones[0].leadPhone
        : null;

    setDisabledPlans(prev => ({ ...prev, [plan.id]: true }));

    try {
      const response = await handleIULQuoteApplyClick(
        {
          ...planData,
          ...agentInformation,
          ...updatedLeadDetails,
          emailAddress,
          phoneNumber,
          stateCode: parsedLifeQuoteProtectionDetails.state
            ? parsedLifeQuoteProtectionDetails.state
            : updatedLeadDetails?.addresses[0]?.stateCode || null,
        },
        updatedLeadId
      );
      if (response.success) {
        setSelectedPlan({});
        if (isQuickQuotePage) {
          navigate(
            `/life/iul-protection/${linkToExistContactId}/${planIds.join(
              ','
            )}/compare-plans`
          );
        }
      } else {
        setApplyErrorModalOpen(true);
        setSelectedPlan({});
      }
    } catch (error) {
      setApplyErrorModalOpen(true);
      Sentry.captureException(error);
    } finally {
      setDisabledPlans(prev => ({ ...prev, [plan.id]: false }));
    }
  };

  const onApply = useCallback(
    plan => {
      setSelectedPlan(plan);
      if (isQuickQuotePage) {
        setContactSearchModalOpen(true);
      } else {
        handleApplyClick(plan);
      }
    },
    [isQuickQuotePage, handleApplyClick]
  );

  const preEnroll = useCallback(
    async id => {
      const response = await getLeadDetailsAfterSearch(id);
      if (response) {
        await handleApplyClick(selectedPlan, response);
      }
    },
    [handleApplyClick, getLeadDetailsAfterSearch, selectedPlan]
  );

  return (
    <IulQuoteContainer
      title='IUL Protection'
      page='plan compare page'
      quoteType='protection'
    >
      <Grid container gap={3}>
        <Grid
          item
          md={12}
          className={styles.planCompareHeader}
          sx={{ position: 'relative' }}
        >
          <CompareHeader
            handleApplyClick={onApply}
            applyButtonDisabled={isLoadingApplyLifeIulQuote}
            headerCategory='IUL_PROTECTION'
            IULProtectionPlans={plansData}
            onClose={handleComparePlanRemove}
            shareComparePlanModal={handleShareModal}
            returnBackToPlansPage={returnBackToPlansPage}
            hideShareButton={true}
          />
          {isLoadingApplyLifeIulQuote && (
            <Box sx={{ position: 'absolute', top: 0, left: '50%' }}>
              <WithLoader
                className='spinner-container'
                isLoading={isLoadingApplyLifeIulQuote}
              />
            </Box>
          )}
        </Grid>
        {features?.length > 0 && (
          <Grid item md={12} className={styles.productFeature}>
            <ProductFeature title='Features' features={features} />
          </Grid>
        )}
        {uwRequirements?.length > 0 && (
          <Grid item md={12} className={styles.underwritingRequirements}>
            <Box>
              <UnderwritingRequirements
                requirements={uwRequirements}
                title='Underwriting Requirements'
              />
            </Box>
          </Grid>
        )}
      </Grid>
      <ApplyErrorModal
        open={applyErrorModalOpen}
        onClose={() => {
          setApplyErrorModalOpen(false);
          if (isQuickQuotePage) {
            navigate(
              `/life/iul-protection/${linkToExistContactId}/${planIds.join(
                ','
              )}/compare-plans`
            );
          }
        }}
      />
      <SaveToContact
        contactSearchModalOpen={contactSearchModalOpen}
        handleClose={() => setContactSearchModalOpen(false)}
        handleCallBack={response => {
          setLinkToExistContactId(response?.leadsId);
          preEnroll(response?.leadsId);
        }}
        page='accumulation'
        isApplyProcess={true}
      />
      {compareShareModalOpen && (
        <IulCompareShareModal
          open={compareShareModalOpen}
          onClose={() => setCompareShareModalOpen(false)}
          plans={comparePlans}
          quoteType='protection'
        />
      )}
    </IulQuoteContainer>
  );
};

export default IulProtectionComparePlans;
