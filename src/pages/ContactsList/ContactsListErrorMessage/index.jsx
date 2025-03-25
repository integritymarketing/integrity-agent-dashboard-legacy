import { Box } from '@mui/material';
import { NoResultsError } from '@integritymarketing/clients-ui-kit';
import { useNavigate } from 'react-router-dom';
import {
  NoResults,
  Error500,
  NoInternet,
  GenericError,
  NoContactsAdded,
} from 'components/icons/errorImages';
import { useContactsListContext } from 'pages/ContactsList/providers/ContactsListProvider';
import PropTypes from 'prop-types';

function ContactsListErrorMessage({ errorCode }) {
  const navigate = useNavigate();
  const { clearAllFilters } = useContactsListContext();

  const handleNavigateToLearningCenter = () => {
    window.open('/learning-center', '_blank');
  };

  const allErrorsData = {
    204: {
      title: 'No Results Found',
      subtitle:
        'There are no products available based on your current search settings. Please change your search or reset the filter setting.',
      helpText: 'Need help? Check out our ',
      helpLinkText: 'LearningCENTER.',
      onHelpLinkClick: handleNavigateToLearningCenter,
      image: <NoResults />,
      buttonText: 'Clear All Filters',
      onButtonClick: () => {
        clearAllFilters();
      },
    },
    500: {
      title: 'Error 500',
      subtitle:
        'The server was unable to complete your request. Please try again later.',
      image: <Error500 />,
      buttonText: 'Reload',
      onButtonClick: () => {
        window.location.reload();
      },
    },

    400: {
      title: 'Error 400',
      subtitle:
        'The request could not be understood by the server due to malformed syntax.',
      image: <Error500 />,
      buttonText: 'Reload',
      onButtonClick: () => {
        window.location.reload();
      },
    },
    offline: {
      title: 'No Connection',
      subtitle: 'No internet found. Please check your connection or try again.',
      image: <NoInternet />,
      buttonText: 'Retry',
      onButtonClick: () => {
        window.location.reload();
      },
    },
    noLeads: {
      title: 'No Contact Added yet',
      subtitle:
        'There are no contacts currently available. Please Import or Add New contact to get started.',
      helpText: 'Need help? Check out our ',
      helpLinkText: 'LearningCENTER.',
      onHelpLinkClick: handleNavigateToLearningCenter,
      image: <NoContactsAdded />,
      buttonText: 'Add New',
      onButtonClick: () => {
        navigate('/contact/add-new');
      },
    },
    generic: {
      title: 'Error',
      subtitle:
        'The request could not be understood by the server due to malformed syntax.',
      image: <GenericError />,
      buttonText: 'Reload',
      onButtonClick: () => {
        window.location.reload();
      },
    },
  };

  const errorData = allErrorsData[errorCode] || allErrorsData.generic;

  return (
    <Box>
      <NoResultsError {...errorData} />
    </Box>
  );
}

ContactsListErrorMessage.propTypes = {
  errorCode: PropTypes.number || PropTypes.string,
};

export default ContactsListErrorMessage;
