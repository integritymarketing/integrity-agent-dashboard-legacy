import React from 'react';
import PropTypes from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';
import MobileMenu from './MobileMenu';
import PlusMenu from './plusMenu';
import MyButton from './MyButton';

const SmallFormatNav = ({
  navOpen,
  setNavOpen,
  page,
  leadPreference,
  agentInformation,
  hasPHPBuName,
}) => {
  return (
    <React.Fragment>
      <MyButton
        leadPreference={leadPreference}
        page={page}
        hasActiveCampaign={agentInformation?.hasActiveCampaign}
      />
      <div
        className={`${
          page === 'taskListMobileLayout'
            ? 'global-nav-v2__taskList-mobile flex'
            : 'global-nav-v2__mobile-trigger flex'
        }`}
      >
        <PlusMenu />
        <button className='icon-btn' onClick={() => setNavOpen(true)}>
          <span className='visually-hidden'>Open Navigation Menu</span>
          <MenuIcon
            aria-hidden='true'
            className='text-white'
            fontSize='large'
          />
        </button>
      </div>

      <nav
        className={`modal-nav ${navOpen ? '' : 'visually-hidden'}`}
        style={navOpen ? {} : { width: 0 }}
      >
        <MobileMenu
          onClose={() => setNavOpen(false)}
          isOpen={navOpen}
          hasPHPBuName={hasPHPBuName}
        />
      </nav>
    </React.Fragment>
  );
};
SmallFormatNav.propTypes = {
  navOpen: PropTypes.bool.isRequired,
  setNavOpen: PropTypes.func.isRequired,
  page: PropTypes.string.isRequired,
  leadPreference: PropTypes.object,
  agentInformation: PropTypes.shape({
    hasActiveCampaign: PropTypes.bool,
  }),
  hasPHPBuName: PropTypes.bool,
};

export default SmallFormatNav;
