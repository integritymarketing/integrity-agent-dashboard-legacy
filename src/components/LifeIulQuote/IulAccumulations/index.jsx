import React, { useCallback, useEffect, useState } from 'react';
import {
  ApplyErrorModal,
  IulAccumulationQuoteFilter,
  IulQuoteContainer,
} from '../CommonComponents';
import {
  CarrierResourceAds,
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
import { useCarriers } from 'providers/CarriersProvider';
import { useCreateNewQuote } from 'providers/CreateNewQuote';
import SaveToContact from 'components/QuickerQuote/Common/SaveToContact';
import useUserProfile from 'hooks/useUserProfile';
import { useProfessionalProfileContext } from 'providers/ProfessionalProfileProvider';
import { postSSORequest } from 'utils/postSSORequest';
import useToast from 'hooks/useToast';

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
  const { getCarriersData, getAdPolicyRedirectUrl } = useCarriers();
  const { leadDetails, getLeadDetailsAfterSearch } = useLeadDetails();
  const [isTobaccoUser, setIsTobaccoUser] = useState(false);

  const { agentInformation } = useAgentInformationByID();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { contactId } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();
  const { firstName, lastName, email, phone, npn } = useUserProfile();
  const { getAgentData } = useProfessionalProfileContext();
  const [selectedPlan, setSelectedPlan] = useState({});
  const [applyErrorModalOpen, setApplyErrorModalOpen] = useState(false);
  const [carriersAdsPolicyDetails, setCarriersAdsPolicyDetails] = useState([]);
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

  useEffect(() => {
    const fetchCarriersAdsPolicyDetails = async () => {
      const response = await getCarriersData('productType=iul');
      if (response) {
        addActionMenuItemsToCarriersAdsPolicies(response);
      }
    };
    fetchCarriersAdsPolicyDetails();
  }, []);

  const fetchRedirectUrlAndOpen = async (resource, website) => {
    const agentData = await getAgentData?.();
    if (!agentData) return;
    const { sourceId, assignedBUs = [] } = agentData;

    const agentBUs = assignedBUs.map(item => item.buCode);
    const agent = {
      firstName,
      lastName,
      email,
      phone,
      npn,
      sourceId,
      agentBUs,
    };

    const payload = {
      ctaName: resource,
      ctaValue: website,
      agent,
      lead: {
        leadId: leadDetails?.leadsId || '',
        firstName: leadDetails?.firstName || '',
        lastName: leadDetails?.lastName || '',
        email:
          leadDetails?.emails?.length > 0
            ? leadDetails.emails[0].leadEmail
            : null,
        phone:
          leadDetails?.phones?.length > 0
            ? leadDetails.phones[0].leadPhone
            : null,
        age: leadDetails?.age || 0,
        gender: leadDetails?.gender || '',
        dateOfBirth: leadDetails?.birthdate || '',
        stateCode: parsedLifeQuoteAccumulationDetails.state
          ? parsedLifeQuoteAccumulationDetails.state
          : leadDetails?.addresses[0]?.stateCode || null,
      },
    };

    const adPolicyRedirectUrlDetails = await getAdPolicyRedirectUrl(payload);
    if (adPolicyRedirectUrlDetails?.redirectUrl) {
      if (adPolicyRedirectUrlDetails?.isSSo) {
        await postSSORequest(adPolicyRedirectUrlDetails.redirectUrl, err => {
          console.error('Error posting sso request submission:', err);
          showToast({
            type: 'error',
            message: 'Error posting sso request',
            time: 500,
          });
        });
      } else {
        window.open(adPolicyRedirectUrlDetails.redirectUrl, '_blank');
      }
    }
  };

  const addActionMenuItemsToCarriersAdsPolicies = carriersAdsPolicyDetails => {
    const carriersAdsPolicyDetailsWithActionMenuItems =
      carriersAdsPolicyDetails.map(carrier => {
        const actionMenuItems = [
          carrier.quote && {
            label: 'Run Quote',
            onClick: async () => {
              await fetchRedirectUrlAndOpen(carrier.resource, carrier.quote);
            },
          },
          carrier.illustration && {
            label: 'Run Illustration',
            onClick: async () => {
              await fetchRedirectUrlAndOpen(
                carrier.resource,
                carrier.illustration
              );
            },
          },
          carrier.eApp && {
            label: 'Start eApp',
            onClick: async () => {
              await fetchRedirectUrlAndOpen(carrier.resource, carrier.eApp);
            },
          },
          carrier.website && {
            label: 'Visit Carrier',
            onClick: async () => {
              await fetchRedirectUrlAndOpen(carrier.resource, carrier.website);
            },
          },
        ].filter(Boolean);
        return {
          ...carrier,
          actionMenuItems,
        };
      });
    setCarriersAdsPolicyDetails(carriersAdsPolicyDetailsWithActionMenuItems);
  };

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
          <WithLoader isLoading={isLoadingLifeIulQuote}>
            <Grid container gap={3}>
              {lifeIulQuoteResults?.length > 0 && !isLoadingLifeIulQuote ? (
                <>
                  {lifeIulQuoteResults?.map((plan, index) => {
                    const lifeQuoteAccumulationDetails = sessionStorage.getItem(
                      'lifeQuoteAccumulationDetails'
                    );
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
                          handleIllustrationClick={handleIllustrationClick}
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
        </Grid>
      )}
      {carriersAdsPolicyDetails.length > 0 && (
        <Box className={styles.carrierResourceContainer}>
          <Box className={styles.carrierResourceHeader}>
            <Typography variant='h4' color='#052A63'>
              Carrier Resources{' '}
              <span className={styles.carrierResourceCount}>
                ({carriersAdsPolicyDetails.length})
              </span>
            </Typography>
          </Box>
          <CarrierResourceAds
            carriers={carriersAdsPolicyDetails}
          ></CarrierResourceAds>
        </Box>
      )}
    </IulQuoteContainer>
  );
};

export default IulAccumulationQuote;
