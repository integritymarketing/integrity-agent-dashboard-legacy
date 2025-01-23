import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Back from 'components/icons/back';
import './index.scss';

const BackNav = ({ title = '', leadId }) => {
  const navigate = useNavigate();
  const noTitle = title === 'Back to ';
  
  const goBack = () => {
    if (noTitle) {
      navigate(`/contact/${leadId}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="back-nav-header">
      <div className="nav-wrapper">
        <div onClick={goBack} className="back-button">
          <Back />
        </div>
        <div onClick={goBack} className="back-title">
          {title}
          {noTitle ? 'Contact Details Page' : ''}
        </div>
      </div>
    </div>
  );
};

BackNav.propTypes = {
  title: PropTypes.string,
  leadId: PropTypes.string.isRequired,
};

BackNav.defaultProps = {
  title: '',
};

export default BackNav;
