import { useNavigate, useParams } from 'react-router-dom';
import {
  GET_QUOTE,
  VIEW_BUTTON,
  VIEW_QUOTE,
} from './PersonalisedQuoteBox.constants';
import styles from './PersonalisedQuoteBox.module.scss';
import { useCreateNewQuote } from '../../../../providers/CreateNewQuote';

const PersonalisedQuoteBox = () => {
  const navigate = useNavigate();
  const { contactId } = useParams();
  const { isSimplifiedIUL, isQuickQuotePage } = useCreateNewQuote();

  const handleNavigation = () => {
    if (isSimplifiedIUL()) {
      navigate(
        `/simplified-iul/healthconditions/${contactId}${
          isQuickQuotePage ? '?quick-quote=true' : ''
        }`
      );
    } else {
      navigate(
        `/finalexpenses/healthconditions/${contactId}${
          isQuickQuotePage ? '?quick-quote=true' : ''
        }`
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.heading}>{GET_QUOTE}</div>
        <div className={styles.subHeading}>{VIEW_QUOTE}</div>
      </div>
      <button className={styles.viewButton} onClick={handleNavigation}>
        {VIEW_BUTTON}
      </button>
    </div>
  );
};

export default PersonalisedQuoteBox;
