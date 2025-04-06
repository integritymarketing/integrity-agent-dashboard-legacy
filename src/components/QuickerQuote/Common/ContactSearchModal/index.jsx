/* eslint-disable max-lines-per-function */
import { useCallback, useEffect, useState } from 'react';
import { onlyAlphabets } from 'utils/shared-utils/sharedUtility';
import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  CircularProgress,
  InputAdornment,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { CustomModal } from 'components/MuiComponents';
import { styled } from '@mui/system';
import { debounce } from 'lodash';
import useToast from 'hooks/useToast';
import ContactListItem from './ContactListItem';
import CreateNewContactIcon from 'components/icons/CreateNewContact';
import { useLeadDetails } from 'providers/ContactDetails';
import ContinueIcon from 'components/icons/Continue';
import * as Sentry from '@sentry/react';
import styles from './styles.module.scss';
import { useCountyDataContext } from 'providers/CountyDataProvider';
import { useContactListAPI } from 'providers/ContactListAPIProviders';

const StyledSearchInput = styled(TextField)(() => ({
  background: '#FFFFFF 0 0 no-repeat padding-box',
  borderRadius: '4px',
  '& input::placeholder': {
    color: '#434A51',
    fontSize: '16px',
  },
  '& .MuiAutocomplete-input': {
    height: '10px',
  },
}));

const AutocompleteWrapper = styled('div')({
  position: 'relative',
  width: '100%',
});

