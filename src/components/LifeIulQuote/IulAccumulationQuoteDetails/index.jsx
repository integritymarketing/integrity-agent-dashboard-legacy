import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import PlanDetailsScrollNav from 'components/ui/PlanDetailsScrollNav';
import {
  CollapsibleLayout,
  IulQuoteCard,
  IulQuoteDetailsSection,
  ProductFeature,
  UnderwritingRequirements,
} from '@integritymarketing/clients-ui-kit';
import {
  ApplyErrorModal,
  IulQuoteContainer,
  IulShareModal,
} from '../CommonComponents';
import { useLifeIulQuote } from 'providers/Life';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import { useLeadDetails } from 'providers/ContactDetails';
import useAgentInformationByID from 'hooks/useAgentInformationByID';
import WithLoader from 'components/ui/WithLoader';
import SaveToContact from 'components/QuickerQuote/Common/SaveToContact';
import { useCreateNewQuote } from 'providers/CreateNewQuote';

const IulAccumulationQuoteDetails = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
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

  const planDetailsSessionData = sessionStorage.getItem('iul-plan-details');
  const planDetails = JSON.parse(planDetailsSessionData);
  const quoteDetailsRef = useRef(null);
  const productDescriptionRef = useRef(null);
  const productFeaturesRef = useRef(null);
  const underwritingRequirementsRef = useRef(null);
  const { planId, contactId } = useParams();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [contactSearchModalOpen, setContactSearchModalOpen] = useState(false);
  const [linkToExistContactId, setLinkToExistContactId] = useState(null);
  const {
    fetchLifeIulQuoteDetails,
    lifeIulDetails,
    handleIULQuoteApplyClick,
    isLoadingApplyLifeIulQuote,
    getAddPolicyRedirectURL,
  } = useLifeIulQuote();

  const { isQuickQuotePage } = useCreateNewQuote();
  const { leadDetails, getLeadDetailsAfterSearch } = useLeadDetails();
  const { agentInformation } = useAgentInformationByID();
  const [applyErrorModalOpen, setApplyErrorModalOpen] = useState(false);

  useEffect(() => {
    fetchLifeIulQuoteDetails(planId);
  }, [planId]);

  const description = lifeIulDetails?.description || '';
  const underwritingRequirements = lifeIulDetails?.uwRequirements || [];

  const features = useMemo(() => {
    return lifeIulDetails?.benefits?.map(feature => {
      return {
        name: feature.name,
        description: feature.description || '',
        plans: [feature.value || 'Excluded'],
      };
    });
  }, [lifeIulDetails]);

  const uwRequirements = useMemo(() => {
    return underwritingRequirements?.map(requirement => {
      return {
        title: requirement.sectionName,
        displayType: requirement.displayType,
        data: [
          {
            items: requirement.names,
          },
        ],
      };
    });
  }, [underwritingRequirements]);

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
    premium,
    isTobaccoUser,
  } = useMemo(() => {
    const calculatedMaxIllustratedRate =
      parsedLifeQuoteAccumulationDetails?.illustratedRate === '0'
        ? planDetails?.maxIllustratedRate
        : planDetails?.input?.illustratedRate;
    return {
      ...planDetails,
      maxIllustratedRate: calculatedMaxIllustratedRate,
    };
  }, [planDetails, parsedLifeQuoteAccumulationDetails]);

  const handleApplyClick = async leadData => {
    const updatedLeadDetails = leadData || leadDetails;
    const updatedLeadId = updatedLeadDetails?.leadsId || contactId;

    const emailAddress =
      updatedLeadDetails?.emails?.length > 0
        ? updatedLeadDetails.emails[0].leadEmail
        : null;
    const phoneNumber =
      updatedLeadDetails?.phones?.length > 0
        ? updatedLeadDetails.phones[0].leadPhone
        : null;

    try {
      const response = await handleIULQuoteApplyClick(
        {
          ...planDetails,
          ...agentInformation,
          ...updatedLeadDetails,
          emailAddress,
          phoneNumber,
          stateCode: parsedLifeQuoteAccumulationDetails.state
            ? parsedLifeQuoteAccumulationDetails.state
            : updatedLeadDetails?.addresses[0]?.stateCode || null,
        },
        updatedLeadId
      );
      if (response.success) {
        if (isQuickQuotePage) {
          navigate(
            `/life/iul-accumulation/${linkToExistContactId}/${planId}/quote-details`
          );
        }
      } else {
        setApplyErrorModalOpen(true);
      }
    } catch (error) {
      setApplyErrorModalOpen(true);
      console.error('Error applying for quote:', error);
    }
  };

  const onApply = useCallback(() => {
    {
      if (isQuickQuotePage) {
        setContactSearchModalOpen(true);
      } else {
        handleApplyClick();
      }
    }
  }, [isQuickQuotePage, handleApplyClick]);

  const preEnroll = useCallback(
    async id => {
      const response = await getLeadDetailsAfterSearch(id);
      if (response) {
        await handleApplyClick(response);
      }
    },
    [handleApplyClick, getLeadDetailsAfterSearch]
  );

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

  return (
    <IulQuoteContainer
      title='IUL Accumulation'
      page='plans details page'
      quoteType='accumulation'
    >
      <Grid container>
        {!isMobile && (
          <Grid item md={3} sm={5}>
            <Box marginBottom={'8px'}>
              <Typography variant='h4' color='#052A63'>
                Overview
              </Typography>
            </Box>
            <Box className={styles.tabsContainer}>
              <PlanDetailsScrollNav
                quoteType='IUL Details Page'
                initialSectionID='quoteDetails'
                scrollToInitialSection={false}
                hidePharmacy
                sections={[
                  { id: 'quoteDetails', label: 'Quote Details' },
                  { id: 'productDescription', label: 'Description' },
                  { id: 'productFeatures', label: 'Features' },
                  {
                    id: 'underwritingRequirements',
                    label: 'Underwriting Requirements',
                  },
                ]}
                ref={{
                  quoteDetails: quoteDetailsRef,
                  productDescription: productDescriptionRef,
                  productFeatures: productFeaturesRef,
                  underwritingRequirements: underwritingRequirementsRef,
                }}
              />
            </Box>
          </Grid>
        )}
        <Grid item md={8} sm={6}>
          <Grid container gap={3}>
            <Grid item md={12} xs={12} sx={{ position: 'relative' }}>
              <div ref={quoteDetailsRef} id='quoteDetails'>
                <CollapsibleLayout title='Quote Details'>
                  <IulQuoteCard
                    applyButtonDisabled={
                      isLoadingApplyLifeIulQuote || !planDetails?.isRts
                    }
                    isPlanDetailsPage={true}
                    quoteType='IUL Accumulation'
                    cardTitle={productName}
                    companyName={companyName}
                    rating={amBest}
                    handleApplyClick={onApply}
                    handlePlanShareClick={() => setShareModalOpen(true)}
                    handleIllustrationClick={handleIllustrationClick}
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
                    age={planDetails?.input?.actualAge}
                    healthClass={planDetails?.input?.healthClass}
                    premium={premium}
                    hideShareButton={true}
                  />
                </CollapsibleLayout>
              </div>
              {isLoadingApplyLifeIulQuote && (
                <Box sx={{ position: 'absolute', top: 0, left: '50%' }}>
                  <WithLoader isLoading={isLoadingApplyLifeIulQuote} />
                </Box>
              )}
            </Grid>
            <Grid item md={12} xs={12}>
              <div ref={productDescriptionRef} id='productDescription'>
                <IulQuoteDetailsSection title='Description'>
                  <Typography variant='body1' color='#434A51'>
                    {description}
                  </Typography>
                </IulQuoteDetailsSection>
              </div>
            </Grid>
            {features?.length > 0 && (
              <Grid item md={12} xs={12}>
                <div ref={productFeaturesRef} id='productFeatures'>
                  <ProductFeature title='Features' features={features} />
                </div>
              </Grid>
            )}
            {uwRequirements?.length > 0 && (
              <Grid item md={12} xs={12}>
                <div
                  ref={underwritingRequirementsRef}
                  id='underwritingRequirements'
                  className={styles.underwritingRequirements}
                >
                  <UnderwritingRequirements
                    requirements={uwRequirements}
                    title='Underwriting Requirements'
                    isPlanDetailsPage={true}
                  />
                </div>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <ApplyErrorModal
        open={applyErrorModalOpen}
        onClose={() => {
          setApplyErrorModalOpen(false);
          if (isQuickQuotePage) {
            navigate(
              `/life/iul-accumulation/${linkToExistContactId}/${planId}/quote-details`
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
      {shareModalOpen && (
        <IulShareModal
          open={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          planDetails={planDetails}
          quoteType='accumulation'
        />
      )}
    </IulQuoteContainer>
  );
};

export default IulAccumulationQuoteDetails;
