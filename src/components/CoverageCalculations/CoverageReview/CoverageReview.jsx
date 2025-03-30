import { Box, Card, Grid, Typography } from '@mui/material';
import CoverageCalculationsCard from '../CoverageCalculationsCard';
import { GridListItem } from '@integritymarketing/clients-ui-kit';
import { useCoverageCalculationsContext } from 'providers/CoverageCalculations';
import { useMemo } from 'react';
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

const CoverageReview = ({ handleNext, handleBack, resetCurrentStep }) => {
  const { financialNeedsAnalysis } = useCoverageCalculationsContext();
  const navigate = useNavigate();
  const { contactId } = useParams();

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
            {' '}
            <FontAwesomeIcon icon={faWallet} size='lg' color='#FFF' />
          </IconBackGround>
        ),
      },
      {
        assetType: 'Income',
        value: formatValue(financialNeedsAnalysis?.totalAnnualIncome),
        assetTypeSubTitle: '10x Income',
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
        value: formatValue(financialNeedsAnalysis?.educationNeedPerChild),
        assetTypeSubTitle: '$150,000 Per Child',
        assetTypeIcon: (
          <IconBackGround backgroundColor='#052A63'>
            <FontAwesomeIcon icon={faSchool} size='lg' color='#FFF' />
          </IconBackGround>
        ),
      },
    ];
  }, [financialNeedsAnalysis]);

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
        >
          <Box p={2} bgcolor='#F1F1F1' borderRadius={1}>
            <GridListItem data={tableData} headers={headers} />
            <Card sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                bgcolor='#F0F2F7'
                p={2}
                borderRadius={1}
                display='flex'
                mx={2}
                mt={2}
              >
                <Typography fontWeight='bold' flex={1}>
                  Recommended Coverage
                </Typography>
                <Typography fontWeight='bold' flex={1}>
                  {formatValue(
                    financialNeedsAnalysis?.financialNeedsAnalysis
                      ?.recommendedCoverage
                  )}
                </Typography>
              </Box>

              {financialNeedsAnalysis?.financialNeedsAnalysis
                ?.currentCoverage && (
                <Grid container alignItems='center'>
                  <Typography fontWeight='bold' flex={1} ml={3}>
                    Current Coverage
                  </Typography>
                  <Typography fontWeight='bold' flex={1} ml={-3}>
                    {formatValue(
                      financialNeedsAnalysis?.financialNeedsAnalysis
                        ?.currentCoverage
                    )}
                  </Typography>
                </Grid>
              )}
              {financialNeedsAnalysis?.financialNeedsAnalysis?.assets529 && (
                <Grid container alignItems='center'>
                  <Typography fontWeight='bold' flex={1} ml={3}>
                    Additional Assets
                  </Typography>
                  <Typography fontWeight='bold' flex={1} ml={-3}>
                    {formatValue(
                      financialNeedsAnalysis?.financialNeedsAnalysis?.assets529
                    )}
                  </Typography>
                </Grid>
              )}
              <Box
                bgcolor='#E7F0FF'
                p={2}
                borderRadius={1}
                display='flex'
                justifyContent='space-between'
                m={2}
              >
                <Typography fontWeight='bold' flex={1}>
                  Additional Insurance Needed
                </Typography>
                <Typography fontWeight='bold' flex={1}>
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
    </>
  );
};

CoverageReview.propTypes = {
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  resetCurrentStep: PropTypes.func.isRequired,
};

export default CoverageReview;
