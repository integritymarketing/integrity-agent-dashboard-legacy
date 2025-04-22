import React from 'react';
import { HeaderUnAuthenticated } from 'components/HeaderUnAuthenticated';
import { FooterUnAuthenticated } from 'components/FooterUnAuthenticated';
import { NoResultsError } from '@integritymarketing/clients-ui-kit';
import { GenericError } from 'components/icons/errorImages';
import { ContainerUnAuthenticated } from 'components/ContainerUnAuthenticated';
import { faCircleArrowLeft } from '@awesome.me/kit-7ab3488df1/icons/classic/light';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NotFound = () => {
  const errorData = {
    title: 'Page Not Found',
    subtitle: 'The requested resource could not be found.',
    image: <GenericError />,
    buttonText: (
      <span>
        <FontAwesomeIcon icon={faCircleArrowLeft} size='lg' /> Go Back
      </span>
    ),
    onButtonClick: () => {
      window.history.back();
    },
  };
  return (
    <div className='content-frame v2'>
      <HeaderUnAuthenticated />
      <ContainerUnAuthenticated>
        <NoResultsError {...errorData} />
      </ContainerUnAuthenticated>
      <FooterUnAuthenticated />
    </div>
  );
};

export default NotFound;
