import { ActionButton } from '@integritymarketing/ui-button-components';
import {
  ImpactText,
  SectionTitle,
} from '@integritymarketing/ui-text-components';

import ItemsContainer from 'components/ItemsContainer';

import SplitContentImageSection from 'components/SplitContentImageSection';

import useConstants from './constants';

import styles from './styles.module.scss';
import Header from '../../components/Header';
import * as Sentry from '@sentry/react';
import { useAuth0 } from '@auth0/auth0-react';
import useFlashMessage from 'hooks/useFlashMessage';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const { HERO_TEXT, HERO_TITLE } = useConstants();
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const { show: showMessage } = useFlashMessage();
  const navigate = useNavigate();

  async function login() {
    try {
      await loginWithRedirect({
        authorizationParams: {
          redirect_uri: `${window.location.origin}/dashboard`,
        },
      });
    } catch (e) {
      Sentry.captureException(e);
      showMessage('Unable to sign in at this time.', { type: 'error' });
    }
  }

  if (isLoading) {
    return null;
  }
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className={styles.mainLayout}>
      <SplitContentImageSection>
        <div className={styles.layout}>
          <SectionTitle className={styles.sectionTitle} text={HERO_TITLE} />

          <ImpactText className={styles.impactText} text={HERO_TEXT} />

          <ItemsContainer>
            <ActionButton
              text='Get Started'
              onClick={() => {
                window.open(
                  `${import.meta.env.VITE_AUTH_BASE_URL}/register?client_id=AEPortal`
                );
              }}
            />
          </ItemsContainer>
          <br />
          <ItemsContainer>
            <ActionButton text='Login' onClick={login} />
          </ItemsContainer>
        </div>
      </SplitContentImageSection>
    </div>
  );
};

export default Welcome;
