import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import GlobalFooter from 'partials/global-footer';
import GlobalNav from 'partials/global-nav-v2';
import { QUOTE_TYPE_LABEL } from 'components/ContactDetailsContainer/OverviewContainer/overviewContainer.constants';
import { CarriersContainer } from 'components/LifeIulQuote/CarriersContainer';

const StyledBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  backgroundColor: '#f1f1f1',
}));

const GulProductCarriersPage = () => {
  return (
    <>
      <Helmet>
        <title>Integrity - Gul Product Carriers</title>
      </Helmet>
      <GlobalNav showQuoteType={QUOTE_TYPE_LABEL.LIFE} />
      <StyledBox>
        <CarriersContainer title='Guaranteed UL' query='gul' />
      </StyledBox>
      <GlobalFooter />
    </>
  );
};

export default GulProductCarriersPage;
