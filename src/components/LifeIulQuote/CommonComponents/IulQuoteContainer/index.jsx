import { Grid, Box } from '@mui/material';
import { IulQuoteHeader } from '../IulQuoteHeader';
import { IulFilterHeader } from '../QuoteFilterHeader';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ConditionalProfileBar from 'components/QuickerQuote/Common/ConditionalProfileBar';
import { useLifeIulQuote } from 'providers/Life';
import { ComparePlanFooter } from '@integritymarketing/clients-ui-kit';
import styles from './styles.module.scss';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { useCreateNewQuote } from 'providers/CreateNewQuote';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export const IulQuoteContainer = ({ title, children, page, quoteType }) => {
  const { contactId } = useParams();
  const query = useQuery();
  const sessionPlansStatus = query && query.get('preserveSelected');
  const navigate = useNavigate();
  const { isQuickQuotePage } = useCreateNewQuote();

  const {
    showFilters,
    setShowFilters,
    selectedPlans,
    handleComparePlanSelect,
    setSelectedPlans,
    tabSelected,
    isLoadingLifeIulQuote,
  } = useLifeIulQuote();

  const handleOnCompare = () => {
    const planIds = selectedPlans.map(plan =>
      encodeURIComponent(plan.policyDetailId)
    );

    sessionStorage.setItem('iul-compare-plans', JSON.stringify(selectedPlans));
    sessionStorage.setItem('iul-protection-tab', JSON.stringify(tabSelected));
    const url = `/life/iul-${quoteType}/${contactId}/${planIds.join(
      ','
    )}/compare-plans${isQuickQuotePage ? '?quick-quote=true' : ''}`;
    navigate(url);
  };

  useEffect(() => {
    if (page === 'plans page' && sessionPlansStatus) {
      const plans = JSON.parse(sessionStorage.getItem('iul-compare-plans'));
      if (plans && plans.length > 0) {
        setSelectedPlans([...plans]);
      }
    }
  }, [sessionPlansStatus, page, setSelectedPlans]);

  const backRoute = useMemo(() => {
    return page === 'plan compare page'
      ? `/life/iul-${quoteType}/${contactId}/quote?preserveSelected=true${
          isQuickQuotePage ? '&quick-quote=true' : ''
        }`
      : page === 'plans details page'
      ? `/life/iul-${quoteType}/${contactId}/quote${
          isQuickQuotePage ? '?quick-quote=true' : ''
        }`
      : `/life/iul-${quoteType}/${contactId}/product-preferences`;
  }, [contactId, page, quoteType, isQuickQuotePage]);
  return (
    <>
      {!showFilters && (
        <ConditionalProfileBar
          leadId={contactId}
          backRoute={backRoute}
          page={quoteType}
        />
      )}

      {showFilters && (
        <IulFilterHeader
          title={'Filters'}
          onClick={() => setShowFilters(false)}
        />
      )}
      <Box className={styles.iulQuoteContainer}>
        <Grid container gap={3}>
          {!showFilters && (
            <Grid item md={12} xs={12}>
              <IulQuoteHeader title={title} />
            </Grid>
          )}
          {children}
        </Grid>
      </Box>
      {page === 'plans page' &&
        selectedPlans.length > 0 &&
        !isLoadingLifeIulQuote && (
          <ComparePlanFooter
            plans={selectedPlans}
            onClose={handleComparePlanSelect}
            onCompare={handleOnCompare}
          />
        )}
    </>
  );
};

IulQuoteContainer.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  page: PropTypes.string.isRequired,
  quoteType: PropTypes.string.isRequired,
};

export default IulQuoteContainer;
