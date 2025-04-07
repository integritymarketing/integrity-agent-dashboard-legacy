import { useState, useCallback, useEffect } from 'react';
import { Menu, MenuItem, MenuList, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCreateNewQuote } from 'providers/CreateNewQuote';
import { QuickQuoteModals } from 'components/QuickerQuote/QuickerQuoteContainerModal';

import styles from './styles.module.scss';

import ContactsIcon from '../assets/Icon-Contacts.svg';
import QuoteIcon from '../assets/Icon-Quote.svg';
import PlusIcon from '../assets/icons-Plus.svg';

export default function PlusMenu() {
  const { getQuickQuoteLeadId } = useCreateNewQuote();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const createQuote = searchParams.get('create-quote');

  const handleClick = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleCreateQuote = useCallback(async () => {
    await getQuickQuoteLeadId();
    setAnchorEl(null);
  }, [getQuickQuoteLeadId]);

  useEffect(() => {
    if (createQuote) {
      handleCreateQuote();
    }
  }, [createQuote, handleCreateQuote]);

  const handleNavigateToContact = useCallback(() => {
    setAnchorEl(null);
    navigate('/contact/add-new');
  }, [navigate]);

  return (
    <>
      <button
        className={styles.plusIcon}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <img src={PlusIcon} alt='Plus Icon' />
      </button>
      <Menu
        id='plus-menu'
        aria-labelledby='plus-menu-button'
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transition
      >
        <MenuList sx={{ padding: '0px 8px' }} className={styles.menuList}>
          <Typography
            fontWeight={600}
            letterSpacing='normal'
            className={`text-body text-navyblue ${styles.createNewTypography}`}
          >
            Create New
          </Typography>
          <MenuItem
            onClick={handleCreateQuote}
            className={styles.menuItem}
            sx={{ padding: '6px 8px' }}
          >
            <img src={QuoteIcon} alt='Quote Icon' />
            Quick Quote
          </MenuItem>
          <MenuItem
            onClick={handleNavigateToContact}
            className={styles.menuItem}
            sx={{ padding: '6px 8px' }}
          >
            <img src={ContactsIcon} alt='Contacts Icon' />
            Contact
          </MenuItem>
        </MenuList>
      </Menu>
      <QuickQuoteModals />
    </>
  );
}
