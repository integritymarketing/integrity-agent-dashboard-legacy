import { useCreateNewQuote } from 'providers/CreateNewQuote';
import { useMediaQuery, useTheme } from '@mui/material';

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

import useFetch from 'hooks/useFetch';
import WithLoader from 'components/ui/WithLoader';

import {
  CONFIRM_DETAILS_SUBTEXT,
  CONFIRM_DETAILS_TEXT,
  GET_COUNTIES,
} from 'components/AddZipContainer/AddZipContainer.constants';
import styles from 'components/AddZipContainer/AddZipContainer.module.scss';
import { getTransformedCounties } from 'components/AddZipContainer/AddZipContainer.utils';
import { SelectCounty } from 'components/AddZipContainer/SelectCounty/SelectCounty';
import { ZipCodeInput } from 'components/AddZipContainer/ZipCodeInput/ZipCodeInput';
import { Box, Button } from '@mui/material';
import ButtonCircleArrow from 'components/icons/button-circle-arrow';
import useAnalytics from "hooks/useAnalytics";
import {useLeadDetails} from "providers/ContactDetails";

const ZipCodeInputCard = () => {
  const navigate = useNavigate();
  const {
    handleClose,
    updateQuickQuoteLeadDetails,
    quickQuoteLeadDetails,
    isLoadingQuickQuoteLeadDetails,
    isQuickQuotePage,
  } = useCreateNewQuote();
  const {leadDetails} = useLeadDetails();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [zipCode, setZipCode] = useState('');
  const [allCounties, setAllCounties] = useState([]);
  const [countyObj, setCountyObj] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [zipError, setZipError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const URL = `${GET_COUNTIES}${zipCode}`;
  const { Get: getCounties } = useFetch(URL);
  const {fireEvent} = useAnalytics();

  const handleContinue = async () => {
    const { countyFIPS, countyName, state } = countyObj;

    const payload = {
      ...quickQuoteLeadDetails,
      zipCode: zipCode,
      countyFips: countyFIPS,
      stateCode: state,
      county: countyName,
    };
    const res = await updateQuickQuoteLeadDetails(payload);
    if (res && res?.leadId) {

        fireEvent("New Quote Created With Instant Quote", {
          leadId: leadDetails?.leadsId,
          line_of_business: "Health",
          contactType: "New Contact",
        });

      navigate(`/plans/${res.leadId}?quick-quote=true`);
      handleClose();
    }
  };

  const fetchCounties = useCallback(
    async zipcode => {
      if (zipcode) {
        setIsLoading(true);
        const counties = await getCounties();
        setIsLoading(false);
        if (counties?.length === 1) {
          setCountyObj(...counties);
          setAllCounties([]);
          setIsSubmitDisabled(false);
          setZipError(false);
        } else if (counties?.length > 1) {
          setAllCounties(getTransformedCounties(counties) || []);
          setIsSubmitDisabled(true);
          setZipError(false);
        } else {
          setAllCounties([]);
          setIsSubmitDisabled(true);
          setZipError(true);
        }
      }
    },
    [getCounties]
  );

  const debounceZipFn = debounce(zipcode => setZipCode(zipcode), 1000);

  const onSelectCounty = county => {
    const { key, value, state } = county;
    setCountyObj({ countyFIPS: key, countyName: value, state });
    setIsSubmitDisabled(false);
  };

  const handleZipCode = zipcode => {
    if (zipcode) {
      debounceZipFn(zipcode);
    } else {
      setIsSubmitDisabled(true);
    }
  };

  useEffect(() => {
    if (zipCode) {
      fetchCounties(zipCode);
    }
  }, [fetchCounties, zipCode]);

  return (
    <>
      <div className={styles.addZipContainer}>
        <div className={styles.quickQuote}>
          <div className={styles.detailsTitle}>{CONFIRM_DETAILS_TEXT}</div>
          <div className={styles.detailsSubTitle}>
            {CONFIRM_DETAILS_SUBTEXT}
          </div>
          <ZipCodeInput
            defaultValue={zipCode}
            handleZipCode={handleZipCode}
            zipError={zipError}
          />
          <WithLoader isLoading={isLoading}>
            {zipCode && allCounties.length > 0 && (
              <SelectCounty
                counties={allCounties}
                isMobile={isMobile}
                onSelectCounty={onSelectCounty}
              />
            )}
          </WithLoader>
        </div>
      </div>

      <Box className={styles.submitButtonContainer}>
        <Button
          onClick={handleContinue}
          size='medium'
          variant='contained'
          color='primary'
          disabled={isSubmitDisabled || isLoadingQuickQuoteLeadDetails}
          endIcon={<ButtonCircleArrow />}
        >
          {isLoadingQuickQuoteLeadDetails ? 'Loading...' : 'Continue'}
        </Button>
      </Box>
    </>
  );
};

export default ZipCodeInputCard;
