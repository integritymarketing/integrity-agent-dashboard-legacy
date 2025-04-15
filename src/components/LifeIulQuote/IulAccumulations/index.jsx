import React, { useCallback, useEffect, useState } from 'react';
import {
  ApplyErrorModal,
  IulAccumulationQuoteFilter,
  IulQuoteContainer,
} from '../CommonComponents';
import {
  IulQuoteCard,
  NoResultsError,
} from '@integritymarketing/clients-ui-kit';
import NoResults from 'components/icons/errorImages/noResults';
import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useLifeIulQuote } from 'providers/Life';
import styles from './styles.module.scss';
import WithLoader from 'components/ui/WithLoader';
import { useNavigate, useParams } from 'react-router-dom';
import useAgentInformationByID from 'hooks/useAgentInformationByID';
import { useLeadDetails } from 'providers/ContactDetails';
import { useCreateNewQuote } from 'providers/CreateNewQuote';
import SaveToContact from 'components/QuickerQuote/Common/SaveToContact';
import { CarriersContainer } from 'components/LifeIulQuote/CarriersContainer';

const IulAccumulationQuote = () => {
  const {
    fetchLifeIulQuoteResults,
    isLoadingLifeIulQuote,
    lifeIulQuoteResults,
    showFilters,
    handleComparePlanSelect,
    selectedPlans,
    handleIULQuoteApplyClick,
    isLoadingApplyLifeIulQuote,
    getAddPolicyRedirectURL,
  } = useLifeIulQuote();

  const { isQuickQuotePage } = useCreateNewQuote();
  const { leadDetails, getLeadDetailsAfterSearch } = useLeadDetails();
  const [isTobaccoUser, setIsTobaccoUser] = useState(false);

  const { agentInformation } = useAgentInformationByID();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { contactId } = useParams();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState({});
  const [applyErrorModalOpen, setApplyErrorModalOpen] = useState(false);
  const [contactSearchModalOpen, setContactSearchModalOpen] = useState(false);

  const lifeQuoteAccumulationDetails = sessionStorage.getItem(
    'lifeQuoteAccumulationDetails'
  );
  const parsedLifeQuoteAccumulationDetails = (() => {
    try {
      return lifeQuoteAccumulationDetails
        ? JSON.parse(lifeQuoteAccumulationDetails)
        : {};
    } catch (error) {
      console.error('Error parsing lifeQuoteAccumulationDetails:', error);
      return {};
    }
  })();

  const getQuoteResults = useCallback(async () => {
    const lifeQuoteAccumulationDetails = sessionStorage.getItem(
      'lifeQuoteAccumulationDetails'
    );

    if (lifeQuoteAccumulationDetails) {
      const parsedLifeQuoteAccumulationDetails = JSON.parse(
        lifeQuoteAccumulationDetails
      );
      setIsTobaccoUser(parsedLifeQuoteAccumulationDetails.isTobaccoUser);

      const {
        birthDate,
        gender,
        state,
        healthClasses,
        faceAmounts,
        payPeriods,
        illustratedRate,
        loanType,
      } = parsedLifeQuoteAccumulationDetails;

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
        quoteType: 'IULACCU-SOLVE',
      };
      await fetchLifeIulQuoteResults(payload);
    }
  }, [fetchLifeIulQuoteResults]);

  useEffect(() => {
    getQuoteResults();
  }, []);

  const handlePlanDetailsClick = plan => {
    sessionStorage.setItem(
      'iul-plan-details',
      JSON.stringify({ ...plan, isTobaccoUser })
    );

    navigate(
      `/life/iul-accumulation/${contactId}/${
        plan?.input?.productId
      }/quote-details${isQuickQuotePage ? '?quick-quote=true' : ''}`
    );
  };

  const handleIllustrationClick = async () => {
    try {
      await getAddPolicyRedirectURL(
        agentInformation,
        leadDetails,
        'ACCUMULATION'
      );
    } catch (error) {
      console.error('Error fetching illustration URL:', error);
    }
  };

  const handleNavigateToLearningCenter = () => {
    window.open('/learning-center', '_blank');
  };

  const handleApplyClick = async (plan, leadData) => {
    const updatedLeadDetails = leadData || leadDetails;
    const updatedLeadId = updatedLeadDetails?.leadsId || contactId;
    try {
      const response = await handleIULQuoteApplyClick(
        {
          ...plan,
          ...agentInformation,
          ...updatedLeadDetails,
          stateCode: parsedLifeQuoteAccumulationDetails.state
            ? parsedLifeQuoteAccumulationDetails.state
            : updatedLeadDetails?.addresses[0]?.stateCode || null,
        },
        updatedLeadId
      );
      if (response.success) {
        setSelectedPlan({});
      } else {
        setApplyErrorModalOpen(true);
        setSelectedPlan({});
      }
    } catch (error) {
      setApplyErrorModalOpen(true);
      setSelectedPlan({});
    }
  };

  const onApply = plan => {
    setSelectedPlan(plan);
    if (isQuickQuotePage) {
      setContactSearchModalOpen(true);
    } else {
      handleApplyClick(plan);
    }
  };

  const preEnroll = useCallback(
    async id => {
      const response = await getLeadDetailsAfterSearch(id);
      if (response) {
        await handleApplyClick(selectedPlan, response);
      }
    },
    [handleApplyClick, getLeadDetailsAfterSearch]
  );

  return (
    <IulQuoteContainer
      title='IUL Accumulation'
      page='plans page'
      quoteType='accumulation'
    >
      <Grid item md={3} xs={12}>
        {isMobile && showFilters && (
          <Box className={styles.countSortContainer}>
            <Typography variant='body1' className={styles.countSortText}>
              {lifeIulQuoteResults?.length || 0} IUL Accumulation Policies
            </Typography>
          </Box>
        )}
        <IulAccumulationQuoteFilter isTobaccoUser={isTobaccoUser} />
      </Grid>
      {!showFilters && (
        <Grid item md={8} spacing={2}>
          {!isMobile && (
            <Box className={styles.countSortContainer}>
              <Typography variant='body1' className={styles.countSortText}>
                {lifeIulQuoteResults?.length} IUL Accumulation Policies
              </Typography>
            </Box>
          )}
          <Box top={isLoadingLifeIulQuote ? 0 : undefined}>
            <WithLoader isLoading={isLoadingLifeIulQuote}>
              <Grid container gap={3}>
                {lifeIulQuoteResults?.length > 0 && !isLoadingLifeIulQuote ? (
                  <>
                    {lifeIulQuoteResults?.map((plan, index) => {
                      const lifeQuoteAccumulationDetails =
                        sessionStorage.getItem('lifeQuoteAccumulationDetails');
                      const parsedLifeQuoteAccumulationDetails = (() => {
                        try {
                          return lifeQuoteAccumulationDetails
                            ? JSON.parse(lifeQuoteAccumulationDetails)
                            : {};
                        } catch (error) {
                          console.error(
                            'Error parsing lifeQuoteAccumulationDetails:',
                            error
                          );
                          return {};
                        }
                      })();
                      const maxIllustratedRate =
                        parsedLifeQuoteAccumulationDetails?.illustratedRate ===
                        '0'
                          ? plan?.maxIllustratedRate
                          : plan?.input?.illustratedRate;
                      const {
                        productName,
                        companyName,
                        amBest,
                        companyLogoImageUrl,
                        cashValueYear10,
                        cashValueYear20,
                        cashValueAge65,
                        indexStrategyType,
                        distribution,
                        deathBenefit,
                        targetPremium,
                        rowId,
                        recId,
                        isRts,
                        hasPolicyDetails,
                      } = plan;
                      return (
                        <Grid
                          item
                          md={12}
                          key={`iul-accumulation-${index}`}
                          sx={{ position: 'relative' }}
                        >
                          <IulQuoteCard
                            applyButtonDisabled={
                              isLoadingApplyLifeIulQuote || !isRts
                            }
                            quoteType='IUL Accumulation'
                            cardTitle={productName}
                            companyName={companyName}
                            rating={amBest}
                            logo={companyLogoImageUrl}
                            cashValueYear10={cashValueYear10}
                            cashValueYear20={cashValueYear20}
                            cashValueAge65={cashValueAge65}
                            maxIllustratedRate={maxIllustratedRate}
                            indexStrategyType={indexStrategyType}
                            isTobaccoUser={isTobaccoUser}
                            targetPremium={targetPremium}
                            deathBenefit={deathBenefit}
                            distribution={distribution}
                            handleApplyClick={() => onApply(plan)}
                            handleIllustrationClick={() =>
                              handleIllustrationClick()
                            }
                            age={plan?.input?.actualAge}
                            healthClass={plan?.input?.healthClass}
                            handleComparePlanSelect={() =>
                              handleComparePlanSelect(plan)
                            }
                            handlePlanDetailsClick={() =>
                              handlePlanDetailsClick(plan)
                            }
                            hasPolicyDetails={hasPolicyDetails}
                            disableCompare={
                              (selectedPlans?.length === 3 &&
                                !selectedPlans?.find(p => p.recId === recId)) ||
                              !hasPolicyDetails
                            }
                            isChecked={selectedPlans?.find(
                              p => p.recId === recId
                            )}
                          />
                          {selectedPlan.rowId === rowId && (
                            <Box
                              sx={{ position: 'absolute', top: 0, left: '50%' }}
                            >
                              <WithLoader
                                isLoading={isLoadingApplyLifeIulQuote}
                              ></WithLoader>
                            </Box>
                          )}
                        </Grid>
                      );
                    })}
                  </>
                ) : (
                  <NoResultsError
                    title='No Results Found'
                    subtitle='There are no products available based on your current search settings. Please change your search or reset the filter setting.'
                    helpText='Need help? Check out our '
                    helpLinkText='LearningCENTER.'
                    onHelpLinkClick={handleNavigateToLearningCenter}
                    image={<NoResults />}
                  />
                )}
              </Grid>
              <ApplyErrorModal
                open={applyErrorModalOpen}
                onClose={() => setApplyErrorModalOpen(false)}
              />
              <SaveToContact
                contactSearchModalOpen={contactSearchModalOpen}
                handleClose={() => setContactSearchModalOpen(false)}
                handleCallBack={response => preEnroll(response?.leadsId)}
                page='accumulation'
              />
            </WithLoader>
          </Box>
        </Grid>
      )}

      <CarriersContainer title='' query='iul' />
    </IulQuoteContainer>
  );
};

export default IulAccumulationQuote;
