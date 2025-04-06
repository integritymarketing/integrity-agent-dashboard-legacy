import React, {useCallback, useEffect, useState} from 'react';
import {ApplyErrorModal, IulAccumulationQuoteFilter, IulQuoteContainer,} from '../CommonComponents';
import {CarrierResourceAds, IulQuoteCard, NoResultsError,} from '@integritymarketing/clients-ui-kit';
import NoResults from 'components/icons/errorImages/noResults';
import {Box, Grid, Typography, useMediaQuery, useTheme} from '@mui/material';
import {useLifeIulQuote} from 'providers/Life';
import styles from './styles.module.scss';
import WithLoader from 'components/ui/WithLoader';
import {useNavigate, useParams} from 'react-router-dom';
import useAgentInformationByID from 'hooks/useAgentInformationByID';
import {useLeadDetails} from 'providers/ContactDetails';
import {useCarriers} from 'providers/CarriersProvider';
import {useCreateNewQuote} from 'providers/CreateNewQuote';
import SaveToContact from 'components/QuickerQuote/Common/SaveToContact';
import useUserProfile from "hooks/useUserProfile";
import {useProfessionalProfileContext} from "providers/ProfessionalProfileProvider";

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

  const {isQuickQuotePage} = useCreateNewQuote();
  const {getCarriersData, getAdPolicyRedirectUrl} = useCarriers();
  const {leadDetails} = useLeadDetails();
  const [isTobaccoUser, setIsTobaccoUser] = useState(false);

  const {agentInformation} = useAgentInformationByID();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {contactId} = useParams();
  const navigate = useNavigate();
  const {firstName, lastName, email, phone, npn} = useUserProfile();
  const {getAgentData} = useProfessionalProfileContext();
  const [selectedPlan, setSelectedPlan] = useState({});
  const [applyErrorModalOpen, setApplyErrorModalOpen] = useState(false);
  const [carriersAdsPolicyDetails, setCarriersAdsPolicyDetails] = useState([]);
  const [contactSearchModalOpen, setContactSearchModalOpen] = useState(false);

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
    const {
      sourceId,
      assignedBUs = [],
    } = agentData;

    const agentBUs = assignedBUs.map((item) => item.buName);
    const agent = {
      firstName,
      lastName,
      email,
      phone,
      npn,
      sourceId,
      agentBUs,
    };

    const {
      firstName: leadFirstName,
      lastName: leadLastName,
      birthdate,
      age,
      gender,
    } = leadDetails || {};
    const stateCode = leadDetails?.addresses?.[0]?.stateCode;
    const leadId = leadDetails?.leadsId;
    const leadPhone = leadDetails?.phones?.[0]?.leadPhone || "";
    const leadEmail = leadDetails?.emails?.[0]?.leadEmail || "";

    const payload = {
      ctaName: resource,
      ctaValue: website,
      agent,
      lead: {
        leadId,
        firstName: leadFirstName,
        lastName: leadLastName,
        email: leadEmail,
        phone: leadPhone,
        age,
        gender,
        dateOfBirth: birthdate,
        stateCode,
      },
    };

    const adPolicyRedirectUrlDetails = await getAdPolicyRedirectUrl(payload);
    if (adPolicyRedirectUrlDetails?.redirectUrl) {
      window.open(adPolicyRedirectUrlDetails.redirectUrl, "_blank");
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
              await fetchRedirectUrlAndOpen(carrier.resource, carrier.illustration);
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

  const handlePlanDetailsClick = id => {
    const filteredPlan = lifeIulQuoteResults.filter(item => id === item.recId);

    if (filteredPlan.length > 0) {
      sessionStorage.setItem(
        'iul-plan-details',
        JSON.stringify({...filteredPlan[0], isTobaccoUser})
      );
      const tempId = 'IUL-United of Omaha-Income Advantage IUL';
      navigate(`/life/iul-accumulation/${contactId}/${tempId}/quote-details`);
    }
  };

  const handleIllustrationClick = async () => {
    try {
      await getAddPolicyRedirectURL(agentInformation, leadDetails);
    } catch (error) {
      console.error('Error fetching illustration URL:', error);
    }
  };

  const handleNavigateToLearningCenter = () => {
    window.open('/learning-center', '_blank');
  };

  const onApply = plan => {
    if (isQuickQuotePage) {
      setSelectedPlan(plan);
      setContactSearchModalOpen(true);
    } else {
      handleApplyClick(plan);
    }
  };

  const handleApplyClick = async plan => {
    try {
      const response = await handleIULQuoteApplyClick(
        {...plan, ...agentInformation, ...leadDetails},
        contactId
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
              {lifeIulQuoteResults?.length || 0} IUL Accumulation Policie
            </Typography>
          </Box>
        )}
        <IulAccumulationQuoteFilter isTobaccoUser={isTobaccoUser}/>
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
                    const {
                      productName,
                      companyName,
                      amBest,
                      companyLogoImageUrl,
                      cashValueYear10,
                      cashValueYear20,
                      cashValueAge65,
                      maxIllustratedRate,
                      indexStrategyType,
                      distribution,
                      deathBenefit,
                      targetPremium,
                      rowId,
                      recId,
                    } = plan;
                    return (
                      <Grid
                        item
                        md={12}
                        key={`iul-accumulation-${index}`}
                        sx={{position: 'relative'}}
                      >
                        <IulQuoteCard
                          applyButtonDisabled={isLoadingApplyLifeIulQuote}
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
                            handlePlanDetailsClick(plan.recId)
                          }
                          disableCompare={
                            selectedPlans?.length === 3 &&
                            !selectedPlans?.find(p => p.recId === recId)
                          }
                          isChecked={selectedPlans?.find(
                            p => p.recId === recId
                          )}
                        />
                        {selectedPlan.rowId === rowId && (
                          <Box
                            sx={{position: 'absolute', top: 0, left: '50%'}}
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
                  image={<NoResults/>}
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
              handleCallBack={() => handleApplyClick(selectedPlan)}
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
