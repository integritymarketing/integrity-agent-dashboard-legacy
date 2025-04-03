import { useEffect, useState, useMemo } from 'react';
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

const IulAccumulationComparePlans = () => {
  const [results, setResults] = useState([]);
  const [disabledPlans, setDisabledPlans] = useState({});

  const { planIds: comparePlanIds, contactId } = useParams();
  const planIds = useMemo(() => comparePlanIds.split(','), [comparePlanIds]);
  const { leadDetails } = useLeadDetails();
  const { agentInformation } = useAgentInformationByID();
  const comparePlansSessionData = sessionStorage.getItem('iul-compare-plans');
  const comparePlans = JSON.parse(comparePlansSessionData);
  const navigate = useNavigate();
  const [applyErrorModalOpen, setApplyErrorModalOpen] = useState(false);
  const [compareShareModalOpen, setCompareShareModalOpen] = useState(false);

  const {
    fetchLifeIulQuoteDetails,
    handleIULQuoteApplyClick,
    isLoadingApplyLifeIulQuote,
  } = useLifeIulQuote();

  function getAllPlanDetails(planIds) {
    return Promise.all(
      planIds.filter(Boolean).map(planId => fetchLifeIulQuoteDetails(planId))
    );
  }

  const getPlanDetails = async planIds => {
    const plansData = await getAllPlanDetails(planIds);
    setResults(plansData);
  };

  // Helper function to get benefit value by name
  const getBenefitValueByName = (benefits, name) => {
    const benefit = benefits.find(benefit => benefit.name === name);
    return benefit ? benefit.value : 'Excluded';
  };

  // Helper function to create a benefit object based on the benefit name
  const createBenefitObj = (name, results) => {
    return {
      name: name,
      description: 'Feature Description',
      plans: results.map(item => getBenefitValueByName(item.benefits, name)),
    };
  };

  // Helper function to get unique benefit names from results
  const getBenefitNames = results => {
    const benefitNames = new Set();
    results.forEach(item => {
      item.benefits.forEach(benefit => {
        benefitNames.add(benefit.name);
      });
    });
    return Array.from(benefitNames);
  };

  useEffect(() => {
    getPlanDetails(planIds);
  }, [planIds]);

  const features = useMemo(() => {
    const benefitNames = getBenefitNames(results);
    const combinedBenefits = benefitNames.map(name =>
      createBenefitObj(name, results)
    );

    return combinedBenefits;
  }, [results]);

  const uwRequirements = useMemo(() => {
    const combinedRequirements = results.flatMap(
      item => item.uwRequirements || []
    );

    const result = combinedRequirements.reduce((acc, requirement) => {
      const title = requirement.sectionName;
      const items = requirement.names;

      // Check if the title already exists in the result
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
        distribution: plan.distribution,
        carrierName: plan.companyName,
        planRating: plan.amBest,
        planName: plan.productName,
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
    navigate(`/life/iul-accumulation/${contactId}/quote?preserveSelected=true`);
  };

  const handleApplyClick = async plan => {
    const planData = comparePlans.find(p => p.recId === plan.id);
    const emailAddress =
      leadDetails?.emails?.length > 0 ? leadDetails.emails[0].leadEmail : null;
    const phoneNumber =
      leadDetails?.phones?.length > 0 ? leadDetails.phones[0].leadPhone : null;

    setDisabledPlans(prev => ({ ...prev, [plan.id]: true }));

    try {
      const response = await handleIULQuoteApplyClick(
        {
          ...planData,
          ...agentInformation,
          ...leadDetails,
          emailAddress,
          phoneNumber,
        },
        contactId
      );
      if (response.success) {
        setSelectedPlan({});
      } else {
        setApplyErrorModalOpen(true);
        setSelectedPlan({});
      }
    } catch (error) {
      Sentry.captureException(error);
      setApplyErrorModalOpen(true);
    } finally {
      setDisabledPlans(prev => ({ ...prev, [plan.id]: false }));
    }
  };

  return (
    <IulQuoteContainer
      title='IUL Accumulation'
      page='plan compare page'
      quoteType='accumulation'
    >
      <Grid container gap={3}>
        <Grid
          item
          md={12}
          className={styles.planCompareHeader}
          sx={{ position: 'relative' }}
        >
          <CompareHeader
            handleApplyClick={handleApplyClick}
            applyButtonDisabled={isLoadingApplyLifeIulQuote}
            headerCategory='IUL_ACCUMULATION'
            IULAccumulationPlans={plansData}
            onClose={handleComparePlanRemove}
            shareComparePlanModal={handleShareModal}
            returnBackToPlansPage={returnBackToPlansPage}
          />
          {isLoadingApplyLifeIulQuote && (
            <Box sx={{ position: 'absolute', top: 0, left: '50%' }}>
              <WithLoader isLoading={isLoadingApplyLifeIulQuote} />
            </Box>
          )}
        </Grid>
        {features?.length > 0 && (
          <Grid item md={12} className={styles.productFeature}>
            <ProductFeature title='Features' features={features} />
          </Grid>
        )}

        <Grid item md={12} className={styles.underwritingRequirements}>
          <Box>
            <UnderwritingRequirements
              requirements={uwRequirements}
              title='Underwriting Requirements'
            />
          </Box>
        </Grid>
      </Grid>
      <ApplyErrorModal
        open={applyErrorModalOpen}
        onClose={() => setApplyErrorModalOpen(false)}
      />
      {compareShareModalOpen && (
        <IulCompareShareModal
          open={compareShareModalOpen}
          onClose={() => setCompareShareModalOpen(false)}
          plans={comparePlans}
          quoteType='accumulation'
        />
      )}
    </IulQuoteContainer>
  );
};

export default IulAccumulationComparePlans;
