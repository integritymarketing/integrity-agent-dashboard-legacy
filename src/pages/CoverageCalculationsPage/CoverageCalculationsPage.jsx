import { Helmet } from 'react-helmet-async';

import GlobalFooter from 'partials/global-footer';
import GlobalNav from 'partials/global-nav-v2';
import { useCreateNewQuote } from 'providers/CreateNewQuote';
import { useEffect } from 'react';
import { LIFE_QUESTION_CARD_LIST } from 'components/CreateNewQuoteContainer/QuickQuoteModals/LifeQuestionCard/constants';
import { QUOTE_TYPE_LABEL } from 'components/ContactDetailsContainer/OverviewContainer/overviewContainer.constants';
import CoverageCalculationsContainer from 'components/CoverageCalculations/CoverageCalculationsContainer';
import { Box } from '@mui/material';

const CoverageCalculationsPage = () => {
  const { setSelectedLifeProductType } = useCreateNewQuote();

  useEffect(() => {
    setSelectedLifeProductType(LIFE_QUESTION_CARD_LIST.FINAL_EXPENSE);
  }, [setSelectedLifeProductType]);

  return (
    <>
      <Helmet>
        <title>Integrity - Coverage calculations</title>
      </Helmet>
      <GlobalNav showQuoteType={QUOTE_TYPE_LABEL.LIFE} />
      <Box bgcolor='#F1F1F1'>
        <CoverageCalculationsContainer />
      </Box>
      <GlobalFooter />
    </>
  );
};

export default CoverageCalculationsPage;
