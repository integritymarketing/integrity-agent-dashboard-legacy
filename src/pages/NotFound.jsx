import React from 'react';
import { HeaderUnAuthenticated } from 'components/HeaderUnAuthenticated';
import { FooterUnAuthenticated } from 'components/FooterUnAuthenticated';
import { NoResultsError } from '@integritymarketing/clients-ui-kit';
import { GenericError } from 'components/icons/errorImages';
import { ContainerUnAuthenticated } from 'components/ContainerUnAuthenticated';

const NotFound = () => {
  const errorData = {
    title: 'Page Not Found',
    subtitle: 'The requested source could not be found',
    image: <GenericError />,
    buttonText: 'Go Back',
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