const contactSearchModalOpen = ({ open, handleClose, handleSelectedLead }) => {
  const { getLeadDetails, updateLeadDetailsWithZipCode } = useLeadDetails();
  const { getLeadsList } = useContactListAPI();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const createQuote = searchParams.get('create-quote');
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [contactList, setContactList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tempLead, setTempLead] = useState(null);

  const showToast = useToast();
  const { fetchCountiesData, setZipCode } = useCountyDataContext();

  const handleCloseModal = () => {
    if (createQuote) {
      navigate('/contacts/list');
    }
    handleClose(false);
  };

  const handleSearchInputChange = (event, value) => {
    setSearchQuery(value);
    if (value.length >= 3) {
      if (tempLead) {
        setTempLead(null);
      }
      debouncedContactSearch(value);
    } else {
      setContactList([]);
      setTempLead(null);
    }
  };

  const handleSelectNewContact = contact => {
    handleSelectedLead(contact, 'new');
  };

  const handleSelectOldContact = useCallback(
    async contact => {
      const zipCode = contact?.addresses?.[0]?.postalCode;
      setZipCode(zipCode);
      if (!contact?.addresses?.[0]?.county && zipCode) {
        try {
          const countiesData = await fetchCountiesData(zipCode);
          if (countiesData?.length === 1) {
            const payload = {
              ...contact,
              addresses: [
                {
                  ...contact?.addresses?.[0],
                  county: countiesData[0]?.countyName,
                  countyFips: countiesData[0]?.countyFIPS,
                  stateCode: countiesData[0]?.state,
                },
              ],
            };

            await updateLeadDetailsWithZipCode(payload);
          }
        } catch (error) {
          Sentry.captureException(error);
        }
      }
      setTempLead(contact);
      setSearchQuery(`${contact.firstName} ${contact.lastName}`);
    },
    [setZipCode, fetchCountiesData, updateLeadDetailsWithZipCode]
  );

  const onClose = () => {
    handleCloseModal();
  };

  const fetchContacts = useCallback(
    async query => {
      setLoading(true);
      try {
        const response = await getLeadsList(
          undefined,
          undefined,
          ['CreateDate:desc'],
          query,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          false,
          true,
          false
        );
        if (response && response.result) {
          setContactList(response.result);
        }
      } catch (error) {
        showToast({
          type: 'error',
          message: `${error.message}`,
        });
      } finally {
        setLoading(false);
      }
    },
    [getLeadsList, showToast]
  );

  const debouncedContactSearch = useCallback(
    debounce(query => {
      if (query.length >= 3) {
        fetchContacts(query);
      }
    }, 1000),
    [fetchContacts]
  );

  useEffect(() => {
    return () => {
      debouncedContactSearch.cancel();
    };
  }, [debouncedContactSearch]);

  const renderAutocompleteOption = (props, option) => {
    if (tempLead) {
      return null;
    }
    if (option.isNewContact) {
      return (
        <ListItem
          {...props}
          onClick={() => handleSelectNewContact(searchQuery)}
          className={styles.listItem}
        >
          <ListItemText
            primary={
              <Box
                display='flex'
                alignItems='center'
                sx={{ cursor: 'pointer' }}
              >
                <CreateNewContactIcon />
                <Typography variant='subtitle1' style={{ marginLeft: 8 }}>
                  Create new contact for{' '}
                  <span style={{ color: '#0052ce' }}>{searchQuery}</span>
                </Typography>
              </Box>
            }
          />
        </ListItem>
      );
    }

    if (option.isWarning) {
      return (
        <ListItem {...props} onClick={e => e.preventDefault()}>
          <ListItemText
            primary={
              <Typography color='textSecondary' variant='subtitle1'>
                Please enter at least 3 characters to search
              </Typography>
            }
          />
        </ListItem>
      );
    }
    return (
      <ContactListItem
        {...props}
        key={`${option.leadsId}-${option.createDate}-${option.leadStatusId}`}
        contact={option}
        handleClick={handleSelectOldContact}
      />
    );
  };

  const handleSubmit = async () => {
    const leadId = tempLead?.leadsId;
    const zipCode = tempLead?.addresses?.[0]?.postalCode;
    if (!tempLead?.addresses?.[0]?.county && zipCode) {
      try {
        const countiesData = await fetchCountiesData(zipCode);
        if (countiesData?.length === 1) {
          const payload = {
            ...tempLead,
            addresses: [
              {
                ...tempLead?.addresses?.[0],
                county: countiesData[0]?.countyName,
                countyFips: countiesData[0]?.countyFIPS,
                stateCode: countiesData[0]?.state,
              },
            ],
          };

          await updateLeadDetailsWithZipCode(payload);
        }
      } catch (error) {
        Sentry.captureException(error);
      }
    }
    const response = await getLeadDetails(leadId);

    if (response) {
      handleSelectedLead(response, 'old');
    }
  };

  return (
    <CustomModal
      title={'Start a Quote'}
      open={open}
      handleClose={onClose}
      showCloseButton
      maxWidth='sm'
      disableContentBackground
      footer
      handleSave={handleSubmit}
      shouldShowCancelButton={true}
      isSaveButtonDisabled={!tempLead}
      saveLabel='Continue'
      footerActionIcon={<ContinueIcon />}
    >
      <Box marginBottom={'20px'}>
        <Typography
          sx={{
            fontSize: '20px',
            fontWeight: '500',
            color: '#052A63',
          }}
        >
          Enter your client’s name to get started
        </Typography>
      </Box>

      <AutocompleteWrapper>
        <Autocomplete
          blurOnSelect={true}
          clearOnBlur={false}
          openOnFocus={true}
          options={
            searchQuery.length >= 3
              ? [
                  ...contactList,
                  { firstName: '', lastName: '', isNewContact: true },
                ]
              : [{ isWarning: true }]
          }
          getOptionLabel={option =>
            option.isNewContact ? '' : `${option.firstName} ${option.lastName}`
          }
          filterOptions={options => options}
          renderOption={renderAutocompleteOption}
          inputValue={searchQuery}
          onInputChange={handleSearchInputChange}
          ListboxProps={{
            style: {
              maxHeight: 200,
              overflow: 'auto',
              padding: '20px',
              marginTop: '4px',
              display: tempLead ? 'none' : 'block',
            },
          }}
          renderInput={params => (
            <StyledSearchInput
              {...params}
              onKeyDown={onlyAlphabets}
              type='text'
              placeholder='Start by typing a contact’s name'
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <div className={styles.flexAlignCenter}>
                        <CircularProgress color='inherit' size={20} />
                      </div>
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon style={{ color: '#0052CE' }} />
                  </InputAdornment>
                ),
                style: {
                  height: '48px',
                },
              }}
            />
          )}
        />
      </AutocompleteWrapper>
    </CustomModal>
  );
};

export default contactSearchModalOpen;
