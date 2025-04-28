import { Box, Card, Typography, useMediaQuery, useTheme } from '@mui/material';
import CoverageCalculationsCard from '../CoverageCalculationsCard';
import { GridListItem } from '@integritymarketing/clients-ui-kit';
import { useCoverageCalculationsContext } from 'providers/CoverageCalculations';
import { useCallback, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import {
  faHouse,
  faSchool,
  faWallet,
  faCircleDollar,
} from '@awesome.me/kit-7ab3488df1/icons/classic/light';
import { formatCurrency } from 'utils/shared-utils/sharedUtility';
import NoCoverageModal from './NoCoverageModal';
import PropTypes from 'prop-types';
import IconBackGround from 'components/ui/IconBackGround';
import ShareModal from 'components/FnaShareModal';
import { useLeadDetails } from 'providers/ContactDetails';
import SaveToContact from 'components/QuickerQuote/Common/SaveToContact';
import { useCreateNewQuote } from 'providers/CreateNewQuote';

const CoverageReview = ({
  handleNext,
  handleBack,
  resetCurrentStep,
  yearsIncomeReplacement,
}) => {
  const { financialNeedsAnalysis } = useCoverageCalculationsContext();
  const navigate = useNavigate();
  const { contactId } = useParams();
  const { isQuickQuotePage } = useCreateNewQuote();
  const { getLeadDetailsAfterSearch } = useLeadDetails();
  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'));
  const [showShareModal, setShowShareModal] = useState(false);
  const [contactSearchModalOpen, setContactSearchModalOpen] = useState(false);
  const [linkToExistContactId, setLinkToExistContactId] = useState(null);

  const formatValue = value => {
    if (value === undefined || value === null) {
      return 'Not Provided';
    }
    return `$${formatCurrency(value)}`;
  };

  const headers = [
    { title: 'Asset Type', accessor: 'assetType' },
    { title: 'Client', accessor: 'value' },
  ];

  const tableData = useMemo(() => {
    return [
      {
        assetType: 'Debt',
        value: formatValue(financialNeedsAnalysis?.totalHouseholdDebt),
        assetTypeSubTitle: 'Total Household Debt',
        assetTypeIcon: (
          <IconBackGround backgroundColor='#052A63'>
            <FontAwesomeIcon icon={faWallet} size='lg' color='#FFF' />
          </IconBackGround>
        ),
      },
      {
        assetType: 'Income',
        value: formatValue(financialNeedsAnalysis?.totalAnnualIncome),
        assetTypeSubTitle: `${yearsIncomeReplacement}x Income`, // Dynamically display the slider value
        assetTypeIcon: (
          <IconBackGround backgroundColor='#052A63'>
            <FontAwesomeIcon icon={faCircleDollar} size='lg' color='#FFF' />
          </IconBackGround>
        ),
      },
      {
        assetType: 'Mortgage',
        value: formatValue(financialNeedsAnalysis?.remainingMortgageAmount),
        assetTypeSubTitle: 'Home Loan',
        assetTypeIcon: (
          <IconBackGround backgroundColor='#052A63'>
            <FontAwesomeIcon icon={faHouse} size='lg' color='#FFF' />
          </IconBackGround>
        ),
      },
      {
        assetType: 'Education',
        value: formatValue(
          financialNeedsAnalysis?.financialNeedsAnalysis?.educationNeeds
        ),
        assetTypeSubTitle: `$${formatCurrency(
          financialNeedsAnalysis?.educationNeedPerChild || 150000
        )} Per Child`,
        assetTypeIcon: (
          <IconBackGround backgroundColor='#052A63'>
            <FontAwesomeIcon icon={faSchool} size='lg' color='#FFF' />
          </IconBackGround>
        ),
      },
    ];
  }, [financialNeedsAnalysis, yearsIncomeReplacement]);

  const shouldNoCoverageModalOpen = useMemo(() => {
    const {
      totalHouseholdDebt,
      totalAnnualIncome,
      remainingMortgageAmount,
      educationNeedPerChild,
      totalAvailableSavings,
    } = financialNeedsAnalysis || {};

    return (
      !totalHouseholdDebt &&
      !totalAnnualIncome &&
      !remainingMortgageAmount &&
      !educationNeedPerChild &&
      !totalAvailableSavings
    );
  }, [financialNeedsAnalysis]);

  const handleShareModal = useCallback(() => {
    setShowShareModal(true);
  }, []);

  const handleOpenQuickQuoteShareModal = async leadId => {
    const response = await getLeadDetailsAfterSearch(leadId, true);
    if (response) {
      handleShareModal();
    }
  };

  const refreshQuickQuotePage = useCallback(() => {
    if (isQuickQuotePage) {
      navigate(`/coverage-calculations/${linkToExistContactId}`);
    }
  }, [isQuickQuotePage, linkToExistContactId, navigate]);

  return (
    <>
      {shouldNoCoverageModalOpen ? (
        <NoCoverageModal
          open={shouldNoCoverageModalOpen}
          onBack={handleBack}
          onContinue={resetCurrentStep}
          onClose={() =>
            navigate(`/contact/${contactId}/overview`, {
              state: { showProductCategoryModal: true },
            })
          }
        />
      ) : (
        <CoverageCalculationsCard
          title='We’ve calculated the coverage needs for your client.'
          subTitle='The following includes the details of coverage needs. This information
  can help you determine coverage that fits your client’s needs.'
          onContinue={handleNext}
          showBackButton
          onBack={handleBack}
          primaryButtonLabel='Start a Quote'
          showSkipButton={false}
          showShareButton
          onShare={() => {
            if (isQuickQuotePage) {
              setContactSearchModalOpen(true);
            } else {
              handleShareModal();
            }
          }}
        >
          <Box p={2} bgcolor='#F1F1F1' borderRadius={1}>
            <GridListItem data={tableData} headers={headers} />
            <Card sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                bgcolor='#F0F2F7'
                p={2}
                borderRadius={1}
                display={isMobile ? 'grid' : 'flex'}
                mx={2}
                mt={2}
                textAlign={isMobile ? 'center' : 'left'}
                color='#052A63'
              >
                <Typography fontWeight='bold' flex={1}>
                  Recommended Coverage
                </Typography>
                <Typography
                  fontWeight='bold'
                  flex={1}
                  color={isMobile ? '#434A51' : 'inherit'}
                >
                  {formatValue(
                    financialNeedsAnalysis?.financialNeedsAnalysis
                      ?.recommendedCoverage
                  )}
                </Typography>
              </Box>

              {financialNeedsAnalysis?.financialNeedsAnalysis
                ?.currentCoverage && (
                <Box
                  p={2}
                  borderRadius={1}
                  display={isMobile ? 'grid' : 'flex'}
                  mx={2}
                  textAlign={isMobile ? 'center' : 'left'}
                  color='#052A63'
                >
                  <Typography fontWeight='bold' flex={1}>
                    Current Coverage
                  </Typography>
                  <Typography
                    fontWeight='bold'
                    flex={1}
                    color={isMobile ? '#434A51' : 'inherit'}
                  >
                    {formatValue(
                      financialNeedsAnalysis?.financialNeedsAnalysis
                        ?.currentCoverage
                    )}
                  </Typography>
                </Box>
              )}

              <Box
                p={2}
                borderRadius={1}
                display={isMobile ? 'grid' : 'flex'}
                mx={2}
                textAlign={isMobile ? 'center' : 'left'}
                color='#052A63'
              >
                <Typography fontWeight='bold' flex={1}>
                  Additional Assets
                </Typography>
                <Typography
                  fontWeight='bold'
                  flex={1}
                  color={isMobile ? '#434A51' : 'inherit'}
                >
                  {formatValue(financialNeedsAnalysis?.totalAvailableSavings)}
                </Typography>
              </Box>
              <Box
                bgcolor='#E7F0FF'
                p={2}
                borderRadius={1}
                display={isMobile ? 'grid' : 'flex'}
                mx={2}
                mb={2}
                textAlign={isMobile ? 'center' : 'left'}
                color='#052A63'
              >
                <Typography fontWeight='bold' flex={1}>
                  Additional Insurance Needed
                </Typography>
                <Typography
                  fontWeight='bold'
                  flex={1}
                  color={isMobile ? '#434A51' : 'inherit'}
                >
                  {formatValue(
                    financialNeedsAnalysis?.financialNeedsAnalysis
                      ?.additionalInsuranceNeeded
                  )}
                </Typography>
              </Box>
            </Card>
          </Box>

          <Typography
            variant='body2'
            color='textSecondary'
            mt={2}
            fontStyle='italic'
          >
            Calculation is based on the information provided in previous
            responses.
          </Typography>
          <Typography
            variant='body2'
            color='textSecondary'
            mt={1}
            fontStyle='italic'
          >
            Disclaimer: This is basic needs coverage and may not include all
            needs.
          </Typography>
        </CoverageCalculationsCard>
      )}
      {showShareModal && (
        <ShareModal
          open={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            refreshQuickQuotePage();
          }}
          financialNeedsAnalysis={financialNeedsAnalysis}
          refreshQuickQuotePage={refreshQuickQuotePage}
        />
      )}

      <SaveToContact
        contactSearchModalOpen={contactSearchModalOpen}
        handleClose={() => setContactSearchModalOpen(false)}
        handleCallBack={response => {
          setLinkToExistContactId(response?.leadsId);
          handleOpenQuickQuoteShareModal(response?.leadsId);
        }}
        isApplyProcess={true}
      />
    </>
  );
};

CoverageReview.propTypes = {
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  resetCurrentStep: PropTypes.func.isRequired,
  yearsIncomeReplacement: PropTypes.number,
};

export default CoverageReview;
